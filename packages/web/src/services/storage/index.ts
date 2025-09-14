/**
 * Storage service module entry point
 * 
 * This module exports all storage-related interfaces, types, and implementations
 * for the Noteum application local storage system.
 * 
 * @fileoverview Main entry point for storage services
 * @module storage
 */

// Export all interfaces and types
export * from './interfaces';
export { default as StorageConfig } from './config';

// Re-export commonly used types for convenience
export type {
  StorageAdapter,
  AdvancedStorageAdapter,
  StorageConfig as IStorageConfig,
  StorageResult,
  StorageError,
  StorageMetadata,
  StorageUsage,
  IndexedDBConfig,
  IStorageManager,
  IStorageFactory,
} from './interfaces';

// Barrel exports for future implementations
// Note: These will be implemented in subsequent streams
// export { IndexedDBAdapter } from './adapters/indexeddb';
// export { LocalStorageAdapter } from './adapters/localstorage';
// export { MemoryAdapter } from './adapters/memory';
// export { StorageManager } from './manager';
// export { StorageFactory } from './factory';

/**
 * Storage service initialization and configuration
 * This will be expanded in future implementations
 */
export const STORAGE_CONSTANTS = {
  /** Default database name */
  DEFAULT_DB_NAME: 'noteum_storage',
  
  /** Default database version */
  DEFAULT_DB_VERSION: 1,
  
  /** Default maximum size limit (100MB) */
  DEFAULT_MAX_SIZE: 100 * 1024 * 1024,
  
  /** Storage type identifiers */
  STORAGE_TYPES: {
    INDEXEDDB: 'indexeddb' as const,
    LOCALSTORAGE: 'localstorage' as const,
  },
  
  /** Error codes */
  ERROR_CODES: {
    INITIALIZATION_FAILED: 'INIT_FAILED',
    STORAGE_NOT_AVAILABLE: 'STORAGE_UNAVAILABLE',
    QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
    OPERATION_FAILED: 'OP_FAILED',
    INVALID_KEY: 'INVALID_KEY',
    INVALID_VALUE: 'INVALID_VALUE',
    TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  },
} as const;

/**
 * Utility function to check if IndexedDB is available
 * @returns Promise<boolean> - True if IndexedDB is supported and available
 */
export async function isIndexedDBAvailable(): Promise<boolean> {
  try {
    // Basic feature detection
    if (!('indexedDB' in window)) {
      return false;
    }
    
    // Test actual functionality with a simple operation
    return new Promise((resolve) => {
      const testDB = 'noteum_storage_test';
      const request = indexedDB.open(testDB, 1);
      
      request.onerror = () => resolve(false);
      request.onsuccess = () => {
        const db = request.result;
        db.close();
        // Clean up test database
        indexedDB.deleteDatabase(testDB);
        resolve(true);
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Create a test object store
        if (!db.objectStoreNames.contains('test')) {
          db.createObjectStore('test', { keyPath: 'id' });
        }
      };
    });
  } catch (error) {
    console.warn('IndexedDB availability check failed:', error);
    return false;
  }
}

/**
 * Utility function to check if localStorage is available
 * @returns boolean - True if localStorage is supported and available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__noteum_storage_test__';
    const testValue = 'test';
    
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    return retrieved === testValue;
  } catch (error) {
    console.warn('localStorage availability check failed:', error);
    return false;
  }
}

/**
 * Get the best available storage type for the current environment
 * @returns Promise<'indexeddb' | 'localstorage' | null>
 */
export async function getBestStorageType(): Promise<'indexeddb' | 'localstorage' | null> {
  if (await isIndexedDBAvailable()) {
    return STORAGE_CONSTANTS.STORAGE_TYPES.INDEXEDDB;
  }
  
  if (isLocalStorageAvailable()) {
    return STORAGE_CONSTANTS.STORAGE_TYPES.LOCALSTORAGE;
  }
  
  return null;
}
