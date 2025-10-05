/**
 * Database schema definitions for Noteum storage system
 * 
 * This module defines all database table schemas, interfaces, and type definitions
 * for the Dexie-based IndexedDB storage implementation.
 * 
 * @fileoverview Database schema definitions
 * @module storage/schema
 */

/**
 * Token record interface for authentication tokens storage
 */
export interface TokenRecord {
  /** Unique key identifier for the token */
  key: string;
  /** Token value (encrypted/encoded) */
  value: string;
  /** Token expiration timestamp */
  expiredAt?: Date;
  /** Token creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** Token type (access, refresh, etc.) */
  type?: string;
  /** Associated user ID */
  userId?: string;
}

/**
 * User preference record interface
 */
export interface PreferenceRecord {
  /** Preference key identifier */
  key: string;
  /** Preference value (can be any serializable type) */
  value: any;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** Associated user ID */
  userId?: string;
  /** Preference category for organization */
  category?: string;
  /** Whether preference is user-specific or global */
  isGlobal?: boolean;
}

/**
 * Application settings record interface
 */
export interface SettingRecord {
  /** Setting key identifier */
  key: string;
  /** Setting value (can be any serializable type) */
  value: any;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** Setting scope (global, user, session) */
  scope?: 'global' | 'user' | 'session';
  /** Setting description */
  description?: string;
  /** Whether setting requires restart to take effect */
  requiresRestart?: boolean;
}

/**
 * API cache record interface
 */
export interface CacheRecord {
  /** Cache key identifier */
  key: string;
  /** Cached data value */
  value: any;
  /** Cache expiration timestamp */
  expiredAt?: Date;
  /** Creation timestamp */
  createdAt: Date;
  /** Cache creation/update timestamp */
  updatedAt: Date;
  /** Cache entry size in bytes */
  size?: number;
  /** Cache hit count */
  hitCount?: number;
  /** API endpoint or source identifier */
  source?: string;
  /** Cache entry tags for categorization */
  tags?: string[];
}

/**
 * Metadata record interface for system metadata
 */
export interface MetaRecord {
  /** Metadata key identifier */
  key: string;
  /** Metadata value */
  value: any;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** Metadata type */
  type?: 'system' | 'user' | 'app' | 'debug';
  /** Metadata version */
  version?: string;
  /** Whether metadata is read-only */
  readonly?: boolean;
}

/**
 * Database schema version information
 */
export interface SchemaVersion {
  /** Schema version number */
  version: number;
  /** Version description */
  description: string;
  /** Migration required flag */
  requiresMigration: boolean;
  /** Version release date */
  releaseDate: Date;
}

/**
 * Database table names enum for type safety
 */
export enum TableNames {
  TOKENS = 'tokens',
  USER_PREFERENCES = 'userPreferences',
  APP_SETTINGS = 'appSettings',
  API_CACHE = 'apiCache',
  METADATA = 'metadata',
}

/**
 * Database schema configuration
 */
export interface DatabaseSchema {
  /** Database name */
  name: string;
  /** Schema version */
  version: number;
  /** Table definitions */
  tables: {
    [TableNames.TOKENS]: string;
    [TableNames.USER_PREFERENCES]: string;
    [TableNames.APP_SETTINGS]: string;
    [TableNames.API_CACHE]: string;
    [TableNames.METADATA]: string;
  };
}

/**
 * Current database schema configuration
 */
export const NOTEUM_DB_SCHEMA: DatabaseSchema = {
  name: 'NoteumDB',
  version: 1,
  tables: {
    [TableNames.TOKENS]: 'key, value, expiredAt, createdAt, type, userId',
    [TableNames.USER_PREFERENCES]: 'key, value, updatedAt, userId, category, isGlobal',
    [TableNames.APP_SETTINGS]: 'key, value, updatedAt, scope, description, requiresRestart',
    [TableNames.API_CACHE]: 'key, value, expiredAt, updatedAt, size, hitCount, source, tags',
    [TableNames.METADATA]: 'key, value, updatedAt, type, version, readonly',
  },
};

/**
 * Index definitions for optimized queries
 */
export const INDEX_DEFINITIONS = {
  [TableNames.TOKENS]: [
    'expiredAt',
    'createdAt', 
    'type',
    'userId',
    '[userId+type]',
  ],
  [TableNames.USER_PREFERENCES]: [
    'updatedAt',
    'userId',
    'category',
    'isGlobal',
    '[userId+category]',
  ],
  [TableNames.APP_SETTINGS]: [
    'updatedAt',
    'scope',
    'requiresRestart',
  ],
  [TableNames.API_CACHE]: [
    'expiredAt',
    'updatedAt',
    'source',
    'hitCount',
    'tags',
    '[source+updatedAt]',
  ],
  [TableNames.METADATA]: [
    'updatedAt',
    'type',
    'version',
    'readonly',
  ],
} as const;

/**
 * Schema validation utilities
 */
export class SchemaValidator {
  /**
   * Validate token record structure
   */
  static validateTokenRecord(record: Partial<TokenRecord>): record is TokenRecord {
    return !!(
      record.key && 
      typeof record.key === 'string' &&
      record.value && 
      typeof record.value === 'string' &&
      record.createdAt instanceof Date
    );
  }

  /**
   * Validate preference record structure
   */
  static validatePreferenceRecord(record: Partial<PreferenceRecord>): record is PreferenceRecord {
    return !!(
      record.key && 
      typeof record.key === 'string' &&
      record.value !== undefined &&
      record.updatedAt instanceof Date
    );
  }

  /**
   * Validate setting record structure
   */
  static validateSettingRecord(record: Partial<SettingRecord>): record is SettingRecord {
    return !!(
      record.key && 
      typeof record.key === 'string' &&
      record.value !== undefined &&
      record.updatedAt instanceof Date
    );
  }

  /**
   * Validate cache record structure
   */
  static validateCacheRecord(record: Partial<CacheRecord>): record is CacheRecord {
    return !!(
      record.key && 
      typeof record.key === 'string' &&
      record.value !== undefined &&
      record.updatedAt instanceof Date
    );
  }

  /**
   * Validate metadata record structure
   */
  static validateMetaRecord(record: Partial<MetaRecord>): record is MetaRecord {
    return !!(
      record.key && 
      typeof record.key === 'string' &&
      record.value !== undefined &&
      record.updatedAt instanceof Date
    );
  }
}

/**
 * Schema migration utilities
 */
export class SchemaMigrationHelper {
  /**
   * Get migration path from current version to target version
   */
  static getMigrationPath(currentVersion: number, targetVersion: number): number[] {
    const path: number[] = [];
    for (let v = currentVersion + 1; v <= targetVersion; v++) {
      path.push(v);
    }
    return path;
  }

  /**
   * Check if migration is required
   */
  static requiresMigration(currentVersion: number, targetVersion: number): boolean {
    return currentVersion < targetVersion;
  }

  /**
   * Validate schema version compatibility
   */
  static isVersionCompatible(version: number): boolean {
    return version >= 1 && version <= NOTEUM_DB_SCHEMA.version;
  }
}

/**
 * Export all record types for convenience
 */
export type DatabaseRecord = 
  | TokenRecord 
  | PreferenceRecord 
  | SettingRecord 
  | CacheRecord 
  | MetaRecord;

/**
 * Type-safe table record mapping
 */
export type TableRecordMap = {
  [TableNames.TOKENS]: TokenRecord;
  [TableNames.USER_PREFERENCES]: PreferenceRecord;
  [TableNames.APP_SETTINGS]: SettingRecord;
  [TableNames.API_CACHE]: CacheRecord;
  [TableNames.METADATA]: MetaRecord;
};

/**
 * Schema constants for easy access
 */
export const SCHEMA_CONSTANTS = {
  DATABASE_NAME: NOTEUM_DB_SCHEMA.name,
  CURRENT_VERSION: NOTEUM_DB_SCHEMA.version,
  TABLE_NAMES: Object.values(TableNames),
  DEFAULT_EXPIRY_HOURS: 24,
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // 1 hour
} as const;