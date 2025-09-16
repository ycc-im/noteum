/**
 * Storage Observer Pattern Implementation
 * 
 * Provides observer pattern support for storage operations.
 * Enables data change notifications with batching and filtering capabilities.
 * 
 * @fileoverview Storage observer pattern implementation
 * @module storage/observer-pattern
 */

import type { StorageAdapterType } from './types';
import type { StorageChangeEvent, StorageMetadata } from './events';

/**
 * Storage observer interface for data change notifications
 */
export interface StorageObserver {
  /** Called when data is changed (added/updated) */
  onDataChanged(key: string, oldValue: any, newValue: any, metadata?: StorageMetadata): void;
  
  /** Called when data is deleted */
  onDataDeleted(key: string, oldValue: any, metadata?: StorageMetadata): void;
  
  /** Called when data is added */
  onDataAdded(key: string, value: any, metadata?: StorageMetadata): void;
  
  /** Called when storage is cleared */
  onStorageCleared(metadata?: StorageMetadata): void;
}

/**
 * Observer registration options
 */
export interface ObserverOptions {
  /** Filter by key pattern */
  keyPattern?: string | RegExp;
  
  /** Filter by source adapter */
  source?: StorageAdapterType;
  
  /** Priority level (higher numbers = higher priority) */
  priority?: number;
  
  /** Batch notifications within this time window (ms) */
  batchDelay?: number;
  
  /** Maximum batch size before forced emission */
  maxBatchSize?: number;
  
  /** Enable/disable specific notification types */
  notificationTypes?: {
    added?: boolean;
    updated?: boolean;
    deleted?: boolean;
    cleared?: boolean;
  };
}

/**
 * Observer registration data
 */
interface ObserverRegistration {
  observer: StorageObserver;
  options: Required<ObserverOptions>;
  id: string;
  registeredAt: Date;
  lastNotified?: Date;
  notificationCount: number;
  batchTimer?: number;
  batchedChanges: StorageChangeEvent[];
}

/**
 * Batch notification data
 */
interface BatchedNotification {
  type: 'added' | 'updated' | 'deleted' | 'cleared';
  key: string;
  oldValue?: any;
  newValue?: any;
  metadata?: StorageMetadata;
  timestamp: Date;
}

/**
 * Storage Observer Manager
 */
export class StorageObserverManager {
  private readonly observers = new Set<ObserverRegistration>();
  private readonly observerIdCounter = { value: 0 };
  private isDestroyed = false;

  /**
   * Register a storage observer
   */
  register(observer: StorageObserver, options: ObserverOptions = {}): () => void {
    this.validateNotDestroyed();
    
    if (!observer || typeof observer !== 'object') {
      throw new Error('Observer must be a valid object');
    }

    // Validate required methods
    const requiredMethods = ['onDataChanged', 'onDataDeleted', 'onDataAdded', 'onStorageCleared'];
    for (const method of requiredMethods) {
      if (typeof (observer as any)[method] !== 'function') {
        throw new Error(`Observer must implement ${method} method`);
      }
    }

    const registration: ObserverRegistration = {
      observer,
      options: {
        keyPattern: options.keyPattern,
        source: options.source,
        priority: options.priority ?? 0,
        batchDelay: options.batchDelay ?? 0,
        maxBatchSize: options.maxBatchSize ?? 100,
        notificationTypes: {
          added: true,
          updated: true,
          deleted: true,
          cleared: true,
          ...options.notificationTypes,
        },
      },
      id: this.generateObserverId(),
      registeredAt: new Date(),
      notificationCount: 0,
      batchedChanges: [],
    };

    this.observers.add(registration);
    
    // Return unregister function
    return () => this.unregister(registration);
  }

  /**
   * Unregister a specific observer
   */
  unregister(observerOrRegistration: StorageObserver | ObserverRegistration): void {
    this.validateNotDestroyed();

    if ('id' in observerOrRegistration) {
      // Registration object passed
      this.removeRegistration(observerOrRegistration);
    } else {
      // Observer object passed - find registration
      for (const registration of this.observers) {
        if (registration.observer === observerOrRegistration) {
          this.removeRegistration(registration);
          break;
        }
      }
    }
  }

  /**
   * Unregister all observers
   */
  unregisterAll(): void {
    this.validateNotDestroyed();
    
    // Clear all batch timers
    for (const registration of this.observers) {
      this.clearBatchTimer(registration);
    }
    
    this.observers.clear();
  }

  /**
   * Notify observers of data changes
   */
  notifyDataChange(
    type: 'added' | 'updated' | 'deleted' | 'cleared',
    key: string,
    oldValue?: any,
    newValue?: any,
    source?: StorageAdapterType,
    metadata?: StorageMetadata
  ): void {
    this.validateNotDestroyed();
    
    const relevantObservers = this.getRelevantObservers(key, source, type);
    
    if (relevantObservers.length === 0) return;

    // Sort by priority (higher priority first)
    relevantObservers.sort((a, b) => b.options.priority - a.options.priority);

    for (const registration of relevantObservers) {
      try {
        if (registration.options.batchDelay > 0) {
          this.addToBatch(registration, type, key, oldValue, newValue, metadata);
        } else {
          this.notifyObserver(registration, type, key, oldValue, newValue, metadata);
        }
      } catch (error) {
        console.error('Observer notification error:', error);
      }
    }
  }

  /**
   * Notify observers from storage change event
   */
  notifyFromChangeEvent(event: StorageChangeEvent): void {
    const { key, type, oldValue, newValue } = event.data;
    this.notifyDataChange(type, key, oldValue, newValue, event.source, event.metadata);
  }

  /**
   * Force flush all batched notifications
   */
  flushBatchedNotifications(): void {
    this.validateNotDestroyed();
    
    for (const registration of this.observers) {
      if (registration.batchedChanges.length > 0) {
        this.processBatchedChanges(registration);
      }
    }
  }

  /**
   * Get observer statistics
   */
  getStats() {
    return {
      totalObservers: this.observers.size,
      isDestroyed: this.isDestroyed,
      observerStats: Array.from(this.observers).map(reg => ({
        id: reg.id,
        priority: reg.options.priority,
        notificationCount: reg.notificationCount,
        hasBatchedChanges: reg.batchedChanges.length > 0,
        registeredAt: reg.registeredAt,
        lastNotified: reg.lastNotified,
      })),
    };
  }

  /**
   * Destroy observer manager and cleanup resources
   */
  destroy(): void {
    if (this.isDestroyed) return;
    
    this.unregisterAll();
    this.isDestroyed = true;
  }

  // =================== Private Methods ===================

  private validateNotDestroyed(): void {
    if (this.isDestroyed) {
      throw new Error('StorageObserverManager has been destroyed');
    }
  }

  private generateObserverId(): string {
    return `observer_${++this.observerIdCounter.value}_${Date.now()}`;
  }

  private removeRegistration(registration: ObserverRegistration): void {
    this.clearBatchTimer(registration);
    this.observers.delete(registration);
  }

  private getRelevantObservers(
    key: string,
    source?: StorageAdapterType,
    type?: string
  ): ObserverRegistration[] {
    const relevantObservers: ObserverRegistration[] = [];

    for (const registration of this.observers) {
      // Check source filter
      if (registration.options.source && registration.options.source !== source) {
        continue;
      }

      // Check key pattern filter
      if (registration.options.keyPattern && !this.matchesKeyPattern(key, registration.options.keyPattern)) {
        continue;
      }

      // Check notification type filter
      if (type && !registration.options.notificationTypes[type as keyof typeof registration.options.notificationTypes]) {
        continue;
      }

      relevantObservers.push(registration);
    }

    return relevantObservers;
  }

  private matchesKeyPattern(key: string, pattern: string | RegExp): boolean {
    if (typeof pattern === 'string') {
      return key.includes(pattern);
    }
    return pattern.test(key);
  }

  private addToBatch(
    registration: ObserverRegistration,
    type: 'added' | 'updated' | 'deleted' | 'cleared',
    key: string,
    oldValue?: any,
    newValue?: any,
    metadata?: StorageMetadata
  ): void {
    const batchedNotification: BatchedNotification = {
      type,
      key,
      oldValue,
      newValue,
      metadata,
      timestamp: new Date(),
    };

    registration.batchedChanges.push({
      type: 'change',
      timestamp: new Date(),
      source: 'indexeddb', // Default source for batched changes
      data: {
        key,
        type,
        oldValue,
        newValue,
      },
      metadata,
    });

    // Check if we should flush immediately
    if (registration.batchedChanges.length >= registration.options.maxBatchSize) {
      this.processBatchedChanges(registration);
      return;
    }

    // Set up batch timer if not already set
    if (!registration.batchTimer) {
      registration.batchTimer = window.setTimeout(() => {
        this.processBatchedChanges(registration);
      }, registration.options.batchDelay);
    }
  }

  private processBatchedChanges(registration: ObserverRegistration): void {
    if (registration.batchedChanges.length === 0) return;

    this.clearBatchTimer(registration);

    // Group changes by type and process
    const changesByType = this.groupChangesByType(registration.batchedChanges);

    try {
      // Process each type of change
      for (const [type, changes] of changesByType) {
        for (const change of changes) {
          const { key, oldValue, newValue } = change.data;
          this.notifyObserver(registration, type, key, oldValue, newValue, change.metadata);
        }
      }
    } catch (error) {
      console.error('Batch notification error:', error);
    } finally {
      // Clear the batch
      registration.batchedChanges.length = 0;
    }
  }

  private groupChangesByType(changes: StorageChangeEvent[]): Map<string, StorageChangeEvent[]> {
    const groups = new Map<string, StorageChangeEvent[]>();
    
    for (const change of changes) {
      const type = change.data.type;
      if (!groups.has(type)) {
        groups.set(type, []);
      }
      groups.get(type)!.push(change);
    }

    return groups;
  }

  private notifyObserver(
    registration: ObserverRegistration,
    type: 'added' | 'updated' | 'deleted' | 'cleared',
    key: string,
    oldValue?: any,
    newValue?: any,
    metadata?: StorageMetadata
  ): void {
    registration.lastNotified = new Date();
    registration.notificationCount++;

    switch (type) {
      case 'added':
        registration.observer.onDataAdded(key, newValue, metadata);
        break;
      case 'updated':
        registration.observer.onDataChanged(key, oldValue, newValue, metadata);
        break;
      case 'deleted':
        registration.observer.onDataDeleted(key, oldValue, metadata);
        break;
      case 'cleared':
        registration.observer.onStorageCleared(metadata);
        break;
    }
  }

  private clearBatchTimer(registration: ObserverRegistration): void {
    if (registration.batchTimer) {
      clearTimeout(registration.batchTimer);
      registration.batchTimer = undefined;
    }
  }
}

/**
 * Base observer class with optional method implementations
 */
export abstract class BaseStorageObserver implements StorageObserver {
  onDataChanged(key: string, oldValue: any, newValue: any, metadata?: StorageMetadata): void {
    // Override in subclass if needed
  }

  onDataDeleted(key: string, oldValue: any, metadata?: StorageMetadata): void {
    // Override in subclass if needed
  }

  onDataAdded(key: string, value: any, metadata?: StorageMetadata): void {
    // Override in subclass if needed
  }

  onStorageCleared(metadata?: StorageMetadata): void {
    // Override in subclass if needed
  }
}

/**
 * Simple observer implementation for function-based observers
 */
export class FunctionalStorageObserver implements StorageObserver {
  constructor(
    private readonly handlers: {
      onDataChanged?: (key: string, oldValue: any, newValue: any, metadata?: StorageMetadata) => void;
      onDataDeleted?: (key: string, oldValue: any, metadata?: StorageMetadata) => void;
      onDataAdded?: (key: string, value: any, metadata?: StorageMetadata) => void;
      onStorageCleared?: (metadata?: StorageMetadata) => void;
    }
  ) {}

  onDataChanged(key: string, oldValue: any, newValue: any, metadata?: StorageMetadata): void {
    this.handlers.onDataChanged?.(key, oldValue, newValue, metadata);
  }

  onDataDeleted(key: string, oldValue: any, metadata?: StorageMetadata): void {
    this.handlers.onDataDeleted?.(key, oldValue, metadata);
  }

  onDataAdded(key: string, value: any, metadata?: StorageMetadata): void {
    this.handlers.onDataAdded?.(key, value, metadata);
  }

  onStorageCleared(metadata?: StorageMetadata): void {
    this.handlers.onStorageCleared?.(metadata);
  }
}

/**
 * Create a new storage observer manager
 */
export function createStorageObserverManager(): StorageObserverManager {
  return new StorageObserverManager();
}

/**
 * Global storage observer manager instance
 */
export const globalStorageObserverManager = createStorageObserverManager();