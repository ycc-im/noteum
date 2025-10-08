/**
 * Integration Tests for Enhanced Storage System
 *
 * Comprehensive test suite covering all Issue #100 implementations:
 * - Event Management System
 * - Observer Pattern
 * - Cross-Tab Synchronization
 * - Extended Cache Strategies (LFU/FIFO)
 * - Configuration Hot Reload
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DexieStorageAdapter } from './dexie-adapter';
import { StorageEventManager } from './event-manager';
import {
  StorageObserverManager,
  FunctionalStorageObserver,
} from './observer-pattern';
import { CrossTabSyncManager } from './cross-tab-sync';
import { CacheStrategyFactory } from './cache-factory';
import {
  ConfigurationWatcher,
  createConfigurationWatcher,
} from './config-watcher';
import { createStorageConfigValidator } from './config-validator';
import type { StorageEvent, StorageChangeEvent } from './events';
import type { StorageObserver } from './observer-pattern';

describe('Enhanced Storage System Integration', () => {
  let adapter: DexieStorageAdapter;
  let eventManager: StorageEventManager;
  let observerManager: StorageObserverManager;
  let crossTabSync: CrossTabSyncManager;
  let configWatcher: ConfigurationWatcher;

  beforeEach(async () => {
    // Initialize with enhanced configuration
    adapter = new DexieStorageAdapter({
      databaseName: `test_enhanced_${Date.now()}_${Math.random()}`,
      debug: false,
      eventConfig: {
        useGlobalEventManager: false,
        maxListeners: 20,
        enableLogging: true,
      },
      observerConfig: {
        useGlobalObserverManager: false,
        enableAutoNotification: true,
      },
    });

    await adapter.initialize();

    eventManager = adapter.getEventManager();
    observerManager = adapter.getObserverManager();

    crossTabSync = new CrossTabSyncManager({
      channelName: `test-sync-${Date.now()}`,
      heartbeatInterval: 1000,
      enableConflictResolution: true,
    });

    configWatcher = createConfigurationWatcher({
      enableHotReload: false, // Disable for testing
      enableValidation: true,
      enableAutoRollback: true,
    });
  });

  afterEach(async () => {
    await adapter.close();
    crossTabSync.destroy();
    configWatcher.destroy();
    vi.clearAllMocks();
  });

  describe('Event Management System', () => {
    it('should emit and handle storage events correctly', async () => {
      const mockListener = vi.fn();
      const unsubscribe = eventManager.on('change', mockListener);

      // Trigger data change through adapter
      await adapter.set('test-key', 'test-value');

      // Wait for debounced events
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(mockListener).toHaveBeenCalled();
      const event = mockListener.mock.calls[0][0] as StorageEvent;
      expect(event.type).toBe('change');
      expect(event.source).toBe('indexeddb');

      unsubscribe();

      // Event manager stats should reflect activity
      const stats = eventManager.getStats();
      expect(stats.totalListeners).toBe(0); // After unsubscribe
      expect(stats.eventHistory).toBeGreaterThan(0);
    });

    it('should filter events by source and key pattern', async () => {
      const indexeddbListener = vi.fn();
      const userKeyListener = vi.fn();

      eventManager.on('change', indexeddbListener, { source: 'indexeddb' });
      eventManager.on('change', userKeyListener, { keyPattern: /^user\./ });

      await adapter.set('user.profile', { name: 'John' });
      await adapter.set('app.settings', { theme: 'dark' });

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(indexeddbListener).toHaveBeenCalledTimes(2); // Both events from indexeddb
      expect(userKeyListener).toHaveBeenCalledTimes(1); // Only user.profile matches pattern
    });

    it('should debounce rapid events correctly', async () => {
      const mockListener = vi.fn();
      eventManager.on('change', mockListener, { debounce: 100 });

      // Rapid fire updates
      await adapter.set('counter', 1);
      await adapter.set('counter', 2);
      await adapter.set('counter', 3);

      // Should not have called listener yet
      expect(mockListener).not.toHaveBeenCalled();

      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should have been called only once
      expect(mockListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('Observer Pattern Implementation', () => {
    it('should notify observers of data changes', async () => {
      const observer = {
        onDataAdded: vi.fn(),
        onDataChanged: vi.fn(),
        onDataDeleted: vi.fn(),
        onStorageCleared: vi.fn(),
      };

      const unsubscribe = observerManager.register(observer);

      await adapter.set('test-key', 'initial-value');
      await adapter.set('test-key', 'updated-value');
      await adapter.delete('test-key');

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(observer.onDataAdded).toHaveBeenCalledWith(
        'test-key',
        'initial-value',
        expect.any(Object)
      );

      expect(observer.onDataChanged).toHaveBeenCalledWith(
        'test-key',
        'initial-value',
        'updated-value',
        expect.any(Object)
      );

      expect(observer.onDataDeleted).toHaveBeenCalledWith(
        'test-key',
        'updated-value',
        expect.any(Object)
      );

      unsubscribe();
    });

    it('should filter observer notifications by key pattern', async () => {
      const userObserver = new FunctionalStorageObserver({
        onDataAdded: vi.fn(),
        onDataChanged: vi.fn(),
      });

      const appObserver = new FunctionalStorageObserver({
        onDataAdded: vi.fn(),
        onDataChanged: vi.fn(),
      });

      observerManager.register(userObserver, { keyPattern: /^user\./ });
      observerManager.register(appObserver, { keyPattern: /^app\./ });

      await adapter.set('user.name', 'John');
      await adapter.set('app.theme', 'dark');

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(userObserver.handlers.onDataAdded).toHaveBeenCalledWith(
        'user.name',
        'John',
        expect.any(Object)
      );
      expect(userObserver.handlers.onDataAdded).not.toHaveBeenCalledWith(
        'app.theme',
        'dark',
        expect.any(Object)
      );

      expect(appObserver.handlers.onDataAdded).toHaveBeenCalledWith(
        'app.theme',
        'dark',
        expect.any(Object)
      );
      expect(appObserver.handlers.onDataAdded).not.toHaveBeenCalledWith(
        'user.name',
        'John',
        expect.any(Object)
      );
    });

    it('should batch observer notifications when configured', async () => {
      const batchedObserver = {
        onDataAdded: vi.fn(),
        onDataChanged: vi.fn(),
        onDataDeleted: vi.fn(),
        onStorageCleared: vi.fn(),
      };

      observerManager.register(batchedObserver, {
        batchDelay: 50,
        maxBatchSize: 5,
      });

      // Rapid operations
      await adapter.set('item1', 'value1');
      await adapter.set('item2', 'value2');
      await adapter.set('item3', 'value3');

      // Should not have been called yet (batching)
      expect(batchedObserver.onDataAdded).not.toHaveBeenCalled();

      // Wait for batch to flush
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should have been called for all items
      expect(batchedObserver.onDataAdded).toHaveBeenCalledTimes(3);
    });
  });

  describe('Cross-Tab Synchronization', () => {
    it('should broadcast data changes to other tabs', async () => {
      const mockSyncListener = vi.fn();
      const syncManager2 = new CrossTabSyncManager(
        {
          channelName: crossTabSync.getStats().tabId, // Same channel
        },
        {
          onDataSynced: mockSyncListener,
        }
      );

      // Simulate data change broadcast
      crossTabSync.broadcastDataChange(
        'added',
        'sync-test',
        undefined,
        'sync-value'
      );

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockSyncListener).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'sync-test',
          type: 'added',
          newValue: 'sync-value',
        })
      );

      syncManager2.destroy();
    });

    it('should detect and handle tab connections', async () => {
      const tabConnectedListener = vi.fn();
      const tabDisconnectedListener = vi.fn();

      const syncManager2 = new CrossTabSyncManager(
        {
          channelName: crossTabSync.getStats().tabId,
        },
        {
          onTabConnected: tabConnectedListener,
          onTabDisconnected: tabDisconnectedListener,
        }
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should detect the connection
      expect(tabConnectedListener).toHaveBeenCalled();

      syncManager2.destroy();

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should detect the disconnection
      expect(tabDisconnectedListener).toHaveBeenCalled();
    });

    it('should handle sync requests and responses', async () => {
      const syncManager2 = new CrossTabSyncManager({
        channelName: crossTabSync.getStats().tabId,
      });

      const syncPromise = crossTabSync.requestSync(['test-key']);

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should complete without error (even if no data to sync)
      await expect(syncPromise).resolves.toBeUndefined();

      syncManager2.destroy();
    });
  });

  describe('Extended Cache Strategies', () => {
    it('should work with LFU cache strategy', async () => {
      const lfuCache = CacheStrategyFactory.create({
        strategy: 'LFU',
        maxSize: 1, // 1MB limit
        maxEntries: 3,
      });

      lfuCache.initialize();

      // Add items
      lfuCache.set('item1', 'value1');
      lfuCache.set('item2', 'value2');
      lfuCache.set('item3', 'value3');

      // Access item1 multiple times (increase frequency)
      lfuCache.get('item1');
      lfuCache.get('item1');
      lfuCache.get('item1');

      // Access item2 once
      lfuCache.get('item2');

      // Add another item, should evict item3 (least frequently used)
      lfuCache.set('item4', 'value4');

      expect(lfuCache.has('item1')).toBe(true); // High frequency
      expect(lfuCache.has('item2')).toBe(true); // Medium frequency
      expect(lfuCache.has('item3')).toBe(false); // Evicted (least frequent)
      expect(lfuCache.has('item4')).toBe(true); // Newly added

      const stats = lfuCache.getStats();
      expect(stats.itemCount).toBe(3);
      expect(stats.evictions).toBe(1);

      lfuCache.destroy();
    });

    it('should work with FIFO cache strategy', async () => {
      const fifoCache = CacheStrategyFactory.create({
        strategy: 'FIFO',
        maxSize: 1,
        maxEntries: 3,
      });

      fifoCache.initialize();

      // Add items in order
      fifoCache.set('first', 'value1');
      fifoCache.set('second', 'value2');
      fifoCache.set('third', 'value3');

      // Access items (shouldn't affect FIFO order)
      fifoCache.get('first');
      fifoCache.get('second');
      fifoCache.get('third');

      // Add another item, should evict 'first' (first in, first out)
      fifoCache.set('fourth', 'value4');

      expect(fifoCache.has('first')).toBe(false); // Evicted (first in)
      expect(fifoCache.has('second')).toBe(true);
      expect(fifoCache.has('third')).toBe(true);
      expect(fifoCache.has('fourth')).toBe(true);

      const stats = fifoCache.getStats();
      expect(stats.itemCount).toBe(3);
      expect(stats.evictions).toBe(1);

      fifoCache.destroy();
    });

    it('should adapt cache strategy based on performance', async () => {
      const adaptiveCache = CacheStrategyFactory.createAdaptive({
        maxSize: 1,
        maxEntries: 10,
        enableAutoAdaptation: true,
        monitoringInterval: 100,
      });

      adaptiveCache.initialize();

      // Simulate workload that might benefit from different strategies
      for (let i = 0; i < 20; i++) {
        adaptiveCache.set(`key${i}`, `value${i}`);

        // Access some keys multiple times (LFU pattern)
        if (i % 3 === 0) {
          adaptiveCache.get(`key${i}`);
          adaptiveCache.get(`key${i}`);
        }
      }

      const initialStrategy = adaptiveCache.getCurrentStrategy();
      const metrics = adaptiveCache.getPerformanceMetrics();

      expect(metrics.strategy).toBe(initialStrategy);
      expect(typeof metrics.hitRatio).toBe('number');
      expect(typeof metrics.totalOperations).toBe('number');

      adaptiveCache.destroy();
    });
  });

  describe('Configuration Hot Reload', () => {
    it('should validate configuration changes', async () => {
      const validator = createStorageConfigValidator();
      configWatcher.addValidator(validator);

      // Valid configuration
      const validResult = await configWatcher.setConfig({
        databaseName: 'test-db',
        version: 1,
        maxSize: 50,
        ttl: 300000,
        debug: false,
      });

      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      // Invalid configuration
      const invalidResult = await configWatcher.setConfig({
        databaseName: '', // Invalid: empty string
        version: 0, // Invalid: must be >= 1
        maxSize: -10, // Invalid: must be positive
        ttl: 'invalid', // Invalid: must be number
      });

      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    it('should handle configuration rollback', async () => {
      const initialConfig = { setting1: 'value1', setting2: 'value2' };
      const updatedConfig = { setting1: 'updated1', setting2: 'updated2' };

      await configWatcher.setConfig(initialConfig);
      await configWatcher.setConfig(updatedConfig);

      expect(configWatcher.getConfig()).toEqual(updatedConfig);

      // Rollback to previous configuration
      await configWatcher.rollbackConfig('Test rollback');

      expect(configWatcher.getConfig()).toEqual(initialConfig);

      const history = configWatcher.getConfigHistory();
      expect(history.length).toBeGreaterThan(0);
    });

    it('should track configuration change events', async () => {
      const changeListener = vi.fn();
      const rollbackListener = vi.fn();

      const watcher = createConfigurationWatcher(
        {
          enableValidation: false,
          enableDebouncing: false,
        },
        {
          onConfigChanged: changeListener,
          onConfigRolledBack: rollbackListener,
        }
      );

      await watcher.setConfig({ test: 'value1' });
      await watcher.setConfig({ test: 'value2' });

      expect(changeListener).toHaveBeenCalledTimes(2);
      expect(changeListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'applied',
          newConfig: expect.objectContaining({ test: 'value1' }),
        })
      );

      await watcher.rollbackConfig('Test');
      expect(rollbackListener).toHaveBeenCalled();

      watcher.destroy();
    });

    it('should update specific configuration keys', async () => {
      await configWatcher.setConfig({
        database: { name: 'test' },
        cache: { size: 100 },
      });

      await configWatcher.updateConfigKey('database.name', 'updated-test');
      await configWatcher.updateConfigKey('cache.size', 200);

      const config = configWatcher.getConfig();
      expect(config.database.name).toBe('updated-test');
      expect(config.cache.size).toBe(200);
    });
  });

  describe('Full System Integration', () => {
    it('should handle complex workflow with all systems working together', async () => {
      // Set up comprehensive monitoring
      const eventListener = vi.fn();
      const observerCallbacks = {
        onDataAdded: vi.fn(),
        onDataChanged: vi.fn(),
        onDataDeleted: vi.fn(),
        onStorageCleared: vi.fn(),
      };
      const configChangeListener = vi.fn();

      eventManager.on('change', eventListener);
      observerManager.register(observerCallbacks);

      const systemWatcher = createConfigurationWatcher(
        {
          enableValidation: true,
          enableAutoRollback: false,
        },
        {
          onConfigChanged: configChangeListener,
        }
      );

      // 1. Configure the system
      await systemWatcher.setConfig({
        databaseName: 'integration-test',
        cacheStrategy: 'LFU',
        maxSize: 100,
        enableSync: true,
      });

      // 2. Perform storage operations
      await adapter.set('user.profile', { name: 'John', age: 30 });
      await adapter.set('user.preferences', { theme: 'dark', language: 'en' });
      await adapter.set('app.version', '1.0.0');

      // 3. Update existing data
      await adapter.set('user.profile', { name: 'John Doe', age: 31 });

      // 4. Delete some data
      await adapter.delete('app.version');

      // 5. Clear some data
      await adapter.clear();

      // Wait for all events to propagate
      await new Promise(resolve => setTimeout(resolve, 200));

      // Verify all systems received events
      expect(eventListener).toHaveBeenCalled();
      expect(observerCallbacks.onDataAdded).toHaveBeenCalled();
      expect(observerCallbacks.onDataChanged).toHaveBeenCalled();
      expect(observerCallbacks.onDataDeleted).toHaveBeenCalled();
      expect(observerCallbacks.onStorageCleared).toHaveBeenCalled();
      expect(configChangeListener).toHaveBeenCalled();

      // Verify system stats
      const eventStats = eventManager.getStats();
      const observerStats = observerManager.getStats();
      const adapterStats = adapter.getEventStats();

      expect(eventStats.totalListeners).toBeGreaterThan(0);
      expect(observerStats.totalObservers).toBeGreaterThan(0);
      expect(adapterStats.eventManager.totalEventTypes).toBeGreaterThan(0);

      systemWatcher.destroy();
    });

    it('should maintain data consistency across all systems', async () => {
      // Test that data changes are consistent across event, observer, and sync systems
      const eventData: any[] = [];
      const observerData: any[] = [];
      const syncData: any[] = [];

      eventManager.on('change', event => {
        eventData.push({
          key: event.data.key,
          type: event.data.type,
          value: event.data.newValue,
        });
      });

      observerManager.register({
        onDataAdded: (key, value) =>
          observerData.push({ key, type: 'added', value }),
        onDataChanged: (key, oldValue, newValue) =>
          observerData.push({ key, type: 'updated', value: newValue }),
        onDataDeleted: (key, oldValue) =>
          observerData.push({ key, type: 'removed', value: undefined }),
        onStorageCleared: () =>
          observerData.push({ key: '*', type: 'cleared', value: undefined }),
      });

      const testData = [
        { key: 'test1', value: 'value1' },
        { key: 'test2', value: 'value2' },
        { key: 'test3', value: 'value3' },
      ];

      // Perform operations
      for (const item of testData) {
        await adapter.set(item.key, item.value);
      }

      // Update one item
      await adapter.set('test2', 'updated-value2');

      // Delete one item
      await adapter.delete('test3');

      // Wait for all events
      await new Promise(resolve => setTimeout(resolve, 200));

      // Verify consistency
      expect(eventData.length).toBeGreaterThan(0);
      expect(observerData.length).toBeGreaterThan(0);

      // Check that the same operations were captured by both systems
      const eventKeys = eventData.map(d => d.key).sort();
      const observerKeys = observerData.map(d => d.key).sort();

      expect(eventKeys).toEqual(observerKeys);
    });
  });
});
