/**
 * NoteumDB - Dexie-based IndexedDB database implementation
 * 
 * This module implements the core database class using Dexie.js for IndexedDB
 * operations. It provides type-safe access to all storage tables with proper
 * initialization, error handling, and lifecycle management.
 * 
 * @fileoverview Core database implementation
 * @module storage/database
 */

import Dexie, { type Table } from 'dexie';
import type {
  TokenRecord,
  PreferenceRecord,
  SettingRecord,
  CacheRecord,
  MetaRecord,
} from './schema';
import { TableNames } from './schema';
import { NOTEUM_DB_SCHEMA, SCHEMA_CONSTANTS } from './schema';

/**
 * Database initialization options
 */
export interface DatabaseOptions {
  /** Database name override */
  name?: string;
  /** Enable debug mode */
  debug?: boolean;
  /** Maximum retry attempts for operations */
  maxRetries?: number;
  /** Enable automatic cleanup */
  enableAutoCleanup?: boolean;
  /** Cleanup interval in milliseconds */
  cleanupInterval?: number;
}

/**
 * Database statistics interface
 */
export interface DatabaseStats {
  /** Database size in bytes */
  size: number;
  /** Number of records per table */
  recordCount: Record<string, number>;
  /** Database version */
  version: number;
  /** Database name */
  name: string;
  /** Last accessed timestamp */
  lastAccessed: Date;
}

/**
 * Database cleanup options
 */
export interface CleanupOptions {
  /** Remove expired tokens */
  expiredTokens?: boolean;
  /** Remove expired cache entries */
  expiredCache?: boolean;
  /** Maximum age for cache entries (in hours) */
  maxCacheAge?: number;
  /** Remove unused preferences */
  unusedPreferences?: boolean;
  /** Dry run mode (don't actually delete) */
  dryRun?: boolean;
}

/**
 * Database cleanup result
 */
export interface CleanupResult {
  /** Number of records removed */
  recordsRemoved: number;
  /** Breakdown by table */
  breakdown: Record<string, number>;
  /** Space freed in bytes */
  spaceFreed: number;
  /** Cleanup duration in milliseconds */
  duration: number;
}

/**
 * NoteumDB - Main database class extending Dexie
 * 
 * Provides type-safe access to all storage tables with proper initialization,
 * error handling, and lifecycle management.
 */
export class NoteumDB extends Dexie {
  // Table definitions with proper typing
  public tokens!: Table<TokenRecord, string>;
  public userPreferences!: Table<PreferenceRecord, string>;
  public appSettings!: Table<SettingRecord, string>;
  public apiCache!: Table<CacheRecord, string>;
  public metadata!: Table<MetaRecord, string>;

  private options: Required<DatabaseOptions>;
  private cleanupTimer?: NodeJS.Timeout;
  private initialized = false;

  constructor(options: DatabaseOptions = {}) {
    const dbName = options.name || SCHEMA_CONSTANTS.DATABASE_NAME;
    super(dbName);

    // Set default options
    this.options = {
      name: dbName,
      debug: options.debug ?? false,
      maxRetries: options.maxRetries ?? 3,
      enableAutoCleanup: options.enableAutoCleanup ?? true,
      cleanupInterval: options.cleanupInterval ?? SCHEMA_CONSTANTS.CLEANUP_INTERVAL_MS,
    };

    // Define schema
    this.version(SCHEMA_CONSTANTS.CURRENT_VERSION).stores({
      [TableNames.TOKENS]: NOTEUM_DB_SCHEMA.tables[TableNames.TOKENS],
      [TableNames.USER_PREFERENCES]: NOTEUM_DB_SCHEMA.tables[TableNames.USER_PREFERENCES],
      [TableNames.APP_SETTINGS]: NOTEUM_DB_SCHEMA.tables[TableNames.APP_SETTINGS],
      [TableNames.API_CACHE]: NOTEUM_DB_SCHEMA.tables[TableNames.API_CACHE],
      [TableNames.METADATA]: NOTEUM_DB_SCHEMA.tables[TableNames.METADATA],
    });

    // Set up hooks 
    this.setupHooks();
    
    // Event handlers will be set up during initialization
  }

  /**
   * Initialize the database and start cleanup timer
   */
  async initialize(): Promise<void> {
    try {
      if (this.initialized) {
        return;
      }

      // Open the database
      await this.open();

      // Set up event handlers after database is open (only in production)
      if (!this.options.debug) {
        this.setupEventHandlers();
      }

      // Verify database structure
      await this.verifySchema();

      // Set up automatic cleanup
      if (this.options.enableAutoCleanup) {
        this.startAutoCleanup();
      }

      // Update metadata
      await this.updateMetadata('db_initialized', {
        timestamp: new Date(),
        version: SCHEMA_CONSTANTS.CURRENT_VERSION,
      });

      this.initialized = true;

      if (this.options.debug) {
        console.log('[NoteumDB] Database initialized successfully');
      }
    } catch (error) {
      console.error('[NoteumDB] Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Close the database and cleanup resources
   */
  async close(): Promise<void> {
    try {
      // Stop cleanup timer
      if (this.cleanupTimer) {
        clearInterval(this.cleanupTimer);
        this.cleanupTimer = undefined;
      }

      // Update metadata
      if (this.initialized) {
        await this.updateMetadata('db_closed', {
          timestamp: new Date(),
        });
      }

      // Close database connection
      await super.close();
      this.initialized = false;

      if (this.options.debug) {
        console.log('[NoteumDB] Database closed successfully');
      }
    } catch (error) {
      console.error('[NoteumDB] Error closing database:', error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<DatabaseStats> {
    const stats: DatabaseStats = {
      size: 0,
      recordCount: {},
      version: SCHEMA_CONSTANTS.CURRENT_VERSION,
      name: this.name,
      lastAccessed: new Date(),
    };

    try {
      // Get record counts for each table
      stats.recordCount.tokens = await this.tokens.count();
      stats.recordCount.userPreferences = await this.userPreferences.count();
      stats.recordCount.appSettings = await this.appSettings.count();
      stats.recordCount.apiCache = await this.apiCache.count();
      stats.recordCount.metadata = await this.metadata.count();

      // Estimate size (rough calculation)
      const sampleSize = 10;
      let estimatedSize = 0;

      for (const tableName of SCHEMA_CONSTANTS.TABLE_NAMES) {
        const table = this[tableName as keyof this] as Table<any, string>;
        const sample = await table.limit(sampleSize).toArray();
        if (sample.length > 0) {
          const avgRecordSize = JSON.stringify(sample).length / sample.length;
          estimatedSize += avgRecordSize * stats.recordCount[tableName];
        }
      }

      stats.size = estimatedSize;
    } catch (error) {
      console.error('[NoteumDB] Error getting stats:', error);
    }

    return stats;
  }

  /**
   * Perform database cleanup
   */
  async cleanup(options: CleanupOptions = {}): Promise<CleanupResult> {
    const startTime = Date.now();
    const result: CleanupResult = {
      recordsRemoved: 0,
      breakdown: {},
      spaceFreed: 0,
      duration: 0,
    };

    try {
      const sizeBefore = (await this.getStats()).size;

      // Clean expired tokens
      if (options.expiredTokens !== false) {
        const expiredTokensCount = await this.cleanExpiredTokens(options.dryRun);
        result.breakdown.tokens = expiredTokensCount;
        result.recordsRemoved += expiredTokensCount;
      }

      // Clean expired cache entries
      if (options.expiredCache !== false) {
        const expiredCacheCount = await this.cleanExpiredCache(
          options.maxCacheAge || SCHEMA_CONSTANTS.DEFAULT_EXPIRY_HOURS,
          options.dryRun
        );
        result.breakdown.apiCache = expiredCacheCount;
        result.recordsRemoved += expiredCacheCount;
      }

      // Calculate space freed
      if (!options.dryRun) {
        const sizeAfter = (await this.getStats()).size;
        result.spaceFreed = sizeBefore - sizeAfter;
      }

      result.duration = Date.now() - startTime;

      if (this.options.debug) {
        console.log('[NoteumDB] Cleanup completed:', result);
      }
    } catch (error) {
      console.error('[NoteumDB] Error during cleanup:', error);
      throw error;
    }

    return result;
  }

  /**
   * Clean expired tokens
   */
  private async cleanExpiredTokens(dryRun = false): Promise<number> {
    try {
      const expiredTokens = await this.tokens
        .where('expiredAt')
        .below(new Date())
        .toArray();

      if (!dryRun && expiredTokens.length > 0) {
        await this.tokens
          .where('expiredAt')
          .below(new Date())
          .delete();
      }

      return expiredTokens.length;
    } catch (error) {
      console.error('[NoteumDB] Error cleaning expired tokens:', error);
      return 0;
    }
  }

  /**
   * Clean expired cache entries
   */
  private async cleanExpiredCache(maxAgeHours: number, dryRun = false): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
      
      const expiredCache = await this.apiCache
        .where('expiredAt')
        .below(new Date())
        .or('updatedAt')
        .below(cutoffDate)
        .toArray();

      if (!dryRun && expiredCache.length > 0) {
        await this.apiCache
          .where('expiredAt')
          .below(new Date())
          .or('updatedAt')
          .below(cutoffDate)
          .delete();
      }

      return expiredCache.length;
    } catch (error) {
      console.error('[NoteumDB] Error cleaning expired cache:', error);
      return 0;
    }
  }

  /**
   * Update metadata record
   */
  private async updateMetadata(key: string, value: any): Promise<void> {
    try {
      await this.metadata.put({
        key,
        value,
        updatedAt: new Date(),
        type: 'system',
      });
    } catch (error) {
      console.error('[NoteumDB] Error updating metadata:', error);
    }
  }

  /**
   * Verify database schema integrity
   */
  private async verifySchema(): Promise<void> {
    try {
      // Check if all required tables exist
      const tables = await this.tables;
      const requiredTables = SCHEMA_CONSTANTS.TABLE_NAMES;

      for (const tableName of requiredTables) {
        if (!tables.some(table => table.name === tableName)) {
          throw new Error(`Required table '${tableName}' not found`);
        }
      }

      if (this.options.debug) {
        console.log('[NoteumDB] Schema verification completed');
      }
    } catch (error) {
      console.error('[NoteumDB] Schema verification failed:', error);
      throw error;
    }
  }

  /**
   * Set up database hooks
   */
  private setupHooks(): void {
    // Add timestamp hooks for records that need updatedAt
    this.userPreferences.hook('creating', (primKey, obj, trans) => {
      obj.updatedAt = new Date();
    });

    this.userPreferences.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updatedAt = new Date();
    });

    this.appSettings.hook('creating', (primKey, obj, trans) => {
      obj.updatedAt = new Date();
    });

    this.appSettings.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updatedAt = new Date();
    });

    this.apiCache.hook('creating', (primKey, obj, trans) => {
      obj.updatedAt = new Date();
    });

    this.apiCache.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updatedAt = new Date();
    });

    this.metadata.hook('creating', (primKey, obj, trans) => {
      obj.updatedAt = new Date();
    });

    this.metadata.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updatedAt = new Date();
    });

    // Add timestamp for tokens
    this.tokens.hook('creating', (primKey, obj, trans) => {
      if (!obj.createdAt) {
        obj.createdAt = new Date();
      }
    });
  }

  /**
   * Set up event handlers
   */
  private setupEventHandlers(): void {
    this.on('error', (error) => {
      console.error('[NoteumDB] Database error:', error);
    });

    this.on('blocked', () => {
      console.warn('[NoteumDB] Database blocked - another instance may be running');
    });

    this.on('versionchange', () => {
      console.log('[NoteumDB] Database version changed');
    });
  }

  /**
   * Start automatic cleanup timer
   */
  private startAutoCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(async () => {
      try {
        await this.cleanup();
      } catch (error) {
        console.error('[NoteumDB] Automatic cleanup failed:', error);
      }
    }, this.options.cleanupInterval);
  }

  /**
   * Check if database is ready
   */
  isReady(): boolean {
    return this.initialized && this.isOpen();
  }

  /**
   * Get database name
   */
  getDatabaseName(): string {
    return this.name;
  }

  /**
   * Get database version
   */
  getDatabaseVersion(): number {
    return SCHEMA_CONSTANTS.CURRENT_VERSION;
  }
}

/**
 * Default database instance
 */
let defaultInstance: NoteumDB | null = null;

/**
 * Get the default database instance
 */
export function getDatabase(options?: DatabaseOptions): NoteumDB {
  if (!defaultInstance) {
    defaultInstance = new NoteumDB(options);
  }
  return defaultInstance;
}

/**
 * Initialize the default database instance
 */
export async function initializeDatabase(options?: DatabaseOptions): Promise<NoteumDB> {
  const db = getDatabase(options);
  await db.initialize();
  return db;
}

/**
 * Close the default database instance
 */
export async function closeDatabase(): Promise<void> {
  if (defaultInstance) {
    await defaultInstance.close();
    defaultInstance = null;
  }
}

export default NoteumDB;