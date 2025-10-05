/**
 * Core TypeScript type definitions for storage services
 * 
 * This module defines all TypeScript types used throughout the storage system,
 * including data models, table schemas, and runtime type definitions for Dexie.js.
 * 
 * @fileoverview Core type definitions for storage services
 * @module storage/types
 */

import type { 
  StorageConfig,
  StorageResult,
  StorageError,
  StorageMetadata,
  StorageChange,
  StorageChangeCallback 
} from './interfaces';

// =================== Dexie Database Schema Types ===================

/**
 * Base record interface for all stored data
 */
export interface BaseRecord {
  /** Primary key for the record */
  key: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Token storage record for authentication tokens
 */
export interface TokenRecord extends BaseRecord {
  /** Token value */
  value: string;
  /** Token expiration date */
  expiredAt?: Date;
  /** Token type (access_token, refresh_token, etc.) */
  type?: string;
  /** Associated user ID */
  userId?: string;
}

/**
 * User preference record
 */
export interface PreferenceRecord extends BaseRecord {
  /** Preference value (can be any JSON-serializable data) */
  value: unknown;
  /** User ID this preference belongs to */
  userId: string;
  /** Preference category for grouping */
  category: string;
  /** Whether this preference should sync across devices */
  syncable?: boolean;
}

/**
 * Application setting record
 */
export interface SettingRecord extends BaseRecord {
  /** Setting value (can be any JSON-serializable data) */
  value: unknown;
  /** Setting scope (global, user, session) */
  scope: 'global' | 'user' | 'session';
  /** Whether this setting is read-only */
  readonly?: boolean;
  /** Setting description for admin interface */
  description?: string;
}

/**
 * API cache record for storing API responses
 */
export interface CacheRecord extends BaseRecord {
  /** Cached value */
  value: unknown;
  /** Cache expiration date */
  expiredAt: Date;
  /** API endpoint URL that was cached */
  endpoint: string;
  /** HTTP method used */
  method: string;
  /** Request parameters hash for cache key generation */
  paramsHash?: string;
  /** Cache size in bytes */
  size?: number;
}

/**
 * Metadata record for storing system metadata
 */
export interface MetaRecord extends BaseRecord {
  /** Metadata value */
  value: unknown;
  /** Metadata type for categorization */
  type: string;
  /** Version information */
  version?: string;
  /** Additional tags for searching */
  tags?: string[];
}

/**
 * Form draft record for auto-save functionality
 */
export interface FormDraftRecord extends BaseRecord {
  /** Form data as JSON */
  formData: Record<string, unknown>;
  /** Form type identifier */
  formType: string;
  /** User ID who owns this draft */
  userId: string;
  /** Last modification timestamp */
  lastModified: Date;
  /** Form schema version for migration */
  schemaVersion?: number;
  /** Draft title or description */
  title?: string;
}

/**
 * Offline data record for storing data when offline
 */
export interface OfflineDataRecord {
  /** Auto-generated ID */
  id?: number;
  /** Data type identifier */
  type: string;
  /** Stored data */
  data: unknown;
  /** Sync status */
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
  /** Creation timestamp */
  timestamp: Date;
  /** Associated user ID */
  userId?: string;
  /** Retry count for failed syncs */
  retryCount?: number;
  /** Last sync attempt timestamp */
  lastSyncAttempt?: Date;
  /** Error message if sync failed */
  syncError?: string;
}

// =================== Storage Operation Types ===================

/**
 * Storage operation result with typed data
 */
export interface TypedStorageResult<T = unknown> extends StorageResult<T> {
  /** Typed data payload */
  data?: T;
}

/**
 * Batch operation with typed value
 */
export interface TypedBatchOperation<T = unknown> {
  /** Operation type */
  type: 'set' | 'remove' | 'clear';
  /** Key for the operation */
  key?: string;
  /** Typed value for set operations */
  value?: T;
}

/**
 * Storage query with typed result
 */
export interface TypedStorageQuery<T = unknown> {
  /** Key pattern or exact key */
  key?: string | RegExp;
  /** Value filters with type safety */
  where?: Partial<T>;
  /** Sort configuration */
  orderBy?: keyof T | string;
  /** Limit results */
  limit?: number;
  /** Skip results */
  offset?: number;
  /** Index to use for query optimization */
  index?: string;
}

// =================== Storage Service Core Types ===================

/**
 * Enhanced storage service interface with type safety
 */
export interface StorageService {
  // Basic CRUD operations
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  
  // Batch operations  
  getBatch<T = unknown>(keys: string[]): Promise<Record<string, T>>;
  setBatch<T = unknown>(data: Record<string, T>): Promise<void>;
  
  // Advanced functionality
  exists(key: string): Promise<boolean>;
  keys(): Promise<string[]>;
  size(): Promise<number>;
  
  // Event listening
  onChange<T = unknown>(callback: StorageChangeCallback<T>): () => void;
  
  // Advanced query capabilities
  query<T = unknown>(filter: TypedStorageQuery<T>): Promise<T[]>;
  
  // Storage management
  getUsage(): Promise<{ used: number; available: number; percentage: number }>;
  cleanup(): Promise<void>;
  
  // Transaction support
  transaction<R>(callback: (service: StorageService) => Promise<R>): Promise<R>;
}

// =================== Storage Change Event Types ===================

/**
 * Detailed storage change event
 */
export interface StorageChangeEvent<T = unknown> extends StorageChange<T> {
  /** Storage adapter that triggered the change */
  source: 'indexeddb' | 'localstorage' | 'memory';
  /** Transaction ID if part of a transaction */
  transactionId?: string;
  /** Additional metadata about the change */
  metadata?: {
    /** Operation that caused the change */
    operation: 'set' | 'remove' | 'clear' | 'batch';
    /** Duration of the operation in milliseconds */
    duration?: number;
    /** Size of the data in bytes */
    dataSize?: number;
  };
}

/**
 * Storage event listener type
 */
export type StorageEventListener<T = unknown> = (event: StorageChangeEvent<T>) => void;

/**
 * Storage event types
 */
export type StorageEventType = 
  | 'change'
  | 'error'
  | 'quota-exceeded'
  | 'connection-lost'
  | 'connection-restored';

// =================== Error Handling Types ===================

/**
 * Specialized storage error types
 */
export interface StorageOperationError extends StorageError {
  /** Operation that failed */
  operation: 'get' | 'set' | 'remove' | 'clear' | 'batch' | 'query' | 'transaction';
  /** Key(s) involved in the operation */
  keys?: string[];
  /** Retry information */
  retryable?: boolean;
  /** Suggested retry delay in milliseconds */
  retryDelay?: number;
}

/**
 * Database connection error
 */
export interface DatabaseConnectionError extends StorageError {
  /** Database name */
  databaseName: string;
  /** Database version */
  version: number;
  /** Connection state */
  connectionState: 'connecting' | 'failed' | 'closed';
}

/**
 * Quota exceeded error
 */
export interface QuotaExceededError extends StorageError {
  /** Current storage usage in bytes */
  currentUsage: number;
  /** Available quota in bytes */
  availableQuota: number;
  /** Requested size in bytes */
  requestedSize: number;
}

// =================== Configuration Types ===================

/**
 * Type-safe storage configuration
 */
export interface TypedStorageConfig extends StorageConfig {
  /** Type mappings for validation */
  typeMapping?: Record<string, 'string' | 'number' | 'boolean' | 'object' | 'array'>;
  /** Custom serializers for specific types */
  serializers?: Record<string, {
    serialize: (value: unknown) => string;
    deserialize: (value: string) => unknown;
  }>;
  /** Validation rules */
  validation?: {
    /** Maximum key length */
    maxKeyLength?: number;
    /** Maximum value size in bytes */
    maxValueSize?: number;
    /** Required key patterns */
    keyPattern?: RegExp;
  };
}

// =================== Migration Types ===================

/**
 * Database migration interface
 */
export interface DatabaseMigration {
  /** Migration version */
  version: number;
  /** Migration description */
  description: string;
  /** Migration function */
  migrate: (db: any) => Promise<void>;
  /** Rollback function */
  rollback?: (db: any) => Promise<void>;
}

/**
 * Migration result
 */
export interface MigrationResult {
  /** Success status */
  success: boolean;
  /** Version migrated from */
  fromVersion: number;
  /** Version migrated to */
  toVersion: number;
  /** Migration duration in milliseconds */
  duration: number;
  /** Any errors that occurred */
  errors?: string[];
}

// =================== Utility Types ===================

/**
 * Extract record type from table name
 */
export type RecordTypeMap = {
  'tokens': TokenRecord;
  'userPreferences': PreferenceRecord;
  'appSettings': SettingRecord;
  'apiCache': CacheRecord;
  'metadata': MetaRecord;
  'formDrafts': FormDraftRecord;
  'offlineData': OfflineDataRecord;
};

/**
 * Get record type by table name
 */
export type GetRecordType<T extends keyof RecordTypeMap> = RecordTypeMap[T];

/**
 * Union of all record types
 */
export type AnyRecord = RecordTypeMap[keyof RecordTypeMap];

/**
 * Storage adapter type union
 */
export type StorageAdapterType = 'indexeddb' | 'localstorage' | 'memory';

/**
 * Storage operation status
 */
export type StorageOperationStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

/**
 * Key-value pair type
 */
export type KeyValuePair<T = unknown> = {
  key: string;
  value: T;
};

/**
 * Storage statistics
 */
export interface StorageStats {
  /** Total records count */
  totalRecords: number;
  /** Storage size in bytes */
  storageSize: number;
  /** Records by type */
  recordsByType: Record<string, number>;
  /** Last cleanup timestamp */
  lastCleanup?: Date;
  /** Average operation time in milliseconds */
  averageOperationTime?: number;
}
