/**
 * Event system types for storage services
 *
 * This module defines event-related types for the storage system,
 * including event listeners, event dispatchers, and event data structures.
 *
 * @fileoverview Event system types for storage services
 * @module storage/events
 */

import type {
  StorageChangeEvent,
  StorageChangeCallback,
  StorageMetadata,
  StorageError,
} from './interfaces';
import type { StorageAdapterType } from './types';

// =================== Core Event Types ===================

/**
 * Storage event types that can be emitted
 */
export type StorageEventType =
  | 'change' // Data changed (add/update/remove/clear)
  | 'error' // Error occurred during operation
  | 'quota-exceeded' // Storage quota has been exceeded
  | 'connection-lost' // Database connection lost
  | 'connection-restored' // Database connection restored
  | 'transaction-start' // Transaction started
  | 'transaction-commit' // Transaction committed
  | 'transaction-rollback' // Transaction rolled back
  | 'cleanup-start' // Cleanup operation started
  | 'cleanup-complete'; // Cleanup operation completed

/**
 * Base storage event interface
 */
export interface StorageEvent {
  /** Event type */
  type: StorageEventType;
  /** Event timestamp */
  timestamp: Date;
  /** Source adapter that triggered the event */
  source: StorageAdapterType;
  /** Event data payload */
  data?: unknown;
  /** Event metadata */
  metadata?: StorageMetadata;
}

/**
 * Storage error event
 */
export interface StorageErrorEvent extends StorageEvent {
  type: 'error';
  /** Error details */
  data: StorageError;
  /** Operation that caused the error */
  operation?: string;
  /** Keys involved in the failed operation */
  keys?: string[];
}

/**
 * Storage quota exceeded event
 */
export interface StorageQuotaExceededEvent extends StorageEvent {
  type: 'quota-exceeded';
  /** Quota information */
  data: {
    /** Current storage usage in bytes */
    currentUsage: number;
    /** Available quota in bytes */
    availableQuota: number;
    /** Requested operation size in bytes */
    requestedSize: number;
    /** Usage percentage (0-100) */
    usagePercentage: number;
  };
}

/**
 * Storage connection event
 */
export interface StorageConnectionEvent extends StorageEvent {
  type: 'connection-lost' | 'connection-restored';
  /** Connection details */
  data: {
    /** Database name */
    databaseName: string;
    /** Connection state */
    connectionState: 'connecting' | 'connected' | 'disconnected' | 'failed';
    /** Last error if connection failed */
    lastError?: string;
  };
}

/**
 * Storage transaction event
 */
export interface StorageTransactionEvent extends StorageEvent {
  type: 'transaction-start' | 'transaction-commit' | 'transaction-rollback';
  /** Transaction details */
  data: {
    /** Transaction ID */
    transactionId: string;
    /** Transaction mode */
    mode: 'readonly' | 'readwrite';
    /** Object stores involved */
    objectStores: string[];
    /** Transaction duration (for commit/rollback events) */
    duration?: number;
  };
}

/**
 * Storage cleanup event
 */
export interface StorageCleanupEvent extends StorageEvent {
  type: 'cleanup-start' | 'cleanup-complete';
  /** Cleanup details */
  data: {
    /** Cleanup operation ID */
    cleanupId: string;
    /** Items processed (for complete event) */
    itemsProcessed?: number;
    /** Items removed (for complete event) */
    itemsRemoved?: number;
    /** Space freed in bytes (for complete event) */
    spaceFreed?: number;
    /** Cleanup duration in milliseconds (for complete event) */
    duration?: number;
  };
}

// =================== Event Listener Types ===================

/**
 * Generic event listener type
 */
export type StorageEventListener<T extends StorageEvent = StorageEvent> = (
  event: T
) => void;

/**
 * Event listener with specific event type
 */
export type TypedStorageEventListener<T extends StorageEventType> =
  T extends 'change'
    ? (event: StorageChangeEvent) => void
    : T extends 'error'
      ? (event: StorageErrorEvent) => void
      : T extends 'quota-exceeded'
        ? (event: StorageQuotaExceededEvent) => void
        : T extends 'connection-lost' | 'connection-restored'
          ? (event: StorageConnectionEvent) => void
          : T extends
                | 'transaction-start'
                | 'transaction-commit'
                | 'transaction-rollback'
            ? (event: StorageTransactionEvent) => void
            : T extends 'cleanup-start' | 'cleanup-complete'
              ? (event: StorageCleanupEvent) => void
              : StorageEventListener;

/**
 * Event listener options
 */
export interface EventListenerOptions {
  /** Only listen once, then remove listener */
  once?: boolean;
  /** Filter events by source adapter */
  source?: StorageAdapterType;
  /** Filter events by key pattern (for change events) */
  keyPattern?: string | RegExp;
  /** Debounce events (milliseconds) */
  debounce?: number;
}

// =================== Event Emitter Interface ===================

/**
 * Storage event emitter interface
 */
export interface StorageEventEmitter {
  /** Add event listener */
  on<T extends StorageEventType>(
    eventType: T,
    listener: TypedStorageEventListener<T>,
    options?: EventListenerOptions
  ): () => void;

  /** Add one-time event listener */
  once<T extends StorageEventType>(
    eventType: T,
    listener: TypedStorageEventListener<T>
  ): () => void;

  /** Remove event listener */
  off<T extends StorageEventType>(
    eventType: T,
    listener: TypedStorageEventListener<T>
  ): void;

  /** Remove all listeners for event type */
  removeAllListeners(eventType?: StorageEventType): void;

  /** Emit event to all listeners */
  emit<T extends StorageEvent>(event: T): void;

  /** Get listener count for event type */
  listenerCount(eventType: StorageEventType): number;

  /** Get all registered event types */
  eventNames(): StorageEventType[];
}

// =================== Event Dispatcher Types ===================

/**
 * Event dispatcher configuration
 */
export interface EventDispatcherConfig {
  /** Maximum number of listeners per event type */
  maxListeners?: number;
  /** Enable event bubbling */
  enableBubbling?: boolean;
  /** Default debounce time for events */
  defaultDebounce?: number;
  /** Enable event logging */
  enableLogging?: boolean;
}

/**
 * Event dispatch context
 */
export interface EventDispatchContext {
  /** Event being dispatched */
  event: StorageEvent;
  /** Source adapter */
  source: StorageAdapterType;
  /** Dispatch timestamp */
  timestamp: Date;
  /** Whether event should be prevented */
  preventDefault: () => void;
  /** Whether event propagation should be stopped */
  stopPropagation: () => void;
  /** Whether default action is prevented */
  defaultPrevented: boolean;
  /** Whether propagation is stopped */
  propagationStopped: boolean;
}

// =================== Event Builder Types ===================

/**
 * Event builder for creating typed events
 */
export interface StorageEventBuilder {
  /** Create change event */
  createChangeEvent<T = unknown>(data: {
    key: string;
    type: 'added' | 'updated' | 'removed' | 'cleared';
    oldValue?: T;
    newValue?: T;
    source: StorageAdapterType;
    metadata?: Partial<StorageMetadata>;
  }): StorageChangeEvent<T>;

  /** Create error event */
  createErrorEvent(data: {
    error: StorageError;
    source: StorageAdapterType;
    operation?: string;
    keys?: string[];
  }): StorageErrorEvent;

  /** Create quota exceeded event */
  createQuotaExceededEvent(data: {
    currentUsage: number;
    availableQuota: number;
    requestedSize: number;
    source: StorageAdapterType;
  }): StorageQuotaExceededEvent;

  /** Create connection event */
  createConnectionEvent(data: {
    type: 'connection-lost' | 'connection-restored';
    databaseName: string;
    connectionState: 'connecting' | 'connected' | 'disconnected' | 'failed';
    source: StorageAdapterType;
    lastError?: string;
  }): StorageConnectionEvent;

  /** Create transaction event */
  createTransactionEvent(data: {
    type: 'transaction-start' | 'transaction-commit' | 'transaction-rollback';
    transactionId: string;
    mode: 'readonly' | 'readwrite';
    objectStores: string[];
    source: StorageAdapterType;
    duration?: number;
  }): StorageTransactionEvent;

  /** Create cleanup event */
  createCleanupEvent(data: {
    type: 'cleanup-start' | 'cleanup-complete';
    cleanupId: string;
    source: StorageAdapterType;
    itemsProcessed?: number;
    itemsRemoved?: number;
    spaceFreed?: number;
    duration?: number;
  }): StorageCleanupEvent;
}

// =================== Utility Types ===================

/**
 * Event filter function type
 */
export type EventFilter<T extends StorageEvent = StorageEvent> = (
  event: T
) => boolean;

/**
 * Event transformer function type
 */
export type EventTransformer<T extends StorageEvent = StorageEvent, R = T> = (
  event: T
) => R;

/**
 * Event subscription handle
 */
export interface EventSubscription {
  /** Unsubscribe from events */
  unsubscribe(): void;
  /** Whether subscription is active */
  isActive(): boolean;
  /** Event type being listened to */
  eventType: StorageEventType;
  /** Listener function */
  listener: StorageEventListener;
  /** Subscription options */
  options?: EventListenerOptions;
}

/**
 * Batch event operations
 */
export interface EventBatch {
  /** Events in the batch */
  events: StorageEvent[];
  /** Batch ID */
  batchId: string;
  /** Batch timestamp */
  timestamp: Date;
  /** Source adapter */
  source: StorageAdapterType;
}

/**
 * Event history entry
 */
export interface EventHistoryEntry {
  /** Event data */
  event: StorageEvent;
  /** Dispatch timestamp */
  timestamp: Date;
  /** Number of listeners that processed the event */
  listenerCount: number;
  /** Processing duration in milliseconds */
  processingDuration: number;
}

// =================== Constants ===================

/**
 * Default event emitter configuration
 */
export const DEFAULT_EVENT_CONFIG: Required<EventDispatcherConfig> = {
  maxListeners: 100,
  enableBubbling: false,
  defaultDebounce: 0,
  enableLogging: false,
};

/**
 * Event priority levels
 */
export enum EventPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

/**
 * Built-in event patterns for common use cases
 */
export const EVENT_PATTERNS = {
  /** Match all user preference keys */
  USER_PREFERENCES: /^user\.preferences\./,
  /** Match all app setting keys */
  APP_SETTINGS: /^app\.settings\./,
  /** Match all token keys */
  TOKENS: /^tokens?\./,
  /** Match all cache keys */
  CACHE: /^cache\./,
  /** Match all temporary keys */
  TEMP: /^temp\./,
} as const;
