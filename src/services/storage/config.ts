/**
 * Storage configuration management for Noteum application
 *
 * This module provides default configurations and utilities for managing
 * storage settings across different storage adapters (IndexedDB, localStorage).
 *
 * @fileoverview Storage configuration management
 * @module storage/config
 */

import type {
  StorageConfig,
  IndexedDBConfig,
  IndexedDBStoreConfig,
} from './interfaces';

/**
 * Default storage configuration
 */
export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  databaseName: 'noteum_storage',
  version: 1,
  debug: import.meta.env.DEV,
  maxSizeLimit: 100 * 1024 * 1024, // 100MB
  enableCompression: true,
  fallbackToLocalStorage: true,
};

/**
 * Default IndexedDB store configurations
 * These define the object stores that will be created in the IndexedDB database
 */
export const DEFAULT_INDEXEDDB_STORES: IndexedDBStoreConfig[] = [
  {
    name: 'user_preferences',
    keyPath: 'id',
    autoIncrement: false,
    indexes: [
      {
        name: 'by_user_id',
        keyPath: 'userId',
        unique: false,
      },
      {
        name: 'by_category',
        keyPath: 'category',
        unique: false,
      },
      {
        name: 'by_updated_at',
        keyPath: 'updatedAt',
        unique: false,
      },
    ],
  },
  {
    name: 'app_cache',
    keyPath: 'key',
    autoIncrement: false,
    indexes: [
      {
        name: 'by_expires_at',
        keyPath: 'expiresAt',
        unique: false,
      },
      {
        name: 'by_created_at',
        keyPath: 'createdAt',
        unique: false,
      },
    ],
  },
  {
    name: 'offline_data',
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      {
        name: 'by_type',
        keyPath: 'type',
        unique: false,
      },
      {
        name: 'by_sync_status',
        keyPath: 'syncStatus',
        unique: false,
      },
      {
        name: 'by_timestamp',
        keyPath: 'timestamp',
        unique: false,
      },
    ],
  },
  {
    name: 'form_drafts',
    keyPath: 'id',
    autoIncrement: false,
    indexes: [
      {
        name: 'by_form_type',
        keyPath: 'formType',
        unique: false,
      },
      {
        name: 'by_user_id',
        keyPath: 'userId',
        unique: false,
      },
      {
        name: 'by_last_modified',
        keyPath: 'lastModified',
        unique: false,
      },
    ],
  },
];

/**
 * Default IndexedDB configuration
 */
export const DEFAULT_INDEXEDDB_CONFIG: IndexedDBConfig = {
  ...DEFAULT_STORAGE_CONFIG,
  stores: DEFAULT_INDEXEDDB_STORES,
  enableTransactionLogging: import.meta.env.DEV,
  autoIncrement: false,
};

/**
 * Storage configuration manager class
 */
export class StorageConfigManager {
  private config: StorageConfig;
  private indexedDBConfig: IndexedDBConfig;

  constructor(
    customConfig?: Partial<StorageConfig>,
    customIndexedDBConfig?: Partial<IndexedDBConfig>
  ) {
    this.config = { ...DEFAULT_STORAGE_CONFIG, ...customConfig };
    this.indexedDBConfig = {
      ...DEFAULT_INDEXEDDB_CONFIG,
      ...customIndexedDBConfig,
      stores: customIndexedDBConfig?.stores || DEFAULT_INDEXEDDB_STORES,
    };
  }

  /**
   * Get the current storage configuration
   */
  getConfig(): StorageConfig {
    return { ...this.config };
  }

  /**
   * Get the IndexedDB specific configuration
   */
  getIndexedDBConfig(): IndexedDBConfig {
    return { ...this.indexedDBConfig };
  }

  /**
   * Update storage configuration
   */
  updateConfig(updates: Partial<StorageConfig>): void {
    this.config = { ...this.config, ...updates };

    // Update IndexedDB config if it shares properties
    this.indexedDBConfig = { ...this.indexedDBConfig, ...updates };
  }

  /**
   * Update IndexedDB specific configuration
   */
  updateIndexedDBConfig(updates: Partial<IndexedDBConfig>): void {
    this.indexedDBConfig = { ...this.indexedDBConfig, ...updates };
  }

  /**
   * Add a new store configuration to IndexedDB
   */
  addStore(storeConfig: IndexedDBStoreConfig): void {
    const existingIndex = this.indexedDBConfig.stores.findIndex(
      store => store.name === storeConfig.name
    );

    if (existingIndex >= 0) {
      // Update existing store configuration
      this.indexedDBConfig.stores[existingIndex] = storeConfig;
    } else {
      // Add new store configuration
      this.indexedDBConfig.stores.push(storeConfig);
    }
  }

  /**
   * Remove a store configuration from IndexedDB
   */
  removeStore(storeName: string): boolean {
    const initialLength = this.indexedDBConfig.stores.length;
    this.indexedDBConfig.stores = this.indexedDBConfig.stores.filter(
      store => store.name !== storeName
    );
    return this.indexedDBConfig.stores.length < initialLength;
  }

  /**
   * Get a specific store configuration
   */
  getStoreConfig(storeName: string): IndexedDBStoreConfig | undefined {
    return this.indexedDBConfig.stores.find(store => store.name === storeName);
  }

  /**
   * Validate the current configuration
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate basic config
    if (!this.config.databaseName || this.config.databaseName.trim() === '') {
      errors.push('Database name cannot be empty');
    }

    if (this.config.version < 1) {
      errors.push('Database version must be at least 1');
    }

    if (this.config.maxSizeLimit < 0) {
      errors.push('Max size limit cannot be negative');
    }

    // Validate IndexedDB stores
    const storeNames = new Set<string>();
    for (const store of this.indexedDBConfig.stores) {
      if (!store.name || store.name.trim() === '') {
        errors.push('Store name cannot be empty');
        continue;
      }

      if (storeNames.has(store.name)) {
        errors.push(`Duplicate store name: ${store.name}`);
      }
      storeNames.add(store.name);

      // Validate indexes
      if (store.indexes) {
        const indexNames = new Set<string>();
        for (const index of store.indexes) {
          if (!index.name || index.name.trim() === '') {
            errors.push(`Index name cannot be empty in store: ${store.name}`);
            continue;
          }

          if (indexNames.has(index.name)) {
            errors.push(
              `Duplicate index name '${index.name}' in store: ${store.name}`
            );
          }
          indexNames.add(index.name);

          if (
            !index.keyPath ||
            (Array.isArray(index.keyPath) && index.keyPath.length === 0) ||
            (typeof index.keyPath === 'string' && index.keyPath.trim() === '')
          ) {
            errors.push(
              `Index keyPath cannot be empty for index '${index.name}' in store: ${store.name}`
            );
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Reset to default configuration
   */
  reset(): void {
    this.config = { ...DEFAULT_STORAGE_CONFIG };
    this.indexedDBConfig = { ...DEFAULT_INDEXEDDB_CONFIG };
  }

  /**
   * Create a configuration optimized for development
   */
  static createDevelopmentConfig(
    overrides?: Partial<StorageConfig>
  ): StorageConfigManager {
    const devConfig: Partial<StorageConfig> = {
      debug: true,
      databaseName: 'noteum_storage_dev',
      enableCompression: false, // Disable compression for easier debugging
      ...overrides,
    };

    const devIndexedDBConfig: Partial<IndexedDBConfig> = {
      enableTransactionLogging: true,
    };

    return new StorageConfigManager(devConfig, devIndexedDBConfig);
  }

  /**
   * Create a configuration optimized for production
   */
  static createProductionConfig(
    overrides?: Partial<StorageConfig>
  ): StorageConfigManager {
    const prodConfig: Partial<StorageConfig> = {
      debug: false,
      databaseName: 'noteum_storage',
      enableCompression: true,
      maxSizeLimit: 500 * 1024 * 1024, // 500MB for production
      ...overrides,
    };

    const prodIndexedDBConfig: Partial<IndexedDBConfig> = {
      enableTransactionLogging: false,
    };

    return new StorageConfigManager(prodConfig, prodIndexedDBConfig);
  }

  /**
   * Create a configuration for testing
   */
  static createTestConfig(
    overrides?: Partial<StorageConfig>
  ): StorageConfigManager {
    const testConfig: Partial<StorageConfig> = {
      debug: true,
      databaseName: 'noteum_storage_test',
      enableCompression: false,
      fallbackToLocalStorage: false, // Use in-memory for tests
      maxSizeLimit: 10 * 1024 * 1024, // 10MB for tests
      ...overrides,
    };

    return new StorageConfigManager(testConfig);
  }
}

/**
 * Default configuration manager instance
 */
const defaultConfigManager = new StorageConfigManager();

export default defaultConfigManager;

/**
 * Export utility functions for quick access
 */
export const getDefaultConfig = () => defaultConfigManager.getConfig();
export const getDefaultIndexedDBConfig = () =>
  defaultConfigManager.getIndexedDBConfig();
export const validateConfig = (config: StorageConfig) => {
  const manager = new StorageConfigManager(config);
  return manager.validate();
};
