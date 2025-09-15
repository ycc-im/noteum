/**
 * Storage service interfaces for Noteum application
 * 
 * This module defines comprehensive interfaces for local storage services
 * including IndexedDB (via Dexie.js) and localStorage fallback mechanisms.
 * 
 * @fileoverview Storage interfaces for local data persistence
 * @module storage/interfaces
 */

// Base storage configuration
export interface StorageConfig {
  /** Database name for IndexedDB */
  databaseName: string;
  /** Database version for schema migrations */
  version: number;
  /** Enable debug mode for storage operations */
  debug: boolean;
  /** Maximum size limit in MB */
  maxSizeLimit: number;
  /** Enable automatic data compression */
  enableCompression: boolean;
  /** Fallback to localStorage when IndexedDB unavailable */
  fallbackToLocalStorage: boolean;
}

// Storage operation result types
export interface StorageResult<T = any> {
  /** Operation success status */
  success: boolean;
  /** Data payload */
  data?: T;
  /** Error information if operation failed */
  error?: StorageError;
  /** Operation metadata */
  metadata?: StorageMetadata;
}

export interface StorageError {
  /** Error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Original error object */
  originalError?: Error;
  /** Error context information */
  context?: Record<string, any>;
}

export interface StorageMetadata {
  /** Operation timestamp */
  timestamp: Date;
  /** Time taken for operation (ms) */
  duration?: number;
  /** Storage type used (indexeddb/localstorage) */
  storageType: 'indexeddb' | 'localstorage';
  /** Data size in bytes */
  dataSize?: number;
}

// Generic storage operations interface
export interface IStorageAdapter<T = any> {
  /** Initialize storage adapter */
  initialize(): Promise<StorageResult<void>>;
  
  /** Check if storage is available and ready */
  isReady(): Promise<boolean>;
  
  /** Store data with key */
  set(key: string, value: T): Promise<StorageResult<void>>;
  
  /** Retrieve data by key */
  get(key: string): Promise<StorageResult<T>>;
  
  /** Remove data by key */
  remove(key: string): Promise<StorageResult<void>>;
  
  /** Clear all data */
  clear(): Promise<StorageResult<void>>;
  
  /** Get all keys */
  keys(): Promise<StorageResult<string[]>>;
  
  /** Check if key exists */
  has(key: string): Promise<StorageResult<boolean>>;
  
  /** Get storage usage statistics */
  getUsage(): Promise<StorageResult<StorageUsage>>;
  
  /** Cleanup expired or old data */
  cleanup(): Promise<StorageResult<void>>;
  
  /** Close storage connection */
  close(): Promise<StorageResult<void>>;
}

// Type exports for convenience
export type StorageAdapter<T = any> = IStorageAdapter<T>;
