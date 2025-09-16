/**
 * DexieStorageAdapter - IndexedDB storage adapter implementation
 * 
 * This module implements the StorageService interface using Dexie.js for IndexedDB
 * operations. It provides a complete storage solution with CRUD operations,
 * batch processing, transaction support, and performance optimizations.
 * 
 * @fileoverview Dexie-based storage adapter implementation
 * @module storage/dexie-adapter
 */

import type {
  StorageService,
  StorageChangeEvent,
  IAdvancedStorageAdapter,
  StorageResult,
  StorageBatchOperation,
  StorageQuery,
  StorageExportData,
  StorageUsage,
  StorageChangeCallback,
  TypedStorageConfig
} from './interfaces';
import { NoteumDB, getDatabase, type DatabaseOptions } from './database';
import { TableNames } from './schema';
import { StorageCache } from './cache';
import { StorageUtils } from './utils';
import { StorageEventManager, globalStorageEventManager } from './event-manager';
import { StorageObserverManager, globalStorageObserverManager } from './observer-pattern';
import { StorageEventUtils } from './event-builder';

/**
 * DexieStorageAdapter configuration
 */
export interface DexieAdapterConfig extends TypedStorageConfig {
  /** Database options */
  databaseOptions?: DatabaseOptions;
  /** Cache configuration */
  cacheConfig?: {
    /** Enable in-memory caching */
    enabled: boolean;
    /** Maximum cache size in MB */
    maxSize: number;
    /** Cache TTL in milliseconds */
    ttl: number;
  };
  /** Performance options */
  performanceOptions?: {
    /** Batch size for bulk operations */
    batchSize: number;
    /** Debounce time for change events in ms */
    eventDebounceMs: number;
    /** Enable transaction optimization */
    optimizeTransactions: boolean;
  };
  /** Event system configuration */
  eventConfig?: {
    /** Use global event manager or create dedicated instance */
    useGlobalEventManager: boolean;
    /** Maximum number of event listeners */
    maxListeners: number;
    /** Enable event logging */
    enableLogging: boolean;
  };
  /** Observer pattern configuration */
  observerConfig?: {
    /** Use global observer manager or create dedicated instance */
    useGlobalObserverManager: boolean;
    /** Enable automatic observer notifications */
    enableAutoNotification: boolean;
  };
}

/**
 * DexieStorageAdapter - Complete IndexedDB storage implementation
 * 
 * Implements the StorageService interface with full feature support including:
 * - Basic CRUD operations
 * - Batch operations
 * - Transaction support
 * - Event system
 * - Performance optimizations
 * - Caching mechanism
 */
export class DexieStorageAdapter implements StorageService, IAdvancedStorageAdapter {
  private db: NoteumDB;
  private cache: StorageCache;
  private config: Required<DexieAdapterConfig>;
  private changeListeners: Set<StorageChangeCallback> = new Set();
  private eventDebounceMap: Map<string, NodeJS.Timeout> = new Map();
  private initialized = false;
  
  // Enhanced event and observer system
  private eventManager: StorageEventManager;
  private observerManager: StorageObserverManager;

  constructor(config: Partial<DexieAdapterConfig> = {}) {
    // Set default configuration
    this.config = {
      databaseName: 'NoteumDB',
      version: 1,
      debug: false,
      maxSizeLimit: 100, // MB
      enableCompression: false,
      fallbackToLocalStorage: true,
      databaseOptions: {
        debug: config.debug ?? false,
        enableAutoCleanup: true,
        cleanupInterval: 24 * 60 * 60 * 1000, // 24 hours
      },
      cacheConfig: {
        enabled: true,
        maxSize: 10, // MB
        ttl: 5 * 60 * 1000, // 5 minutes
      },
      performanceOptions: {
        batchSize: 100,
        eventDebounceMs: 100,
        optimizeTransactions: true,
      },
      eventConfig: {
        useGlobalEventManager: true,
        maxListeners: 50,
        enableLogging: false,
      },
      observerConfig: {
        useGlobalObserverManager: true,
        enableAutoNotification: true,
      },
      ...config,
    };

    // Initialize database
    this.db = getDatabase(this.config.databaseOptions);
    
    // Initialize cache
    this.cache = new StorageCache(this.config.cacheConfig);
    
    // Initialize event system
    this.eventManager = this.config.eventConfig.useGlobalEventManager
      ? globalStorageEventManager
      : new StorageEventManager({
          maxListeners: this.config.eventConfig.maxListeners,
          enableLogging: this.config.eventConfig.enableLogging,
        });
    
    // Initialize observer system
    this.observerManager = this.config.observerConfig.useGlobalObserverManager
      ? globalStorageObserverManager
      : new StorageObserverManager();
  }

  /**
   * Initialize the storage adapter
   */
  async initialize(): Promise<StorageResult<void>> {
    try {
      if (this.initialized) {
        return { success: true };
      }

      // Initialize database
      await this.db.initialize();

      // Initialize cache
      await this.cache.initialize();

      this.initialized = true;

      if (this.config.debug) {
        console.log('[DexieStorageAdapter] Initialized successfully');
      }

      return {
        success: true,
        metadata: {
          timestamp: new Date(),
          storageType: 'indexeddb',
        },
      };
    } catch (error) {
      const errorResult = StorageUtils.createError(
        'INITIALIZATION_FAILED',
        'Failed to initialize DexieStorageAdapter',
        error as Error
      );

      return {
        success: false,
        error: errorResult,
      };
    }
  }

  /**
   * Check if storage is ready
   */
  async isReady(): Promise<boolean> {
    return this.initialized && this.db.isReady();
  }

  // =================== Basic CRUD Operations ===================

  /**
   * Get value by key
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // Check cache first
      if (this.config.cacheConfig.enabled) {
        const cached = await this.cache.get<T>(key);
        if (cached !== null) {
          return cached;
        }
      }

      // Get from database
      const result = await this.getFromDatabase<T>(key);
      
      // Cache the result
      if (result !== null && this.config.cacheConfig.enabled) {
        await this.cache.set(key, result);
      }

      return result;
    } catch (error) {
      if (this.config.debug) {
        console.error('[DexieStorageAdapter] Get operation failed:', error);
      }
      return null;
    }
  }

  /**
   * Set value by key
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      // Store in database
      await this.storeInDatabase(key, value);

      // Update cache
      if (this.config.cacheConfig.enabled) {
        await this.cache.set(key, value);
      }

      // Emit change event
      this.emitChangeEvent(key, 'updated', undefined, value);

      if (this.config.debug) {
        console.log(`[DexieStorageAdapter] Set operation completed for key: ${key}`);
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[DexieStorageAdapter] Set operation failed:', error);
      }
      throw error;
    }
  }

  /**
   * Remove value by key
   */
  async remove(key: string): Promise<void> {
    try {
      // Get old value for event
      const oldValue = await this.get(key);

      // Remove from database
      await this.removeFromDatabase(key);

      // Remove from cache
      if (this.config.cacheConfig.enabled) {
        await this.cache.remove(key);
      }

      // Emit change event
      this.emitChangeEvent(key, 'removed', oldValue, undefined);

      if (this.config.debug) {
        console.log(`[DexieStorageAdapter] Remove operation completed for key: ${key}`);
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[DexieStorageAdapter] Remove operation failed:', error);
      }
      throw error;
    }
  }

  /**
   * Clear all data
   */
  async clear(): Promise<void> {
    try {
      // Clear database
      await this.db.transaction('rw', [
        this.db.tokens,
        this.db.userPreferences,
        this.db.appSettings,
        this.db.apiCache,
        this.db.metadata,
      ], async () => {
        await Promise.all([
          this.db.tokens.clear(),
          this.db.userPreferences.clear(),
          this.db.appSettings.clear(),
          this.db.apiCache.clear(),
          this.db.metadata.clear(),
        ]);
      });

      // Clear cache
      if (this.config.cacheConfig.enabled) {
        await this.cache.clear();
      }

      // Emit change event
      this.emitChangeEvent('*', 'cleared', undefined, undefined);

      if (this.config.debug) {
        console.log('[DexieStorageAdapter] Clear operation completed');
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[DexieStorageAdapter] Clear operation failed:', error);
      }
      throw error;
    }
  }

  // =================== Batch Operations ===================

  /**
   * Get multiple values by keys
   */
  async getBatch<T>(keys: string[]): Promise<Record<string, T>> {
    const result: Record<string, T> = {};
    
    try {
      // Process in batches to avoid overwhelming the database
      const batchSize = this.config.performanceOptions.batchSize;
      
      for (let i = 0; i < keys.length; i += batchSize) {
        const batch = keys.slice(i, i + batchSize);
        const batchPromises = batch.map(async (key) => {
          const value = await this.get<T>(key);
          if (value !== null) {
            result[key] = value;
          }
        });
        
        await Promise.all(batchPromises);
      }

      if (this.config.debug) {
        console.log(`[DexieStorageAdapter] Batch get completed for ${keys.length} keys`);
      }

      return result;
    } catch (error) {
      if (this.config.debug) {
        console.error('[DexieStorageAdapter] Batch get operation failed:', error);
      }
      throw error;
    }
  }

  /**
   * Set multiple values
   */
  async setBatch<T>(data: Record<string, T>): Promise<void> {
    try {
      const entries = Object.entries(data);
      const batchSize = this.config.performanceOptions.batchSize;

      // Process in batches
      for (let i = 0; i < entries.length; i += batchSize) {
        const batch = entries.slice(i, i + batchSize);
        
        if (this.config.performanceOptions.optimizeTransactions) {
          // Use a single transaction for the batch
          await this.db.transaction('rw', [
            this.db.userPreferences,
            this.db.appSettings,
            this.db.apiCache,
            this.db.metadata,
          ], async () => {
            await Promise.all(batch.map(([key, value]) => this.storeInDatabase(key, value)));
          });
        } else {
          // Process individually
          await Promise.all(batch.map(([key, value]) => this.set(key, value)));
        }
      }

      // Update cache
      if (this.config.cacheConfig.enabled) {
        await Promise.all(
          entries.map(([key, value]) => this.cache.set(key, value))
        );
      }

      // Emit batch change event
      for (const [key, value] of entries) {
        this.emitChangeEvent(key, 'updated', undefined, value);
      }

      if (this.config.debug) {
        console.log(`[DexieStorageAdapter] Batch set completed for ${entries.length} items`);
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[DexieStorageAdapter] Batch set operation failed:', error);
      }
      throw error;
    }
  }

  // =================== Advanced Operations ===================

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      // Check cache first
      if (this.config.cacheConfig.enabled) {
        const cached = await this.cache.has(key);
        if (cached) {
          return true;
        }
      }

      // Check database
      const tableInfo = StorageUtils.parseKey(key);
      if (!tableInfo) {
        return false;
      }

      const table = this.getTable(tableInfo.tableName);
      const count = await table.where('key').equals(key).count();
      
      return count > 0;
    } catch (error) {
      if (this.config.debug) {
        console.error('[DexieStorageAdapter] Exists check failed:', error);
      }
      return false;
    }
  }

  /**
   * Get all keys
   */
  async keys(): Promise<string[]> {
    try {
      const allKeys: string[] = [];

      // Get keys from all tables
      const tables = [
        this.db.tokens,
        this.db.userPreferences,
        this.db.appSettings,
        this.db.apiCache,
        this.db.metadata,
      ];

      for (const table of tables) {
        const keys = await table.orderBy('key').keys() as string[];
        allKeys.push(...keys);
      }

      return allKeys;
    } catch (error) {
      if (this.config.debug) {
        console.error('[DexieStorageAdapter] Keys operation failed:', error);
      }
      return [];
    }
  }

  /**
   * Get storage size
   */
  async size(): Promise<number> {
    try {
      const stats = await this.db.getStats();
      return Object.values(stats.recordCount).reduce((sum, count) => sum + count, 0);
    } catch (error) {
      if (this.config.debug) {
        console.error('[DexieStorageAdapter] Size operation failed:', error);
      }
      return 0;
    }
  }

  // =================== Event System ===================

  /**
   * Register change event listener
   */
  onChange(callback: (event: StorageChangeEvent) => void): () => void {
    this.changeListeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.changeListeners.delete(callback);
    };
  }

  /**
   * Emit change event with debouncing
   */
  private emitChangeEvent<T>(
    key: string,
    type: 'added' | 'updated' | 'removed' | 'cleared',
    oldValue?: T,
    newValue?: T
  ): void {
    // Debounce events
    const debounceKey = `${key}:${type}`;
    const existingTimeout = this.eventDebounceMap.get(debounceKey);
    
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      // Create event using the event builder for consistency
      const storageEvent = type === 'added' 
        ? StorageEventUtils.dataAdded(key, newValue, 'indexeddb')
        : type === 'updated'
        ? StorageEventUtils.dataUpdated(key, oldValue, newValue, 'indexeddb')
        : type === 'removed'
        ? StorageEventUtils.dataRemoved(key, oldValue, 'indexeddb')
        : StorageEventUtils.storageCleared('indexeddb');

      // Legacy event for backward compatibility
      const event: StorageChangeEvent<T> = {
        key,
        type,
        oldValue,
        newValue,
        timestamp: new Date(),
        source: 'user',
        metadata: {
          adapter: 'indexeddb',
          duration: 0,
          dataSize: newValue ? JSON.stringify(newValue).length : 0,
        },
      };

      // Emit to legacy change listeners
      this.changeListeners.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          if (this.config.debug) {
            console.error('[DexieStorageAdapter] Event listener error:', error);
          }
        }
      });

      // Emit to new event system
      this.eventManager.emit(storageEvent);

      // Notify observers if auto-notification is enabled
      if (this.config.observerConfig.enableAutoNotification) {
        this.observerManager.notifyDataChange(
          type,
          key,
          oldValue,
          newValue,
          'indexeddb',
          storageEvent.metadata
        );
      }

      this.eventDebounceMap.delete(debounceKey);
    }, this.config.performanceOptions.eventDebounceMs);

    this.eventDebounceMap.set(debounceKey, timeout);
  }

  // =================== Database Operations ===================

  /**
   * Get value from database by key
   */
  private async getFromDatabase<T>(key: string): Promise<T | null> {
    const tableInfo = StorageUtils.parseKey(key);
    if (!tableInfo) {
      return null;
    }

    const table = this.getTable(tableInfo.tableName);
    const record = await table.get(key);
    
    return record ? (record.value as T) : null;
  }

  /**
   * Store value in database
   */
  private async storeInDatabase<T>(key: string, value: T): Promise<void> {
    const tableInfo = StorageUtils.parseKey(key);
    if (!tableInfo) {
      throw new Error(`Invalid key format: ${key}`);
    }

    const table = this.getTable(tableInfo.tableName);
    const record = {
      key,
      value,
      updatedAt: new Date(),
      ...tableInfo.additionalFields,
    };

    await table.put(record);
  }

  /**
   * Remove value from database
   */
  private async removeFromDatabase(key: string): Promise<void> {
    const tableInfo = StorageUtils.parseKey(key);
    if (!tableInfo) {
      return;
    }

    const table = this.getTable(tableInfo.tableName);
    await table.delete(key);
  }

  /**
   * Get table by name
   */
  private getTable(tableName: string): any {
    switch (tableName) {
      case TableNames.TOKENS:
        return this.db.tokens;
      case TableNames.USER_PREFERENCES:
        return this.db.userPreferences;
      case TableNames.APP_SETTINGS:
        return this.db.appSettings;
      case TableNames.API_CACHE:
        return this.db.apiCache;
      case TableNames.METADATA:
        return this.db.metadata;
      default:
        throw new Error(`Unknown table: ${tableName}`);
    }
  }

  // =================== Advanced Adapter Methods ===================

  /**
   * Execute batch operations
   */
  async batch(operations: StorageBatchOperation[]): Promise<StorageResult<void>> {
    try {
      const batchSize = this.config.performanceOptions.batchSize;
      
      for (let i = 0; i < operations.length; i += batchSize) {
        const batch = operations.slice(i, i + batchSize);
        
        await this.db.transaction('rw', [
          this.db.tokens,
          this.db.userPreferences,
          this.db.appSettings,
          this.db.apiCache,
          this.db.metadata,
        ], async () => {
          for (const op of batch) {
            switch (op.type) {
              case 'set':
                if (op.key && op.value !== undefined) {
                  await this.storeInDatabase(op.key, op.value);
                }
                break;
              case 'remove':
                if (op.key) {
                  await this.removeFromDatabase(op.key);
                }
                break;
              case 'clear':
                await this.clear();
                break;
            }
          }
        });
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: StorageUtils.createError(
          'BATCH_OPERATION_FAILED',
          'Batch operation failed',
          error as Error
        ),
      };
    }
  }

  /**
   * Query with filters
   */
  async query(filter: StorageQuery): Promise<StorageResult<any[]>> {
    try {
      // Implementation would depend on specific query requirements
      // For now, return basic key-based filtering
      const allKeys = await this.keys();
      let filteredKeys = allKeys;

      if (filter.key) {
        if (typeof filter.key === 'string') {
          filteredKeys = allKeys.filter(k => k.includes(filter.key as string));
        } else if (filter.key instanceof RegExp) {
          filteredKeys = allKeys.filter(k => filter.key!.test(k));
        }
      }

      if (filter.limit) {
        filteredKeys = filteredKeys.slice(0, filter.limit);
      }

      if (filter.offset) {
        filteredKeys = filteredKeys.slice(filter.offset);
      }

      const results = await this.getBatch(filteredKeys);
      return {
        success: true,
        data: Object.values(results),
      };
    } catch (error) {
      return {
        success: false,
        error: StorageUtils.createError(
          'QUERY_FAILED',
          'Query operation failed',
          error as Error
        ),
      };
    }
  }

  /**
   * Watch for changes
   */
  async watch(key: string, callback: StorageChangeCallback): Promise<StorageResult<() => void>> {
    try {
      const unsubscribe = this.onChange((event) => {
        if (event.key === key || key === '*') {
          callback(event);
        }
      });

      return {
        success: true,
        data: unsubscribe,
      };
    } catch (error) {
      return {
        success: false,
        error: StorageUtils.createError(
          'WATCH_FAILED',
          'Watch operation failed',
          error as Error
        ),
      };
    }
  }

  /**
   * Export data
   */
  async export(): Promise<StorageResult<StorageExportData>> {
    try {
      const allKeys = await this.keys();
      const data = await this.getBatch(allKeys);

      const exportData: StorageExportData = {
        timestamp: new Date(),
        version: this.config.version.toString(),
        data,
        metadata: {
          databaseName: this.config.databaseName,
          recordCount: allKeys.length,
        },
      };

      return {
        success: true,
        data: exportData,
      };
    } catch (error) {
      return {
        success: false,
        error: StorageUtils.createError(
          'EXPORT_FAILED',
          'Export operation failed',
          error as Error
        ),
      };
    }
  }

  /**
   * Import data
   */
  async import(data: StorageExportData): Promise<StorageResult<void>> {
    try {
      await this.setBatch(data.data);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: StorageUtils.createError(
          'IMPORT_FAILED',
          'Import operation failed',
          error as Error
        ),
      };
    }
  }

  /**
   * Execute transaction
   */
  async transaction<R>(callback: (adapter: StorageService) => Promise<R>): Promise<StorageResult<R>> {
    try {
      const result = await this.db.transaction('rw', [
        this.db.tokens,
        this.db.userPreferences,
        this.db.appSettings,
        this.db.apiCache,
        this.db.metadata,
      ], async () => {
        return await callback(this);
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: StorageUtils.createError(
          'TRANSACTION_FAILED',
          'Transaction failed',
          error as Error
        ),
      };
    }
  }

  /**
   * Get storage usage
   */
  async getUsage(): Promise<StorageResult<StorageUsage>> {
    try {
      const stats = await this.db.getStats();
      const totalRecords = Object.values(stats.recordCount).reduce((sum, count) => sum + count, 0);

      // Estimate storage usage (rough calculation)
      const estimatedSize = stats.size || 0;
      const quotaEstimate = this.config.maxSizeLimit * 1024 * 1024; // Convert MB to bytes

      const usage: StorageUsage = {
        used: estimatedSize,
        available: quotaEstimate,
        percentage: Math.round((estimatedSize / quotaEstimate) * 100),
        itemCount: totalRecords,
      };

      return {
        success: true,
        data: usage,
      };
    } catch (error) {
      return {
        success: false,
        error: StorageUtils.createError(
          'USAGE_CHECK_FAILED',
          'Usage check failed',
          error as Error
        ),
      };
    }
  }

  /**
   * Cleanup expired data
   */
  async cleanup(): Promise<StorageResult<void>> {
    try {
      await this.db.cleanup();
      
      if (this.config.cacheConfig.enabled) {
        await this.cache.cleanup();
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: StorageUtils.createError(
          'CLEANUP_FAILED',
          'Cleanup operation failed',
          error as Error
        ),
      };
    }
  }

  // =================== Enhanced Event System API ===================

  /**
   * Get the event manager instance
   */
  getEventManager(): StorageEventManager {
    return this.eventManager;
  }

  /**
   * Get the observer manager instance
   */
  getObserverManager(): StorageObserverManager {
    return this.observerManager;
  }

  /**
   * Add an event listener using the new event system
   */
  addEventListener<T extends import('./events').StorageEventType>(
    eventType: T,
    listener: import('./events').TypedStorageEventListener<T>,
    options?: import('./events').EventListenerOptions
  ): () => void {
    return this.eventManager.on(eventType, listener, options);
  }

  /**
   * Register a storage observer
   */
  registerObserver(
    observer: import('./observer-pattern').StorageObserver,
    options?: import('./observer-pattern').ObserverOptions
  ): () => void {
    return this.observerManager.register(observer, options);
  }

  /**
   * Manually trigger observer notifications (useful for testing)
   */
  notifyObservers(
    type: 'added' | 'updated' | 'deleted' | 'cleared',
    key: string,
    oldValue?: any,
    newValue?: any
  ): void {
    this.observerManager.notifyDataChange(type, key, oldValue, newValue, 'indexeddb');
  }

  /**
   * Get event system statistics
   */
  getEventStats() {
    return {
      eventManager: this.eventManager.getStats(),
      observerManager: this.observerManager.getStats(),
    };
  }

  /**
   * Flush all batched notifications
   */
  flushBatchedNotifications(): void {
    this.observerManager.flushBatchedNotifications();
  }

  /**
   * Close the storage adapter
   */
  async close(): Promise<StorageResult<void>> {
    try {
      // Clear event debounce timers
      this.eventDebounceMap.forEach((timeout) => clearTimeout(timeout));
      this.eventDebounceMap.clear();

      // Clear listeners
      this.changeListeners.clear();

      // Clean up event system (only if not using global instances)
      if (!this.config.eventConfig.useGlobalEventManager) {
        this.eventManager.destroy();
      }

      // Clean up observer system (only if not using global instances)
      if (!this.config.observerConfig.useGlobalObserverManager) {
        this.observerManager.destroy();
      }

      // Close cache
      if (this.config.cacheConfig.enabled) {
        await this.cache.close();
      }

      // Close database
      await this.db.close();

      this.initialized = false;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: StorageUtils.createError(
          'CLOSE_FAILED',
          'Close operation failed',
          error as Error
        ),
      };
    }
  }
}

/**
 * Factory function to create DexieStorageAdapter
 */
export function createDexieAdapter(config?: Partial<DexieAdapterConfig>): DexieStorageAdapter {
  return new DexieStorageAdapter(config);
}

/**
 * Default export
 */
export default DexieStorageAdapter;