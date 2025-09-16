/**
 * Storage Event Builder
 * 
 * Provides type-safe event creation utilities for storage operations.
 * Creates properly structured events with validation and default values.
 * 
 * @fileoverview Storage event construction utilities
 * @module storage/event-builder
 */

import type {
  StorageChangeEvent,
  StorageErrorEvent,
  StorageQuotaExceededEvent,
  StorageConnectionEvent,
  StorageTransactionEvent,
  StorageCleanupEvent,
  StorageEventBuilder,
  StorageMetadata,
  StorageError
} from './events';
import type { StorageAdapterType } from './types';

/**
 * Storage Event Builder Implementation
 */
export class StorageEventBuilderImpl implements StorageEventBuilder {
  /**
   * Create a storage change event
   */
  createChangeEvent<T = unknown>(data: {
    key: string;
    type: 'added' | 'updated' | 'removed' | 'cleared';
    oldValue?: T;
    newValue?: T;
    source: StorageAdapterType;
    metadata?: Partial<StorageMetadata>;
  }): StorageChangeEvent<T> {
    this.validateKey(data.key);
    this.validateSource(data.source);

    // Validate change type specific requirements
    if (data.type === 'added' && data.newValue === undefined) {
      throw new Error('Added change events must include newValue');
    }
    if (data.type === 'removed' && data.oldValue === undefined) {
      throw new Error('Removed change events must include oldValue');
    }
    if (data.type === 'updated' && (data.oldValue === undefined || data.newValue === undefined)) {
      throw new Error('Updated change events must include both oldValue and newValue');
    }

    const metadata: StorageMetadata = {
      size: this.calculateSize(data.newValue ?? data.oldValue),
      ttl: null,
      compressed: false,
      encrypted: false,
      version: 1,
      ...data.metadata,
      createdAt: data.metadata?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };

    return {
      type: 'change',
      timestamp: new Date(),
      source: data.source,
      data: {
        key: data.key,
        type: data.type,
        oldValue: data.oldValue,
        newValue: data.newValue,
      },
      metadata,
    };
  }

  /**
   * Create a storage error event
   */
  createErrorEvent(data: {
    error: StorageError;
    source: StorageAdapterType;
    operation?: string;
    keys?: string[];
  }): StorageErrorEvent {
    this.validateSource(data.source);
    this.validateError(data.error);

    return {
      type: 'error',
      timestamp: new Date(),
      source: data.source,
      data: data.error,
      operation: data.operation,
      keys: data.keys,
    };
  }

  /**
   * Create a quota exceeded event
   */
  createQuotaExceededEvent(data: {
    currentUsage: number;
    availableQuota: number;
    requestedSize: number;
    source: StorageAdapterType;
  }): StorageQuotaExceededEvent {
    this.validateSource(data.source);
    this.validateNonNegativeNumber(data.currentUsage, 'currentUsage');
    this.validateNonNegativeNumber(data.availableQuota, 'availableQuota');
    this.validateNonNegativeNumber(data.requestedSize, 'requestedSize');

    const usagePercentage = data.availableQuota > 0 
      ? Math.round((data.currentUsage / data.availableQuota) * 100)
      : 100;

    return {
      type: 'quota-exceeded',
      timestamp: new Date(),
      source: data.source,
      data: {
        currentUsage: data.currentUsage,
        availableQuota: data.availableQuota,
        requestedSize: data.requestedSize,
        usagePercentage: Math.min(usagePercentage, 100),
      },
    };
  }

  /**
   * Create a connection event
   */
  createConnectionEvent(data: {
    type: 'connection-lost' | 'connection-restored';
    databaseName: string;
    connectionState: 'connecting' | 'connected' | 'disconnected' | 'failed';
    source: StorageAdapterType;
    lastError?: string;
  }): StorageConnectionEvent {
    this.validateSource(data.source);
    this.validateNonEmptyString(data.databaseName, 'databaseName');

    return {
      type: data.type,
      timestamp: new Date(),
      source: data.source,
      data: {
        databaseName: data.databaseName,
        connectionState: data.connectionState,
        lastError: data.lastError,
      },
    };
  }

  /**
   * Create a transaction event
   */
  createTransactionEvent(data: {
    type: 'transaction-start' | 'transaction-commit' | 'transaction-rollback';
    transactionId: string;
    mode: 'readonly' | 'readwrite';
    objectStores: string[];
    source: StorageAdapterType;
    duration?: number;
  }): StorageTransactionEvent {
    this.validateSource(data.source);
    this.validateNonEmptyString(data.transactionId, 'transactionId');
    
    if (data.objectStores.length === 0) {
      throw new Error('Transaction events must include at least one object store');
    }

    if (data.duration !== undefined) {
      this.validateNonNegativeNumber(data.duration, 'duration');
    }

    return {
      type: data.type,
      timestamp: new Date(),
      source: data.source,
      data: {
        transactionId: data.transactionId,
        mode: data.mode,
        objectStores: [...data.objectStores], // Clone array
        duration: data.duration,
      },
    };
  }

  /**
   * Create a cleanup event
   */
  createCleanupEvent(data: {
    type: 'cleanup-start' | 'cleanup-complete';
    cleanupId: string;
    source: StorageAdapterType;
    itemsProcessed?: number;
    itemsRemoved?: number;
    spaceFreed?: number;
    duration?: number;
  }): StorageCleanupEvent {
    this.validateSource(data.source);
    this.validateNonEmptyString(data.cleanupId, 'cleanupId');

    // Validate completion data for complete events
    if (data.type === 'cleanup-complete') {
      if (data.itemsProcessed !== undefined) {
        this.validateNonNegativeNumber(data.itemsProcessed, 'itemsProcessed');
      }
      if (data.itemsRemoved !== undefined) {
        this.validateNonNegativeNumber(data.itemsRemoved, 'itemsRemoved');
      }
      if (data.spaceFreed !== undefined) {
        this.validateNonNegativeNumber(data.spaceFreed, 'spaceFreed');
      }
      if (data.duration !== undefined) {
        this.validateNonNegativeNumber(data.duration, 'duration');
      }
    }

    return {
      type: data.type,
      timestamp: new Date(),
      source: data.source,
      data: {
        cleanupId: data.cleanupId,
        itemsProcessed: data.itemsProcessed,
        itemsRemoved: data.itemsRemoved,
        spaceFreed: data.spaceFreed,
        duration: data.duration,
      },
    };
  }

  // =================== Validation Helpers ===================

  private validateKey(key: string): void {
    if (!key || typeof key !== 'string') {
      throw new Error('Event key must be a non-empty string');
    }
  }

  private validateSource(source: StorageAdapterType): void {
    const validSources: StorageAdapterType[] = ['indexeddb', 'localstorage', 'memory'];
    if (!validSources.includes(source)) {
      throw new Error(`Invalid source type: ${source}. Must be one of: ${validSources.join(', ')}`);
    }
  }

  private validateError(error: StorageError): void {
    if (!error || typeof error !== 'object') {
      throw new Error('Event error must be a valid error object');
    }
    if (!error.message || typeof error.message !== 'string') {
      throw new Error('Event error must have a message property');
    }
  }

  private validateNonNegativeNumber(value: number, fieldName: string): void {
    if (typeof value !== 'number' || value < 0 || !Number.isFinite(value)) {
      throw new Error(`${fieldName} must be a non-negative finite number`);
    }
  }

  private validateNonEmptyString(value: string, fieldName: string): void {
    if (!value || typeof value !== 'string') {
      throw new Error(`${fieldName} must be a non-empty string`);
    }
  }

  private calculateSize(value: unknown): number {
    if (value === null || value === undefined) return 0;
    
    try {
      // Rough size estimation based on JSON serialization
      const serialized = JSON.stringify(value);
      return new Blob([serialized]).size;
    } catch {
      // Fallback for non-serializable values
      return 100; // Default estimated size
    }
  }
}

/**
 * Utility functions for common event creation patterns
 */
export class StorageEventUtils {
  private static builder = new StorageEventBuilderImpl();

  /**
   * Create a data added event
   */
  static dataAdded<T>(
    key: string,
    value: T,
    source: StorageAdapterType,
    metadata?: Partial<StorageMetadata>
  ): StorageChangeEvent<T> {
    return this.builder.createChangeEvent({
      key,
      type: 'added',
      newValue: value,
      source,
      metadata,
    });
  }

  /**
   * Create a data updated event
   */
  static dataUpdated<T>(
    key: string,
    oldValue: T,
    newValue: T,
    source: StorageAdapterType,
    metadata?: Partial<StorageMetadata>
  ): StorageChangeEvent<T> {
    return this.builder.createChangeEvent({
      key,
      type: 'updated',
      oldValue,
      newValue,
      source,
      metadata,
    });
  }

  /**
   * Create a data removed event
   */
  static dataRemoved<T>(
    key: string,
    oldValue: T,
    source: StorageAdapterType,
    metadata?: Partial<StorageMetadata>
  ): StorageChangeEvent<T> {
    return this.builder.createChangeEvent({
      key,
      type: 'removed',
      oldValue,
      source,
      metadata,
    });
  }

  /**
   * Create a storage cleared event
   */
  static storageCleared(
    source: StorageAdapterType,
    metadata?: Partial<StorageMetadata>
  ): StorageChangeEvent {
    return this.builder.createChangeEvent({
      key: '*',
      type: 'cleared',
      source,
      metadata,
    });
  }

  /**
   * Create an operation error event
   */
  static operationError(
    error: Error | string,
    operation: string,
    source: StorageAdapterType,
    keys?: string[]
  ): StorageErrorEvent {
    const storageError: StorageError = {
      name: error instanceof Error ? error.name : 'StorageError',
      message: error instanceof Error ? error.message : error,
      code: 'OPERATION_FAILED',
      details: error instanceof Error ? { stack: error.stack } : undefined,
    };

    return this.builder.createErrorEvent({
      error: storageError,
      source,
      operation,
      keys,
    });
  }

  /**
   * Create a quota warning event
   */
  static quotaWarning(
    currentUsage: number,
    availableQuota: number,
    requestedSize: number,
    source: StorageAdapterType
  ): StorageQuotaExceededEvent {
    return this.builder.createQuotaExceededEvent({
      currentUsage,
      availableQuota,
      requestedSize,
      source,
    });
  }

  /**
   * Create a transaction started event
   */
  static transactionStarted(
    transactionId: string,
    mode: 'readonly' | 'readwrite',
    objectStores: string[],
    source: StorageAdapterType
  ): StorageTransactionEvent {
    return this.builder.createTransactionEvent({
      type: 'transaction-start',
      transactionId,
      mode,
      objectStores,
      source,
    });
  }

  /**
   * Create a transaction completed event
   */
  static transactionCompleted(
    transactionId: string,
    mode: 'readonly' | 'readwrite',
    objectStores: string[],
    source: StorageAdapterType,
    duration: number
  ): StorageTransactionEvent {
    return this.builder.createTransactionEvent({
      type: 'transaction-commit',
      transactionId,
      mode,
      objectStores,
      source,
      duration,
    });
  }

  /**
   * Create a cleanup completed event
   */
  static cleanupCompleted(
    cleanupId: string,
    itemsProcessed: number,
    itemsRemoved: number,
    spaceFreed: number,
    duration: number,
    source: StorageAdapterType
  ): StorageCleanupEvent {
    return this.builder.createCleanupEvent({
      type: 'cleanup-complete',
      cleanupId,
      source,
      itemsProcessed,
      itemsRemoved,
      spaceFreed,
      duration,
    });
  }
}

/**
 * Default storage event builder instance
 */
export const storageEventBuilder = new StorageEventBuilderImpl();

/**
 * Create a new storage event builder
 */
export function createStorageEventBuilder(): StorageEventBuilder {
  return new StorageEventBuilderImpl();
}