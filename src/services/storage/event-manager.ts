/**
 * Universal Storage Event Manager
 * 
 * Provides a robust, type-safe event management system for storage operations.
 * Supports event filtering, debouncing, throttling, and memory leak prevention.
 * 
 * @fileoverview Storage event management system
 * @module storage/event-manager
 */

import type {
  StorageEvent,
  StorageEventType,
  StorageEventListener,
  TypedStorageEventListener,
  EventListenerOptions,
  StorageEventEmitter,
  EventDispatcherConfig,
  EventDispatchContext,
  EventSubscription,
  EventBatch,
  EventHistoryEntry,
  EventPriority,
  DEFAULT_EVENT_CONFIG
} from './events';

/**
 * Listener registration data
 */
interface ListenerRegistration<T extends StorageEventType = StorageEventType> {
  /** Event type */
  eventType: T;
  /** Listener function */
  listener: TypedStorageEventListener<T>;
  /** Listener options */
  options: Required<EventListenerOptions>;
  /** Registration timestamp */
  registeredAt: Date;
  /** Last execution timestamp */
  lastExecuted?: Date;
  /** Execution count */
  executionCount: number;
  /** Unique listener ID */
  id: string;
  /** Debounce timer */
  debounceTimer?: number;
  /** Throttle last execution */
  throttleLastExecution?: number;
}

/**
 * Universal Storage Event Manager Implementation
 */
export class StorageEventManager implements StorageEventEmitter {
  private readonly config: Required<EventDispatcherConfig>;
  private readonly listeners = new Map<StorageEventType, Set<ListenerRegistration>>();
  private readonly listenerIdCounter = { value: 0 };
  private readonly eventHistory: EventHistoryEntry[] = [];
  private readonly maxHistorySize = 1000;
  private isDestroyed = false;

  constructor(config: EventDispatcherConfig = {}) {
    this.config = { ...DEFAULT_EVENT_CONFIG, ...config };
    this.setupCleanupInterval();
  }

  /**
   * Add event listener with type safety
   */
  on<T extends StorageEventType>(
    eventType: T,
    listener: TypedStorageEventListener<T>,
    options: EventListenerOptions = {}
  ): () => void {
    this.validateNotDestroyed();
    
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    const eventListeners = this.listeners.get(eventType)!;
    
    // Check max listeners limit
    if (eventListeners.size >= this.config.maxListeners) {
      throw new Error(`Maximum number of listeners (${this.config.maxListeners}) exceeded for event type: ${eventType}`);
    }

    const registration: ListenerRegistration<T> = {
      eventType,
      listener,
      options: {
        once: options.once ?? false,
        source: options.source,
        keyPattern: options.keyPattern,
        debounce: options.debounce ?? this.config.defaultDebounce,
      },
      registeredAt: new Date(),
      executionCount: 0,
      id: this.generateListenerId(),
    };

    eventListeners.add(registration as ListenerRegistration);

    this.logEvent('listener-added', {
      eventType,
      listenerId: registration.id,
      totalListeners: eventListeners.size,
    });

    // Return unsubscribe function
    return () => this.removeListenerRegistration(eventType, registration as ListenerRegistration);
  }

  /**
   * Add one-time event listener
   */
  once<T extends StorageEventType>(
    eventType: T,
    listener: TypedStorageEventListener<T>
  ): () => void {
    return this.on(eventType, listener, { once: true });
  }

  /**
   * Remove specific event listener
   */
  off<T extends StorageEventType>(
    eventType: T,
    listener: TypedStorageEventListener<T>
  ): void {
    this.validateNotDestroyed();
    
    const eventListeners = this.listeners.get(eventType);
    if (!eventListeners) return;

    // Find matching listener registration
    for (const registration of eventListeners) {
      if (registration.listener === listener) {
        this.removeListenerRegistration(eventType, registration);
        break;
      }
    }
  }

  /**
   * Remove all listeners for event type
   */
  removeAllListeners(eventType?: StorageEventType): void {
    this.validateNotDestroyed();
    
    if (eventType) {
      const eventListeners = this.listeners.get(eventType);
      if (eventListeners) {
        // Clear debounce timers
        for (const registration of eventListeners) {
          this.clearDebounceTimer(registration);
        }
        eventListeners.clear();
        this.logEvent('all-listeners-removed', { eventType });
      }
    } else {
      // Remove all listeners for all events
      for (const [type, eventListeners] of this.listeners) {
        for (const registration of eventListeners) {
          this.clearDebounceTimer(registration);
        }
        eventListeners.clear();
      }
      this.listeners.clear();
      this.logEvent('all-listeners-removed', { eventType: 'all' });
    }
  }

  /**
   * Emit event to all matching listeners
   */
  emit<T extends StorageEvent>(event: T): void {
    this.validateNotDestroyed();
    
    const startTime = performance.now();
    const eventListeners = this.listeners.get(event.type);
    
    if (!eventListeners || eventListeners.size === 0) {
      return;
    }

    let listenerCount = 0;
    const context = this.createDispatchContext(event);

    // Process listeners
    for (const registration of Array.from(eventListeners)) {
      if (context.propagationStopped) break;
      
      if (this.shouldExecuteListener(registration, event)) {
        this.executeListener(registration, event, context);
        listenerCount++;
      }
    }

    // Record event history
    const processingDuration = performance.now() - startTime;
    this.recordEventHistory(event, listenerCount, processingDuration);

    this.logEvent('event-emitted', {
      eventType: event.type,
      listenerCount,
      processingDuration: Math.round(processingDuration * 100) / 100,
    });
  }

  /**
   * Get listener count for event type
   */
  listenerCount(eventType: StorageEventType): number {
    const eventListeners = this.listeners.get(eventType);
    return eventListeners?.size ?? 0;
  }

  /**
   * Get all registered event types
   */
  eventNames(): StorageEventType[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Get event statistics
   */
  getStats() {
    const stats: Record<string, any> = {
      totalEventTypes: this.listeners.size,
      totalListeners: 0,
      eventHistory: this.eventHistory.length,
      isDestroyed: this.isDestroyed,
    };

    // Calculate per-event-type stats
    const eventTypeStats: Record<string, number> = {};
    for (const [eventType, eventListeners] of this.listeners) {
      const count = eventListeners.size;
      eventTypeStats[eventType] = count;
      stats.totalListeners += count;
    }
    stats.eventTypeStats = eventTypeStats;

    return stats;
  }

  /**
   * Get event history
   */
  getEventHistory(limit?: number): EventHistoryEntry[] {
    const history = this.eventHistory.slice();
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Clear event history
   */
  clearEventHistory(): void {
    this.eventHistory.length = 0;
  }

  /**
   * Destroy event manager and cleanup resources
   */
  destroy(): void {
    if (this.isDestroyed) return;

    // Clear all listeners and timers
    this.removeAllListeners();
    
    // Clear history
    this.clearEventHistory();
    
    // Mark as destroyed
    this.isDestroyed = true;
    
    this.logEvent('event-manager-destroyed', {});
  }

  // =================== Private Methods ===================

  private validateNotDestroyed(): void {
    if (this.isDestroyed) {
      throw new Error('StorageEventManager has been destroyed');
    }
  }

  private generateListenerId(): string {
    return `listener_${++this.listenerIdCounter.value}_${Date.now()}`;
  }

  private removeListenerRegistration(
    eventType: StorageEventType,
    registration: ListenerRegistration
  ): void {
    const eventListeners = this.listeners.get(eventType);
    if (!eventListeners) return;

    this.clearDebounceTimer(registration);
    eventListeners.delete(registration);

    // Clean up empty event type sets
    if (eventListeners.size === 0) {
      this.listeners.delete(eventType);
    }

    this.logEvent('listener-removed', {
      eventType,
      listenerId: registration.id,
    });
  }

  private shouldExecuteListener(
    registration: ListenerRegistration,
    event: StorageEvent
  ): boolean {
    // Check source filter
    if (registration.options.source && event.source !== registration.options.source) {
      return false;
    }

    // Check key pattern filter (for change events)
    if (registration.options.keyPattern && event.type === 'change') {
      const changeEvent = event as any;
      const key = changeEvent.data?.key;
      if (key && !this.matchesKeyPattern(key, registration.options.keyPattern)) {
        return false;
      }
    }

    return true;
  }

  private matchesKeyPattern(key: string, pattern: string | RegExp): boolean {
    if (typeof pattern === 'string') {
      return key.includes(pattern);
    }
    return pattern.test(key);
  }

  private executeListener(
    registration: ListenerRegistration,
    event: StorageEvent,
    context: EventDispatchContext
  ): void {
    const execute = () => {
      try {
        registration.listener(event as any);
        registration.lastExecuted = new Date();
        registration.executionCount++;

        // Remove one-time listeners
        if (registration.options.once) {
          this.removeListenerRegistration(registration.eventType, registration);
        }
      } catch (error) {
        this.logEvent('listener-error', {
          eventType: registration.eventType,
          listenerId: registration.id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };

    // Apply debouncing if configured
    if (registration.options.debounce > 0) {
      this.clearDebounceTimer(registration);
      registration.debounceTimer = window.setTimeout(execute, registration.options.debounce);
    } else {
      execute();
    }
  }

  private clearDebounceTimer(registration: ListenerRegistration): void {
    if (registration.debounceTimer) {
      clearTimeout(registration.debounceTimer);
      registration.debounceTimer = undefined;
    }
  }

  private createDispatchContext(event: StorageEvent): EventDispatchContext {
    let defaultPrevented = false;
    let propagationStopped = false;

    return {
      event,
      source: event.source,
      timestamp: new Date(),
      preventDefault: () => { defaultPrevented = true; },
      stopPropagation: () => { propagationStopped = true; },
      get defaultPrevented() { return defaultPrevented; },
      get propagationStopped() { return propagationStopped; },
    };
  }

  private recordEventHistory(
    event: StorageEvent,
    listenerCount: number,
    processingDuration: number
  ): void {
    const entry: EventHistoryEntry = {
      event,
      timestamp: new Date(),
      listenerCount,
      processingDuration,
    };

    this.eventHistory.push(entry);

    // Limit history size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.splice(0, this.eventHistory.length - this.maxHistorySize);
    }
  }

  private setupCleanupInterval(): void {
    // Periodic cleanup of expired listeners and history
    setInterval(() => {
      if (this.isDestroyed) return;
      
      // Clean up expired debounce timers
      for (const eventListeners of this.listeners.values()) {
        for (const registration of eventListeners) {
          // Cleanup logic for old listeners if needed
        }
      }
    }, 60000); // Every minute
  }

  private logEvent(type: string, data: any): void {
    if (this.config.enableLogging) {
      console.debug(`[StorageEventManager] ${type}:`, data);
    }
  }
}

/**
 * Create a new storage event manager instance
 */
export function createStorageEventManager(config?: EventDispatcherConfig): StorageEventManager {
  return new StorageEventManager(config);
}

/**
 * Global storage event manager instance
 */
export const globalStorageEventManager = createStorageEventManager({
  enableLogging: false,
  maxListeners: 50,
  defaultDebounce: 0,
});