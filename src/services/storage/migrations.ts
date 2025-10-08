/**
 * Database migration utilities and version management
 *
 * This module provides utilities for managing database schema migrations,
 * version upgrades, and backward compatibility handling for the NoteumDB.
 *
 * @fileoverview Database migration management
 * @module storage/migrations
 */

import { NoteumDB } from './database';
import { SCHEMA_CONSTANTS, SchemaMigrationHelper } from './schema';
import type { DatabaseRecord } from './schema';

/**
 * Migration function interface
 */
export interface MigrationFunction {
  /** Migration name */
  name: string;
  /** Migration description */
  description: string;
  /** Source version */
  fromVersion: number;
  /** Target version */
  toVersion: number;
  /** Migration function */
  migrate: (db: NoteumDB) => Promise<void>;
  /** Rollback function (optional) */
  rollback?: (db: NoteumDB) => Promise<void>;
}

/**
 * Migration result interface
 */
export interface MigrationResult {
  /** Success status */
  success: boolean;
  /** Migration name */
  migrationName: string;
  /** Source version */
  fromVersion: number;
  /** Target version */
  toVersion: number;
  /** Migration duration in milliseconds */
  duration: number;
  /** Error message if failed */
  error?: string;
  /** Number of records affected */
  recordsAffected?: number;
}

/**
 * Migration plan interface
 */
export interface MigrationPlan {
  /** Current database version */
  currentVersion: number;
  /** Target version */
  targetVersion: number;
  /** List of migrations to execute */
  migrations: MigrationFunction[];
  /** Estimated duration */
  estimatedDuration: number;
  /** Whether backup is recommended */
  backupRecommended: boolean;
}

/**
 * Database backup interface
 */
export interface DatabaseBackup {
  /** Backup timestamp */
  timestamp: Date;
  /** Database version at backup time */
  version: number;
  /** Backup data by table */
  data: Record<string, DatabaseRecord[]>;
  /** Backup metadata */
  metadata: {
    totalRecords: number;
    size: number;
    tables: string[];
  };
}

/**
 * Migration registry class to manage all available migrations
 */
export class MigrationRegistry {
  private migrations: Map<string, MigrationFunction> = new Map();
  private versionMigrations: Map<number, MigrationFunction[]> = new Map();

  /**
   * Register a migration function
   */
  register(migration: MigrationFunction): void {
    // Validate migration
    if (!migration.name || !migration.migrate) {
      throw new Error(
        'Invalid migration: name and migrate function are required'
      );
    }

    if (migration.fromVersion >= migration.toVersion) {
      throw new Error(
        'Invalid migration: toVersion must be greater than fromVersion'
      );
    }

    // Check for duplicate migrations
    if (this.migrations.has(migration.name)) {
      throw new Error(`Migration '${migration.name}' is already registered`);
    }

    // Register migration
    this.migrations.set(migration.name, migration);

    // Index by version
    if (!this.versionMigrations.has(migration.fromVersion)) {
      this.versionMigrations.set(migration.fromVersion, []);
    }
    this.versionMigrations.get(migration.fromVersion)!.push(migration);
  }

  /**
   * Get migration by name
   */
  getMigration(name: string): MigrationFunction | undefined {
    return this.migrations.get(name);
  }

  /**
   * Get migrations for a specific version
   */
  getMigrationsFromVersion(version: number): MigrationFunction[] {
    return this.versionMigrations.get(version) || [];
  }

  /**
   * Get all registered migrations
   */
  getAllMigrations(): MigrationFunction[] {
    return Array.from(this.migrations.values());
  }

  /**
   * Check if migration exists
   */
  hasMigration(name: string): boolean {
    return this.migrations.has(name);
  }

  /**
   * Clear all migrations (for testing)
   */
  clear(): void {
    this.migrations.clear();
    this.versionMigrations.clear();
  }
}

/**
 * Database migration manager
 */
export class DatabaseMigrator {
  private db: NoteumDB;
  private registry: MigrationRegistry;
  private backups: DatabaseBackup[] = [];

  constructor(db: NoteumDB, registry: MigrationRegistry) {
    this.db = db;
    this.registry = registry;
  }

  /**
   * Get current database version
   */
  async getCurrentVersion(): Promise<number> {
    try {
      // Try to get version from metadata
      const versionRecord = await this.db.metadata.get('db_version');
      if (versionRecord && typeof versionRecord.value === 'number') {
        return versionRecord.value;
      }

      // Fallback to schema constant
      return SCHEMA_CONSTANTS.CURRENT_VERSION;
    } catch (error) {
      console.warn(
        '[DatabaseMigrator] Could not get current version, using default:',
        error
      );
      return SCHEMA_CONSTANTS.CURRENT_VERSION;
    }
  }

  /**
   * Create migration plan
   */
  async createMigrationPlan(targetVersion?: number): Promise<MigrationPlan> {
    const currentVersion = await this.getCurrentVersion();
    const target = targetVersion || SCHEMA_CONSTANTS.CURRENT_VERSION;

    const plan: MigrationPlan = {
      currentVersion,
      targetVersion: target,
      migrations: [],
      estimatedDuration: 0,
      backupRecommended: false,
    };

    if (currentVersion === target) {
      return plan; // No migrations needed
    }

    if (currentVersion > target) {
      throw new Error('Downgrade migrations are not supported');
    }

    // Find migration path
    const migrationPath = SchemaMigrationHelper.getMigrationPath(
      currentVersion,
      target
    );

    for (const version of migrationPath) {
      const versionMigrations = this.registry.getMigrationsFromVersion(
        version - 1
      );
      const targetMigration = versionMigrations.find(
        m => m.toVersion === version
      );

      if (targetMigration) {
        plan.migrations.push(targetMigration);
        plan.estimatedDuration += 1000; // Estimate 1 second per migration
      }
    }

    // Recommend backup for major version changes
    plan.backupRecommended = plan.migrations.length > 0;

    return plan;
  }

  /**
   * Execute migration plan
   */
  async executeMigrationPlan(
    plan: MigrationPlan,
    createBackup = true
  ): Promise<MigrationResult[]> {
    const results: MigrationResult[] = [];

    // Create backup if recommended and requested
    if (createBackup && plan.backupRecommended) {
      await this.createBackup();
    }

    // Execute migrations in sequence
    for (const migration of plan.migrations) {
      const result = await this.executeMigration(migration);
      results.push(result);

      // Stop on first failure
      if (!result.success) {
        break;
      }
    }

    return results;
  }

  /**
   * Execute a single migration
   */
  async executeMigration(
    migration: MigrationFunction
  ): Promise<MigrationResult> {
    const startTime = Date.now();
    const result: MigrationResult = {
      success: false,
      migrationName: migration.name,
      fromVersion: migration.fromVersion,
      toVersion: migration.toVersion,
      duration: 0,
    };

    try {
      console.log(`[DatabaseMigrator] Executing migration: ${migration.name}`);

      // Execute the migration
      await migration.migrate(this.db);

      // Update version in metadata
      await this.updateDatabaseVersion(migration.toVersion);

      result.success = true;
      result.duration = Date.now() - startTime;

      console.log(
        `[DatabaseMigrator] Migration completed: ${migration.name} (${result.duration}ms)`
      );
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      result.duration = Date.now() - startTime;

      console.error(
        `[DatabaseMigrator] Migration failed: ${migration.name}`,
        error
      );

      // Attempt rollback if available
      if (migration.rollback) {
        try {
          console.log(
            `[DatabaseMigrator] Attempting rollback for: ${migration.name}`
          );
          await migration.rollback(this.db);
          console.log(
            `[DatabaseMigrator] Rollback completed for: ${migration.name}`
          );
        } catch (rollbackError) {
          console.error(
            `[DatabaseMigrator] Rollback failed for: ${migration.name}`,
            rollbackError
          );
        }
      }
    }

    return result;
  }

  /**
   * Create database backup
   */
  async createBackup(): Promise<DatabaseBackup> {
    const backup: DatabaseBackup = {
      timestamp: new Date(),
      version: await this.getCurrentVersion(),
      data: {},
      metadata: {
        totalRecords: 0,
        size: 0,
        tables: [],
      },
    };

    try {
      // Backup all tables
      const tables = [
        { name: 'tokens', table: this.db.tokens },
        { name: 'userPreferences', table: this.db.userPreferences },
        { name: 'appSettings', table: this.db.appSettings },
        { name: 'apiCache', table: this.db.apiCache },
        { name: 'metadata', table: this.db.metadata },
      ];

      for (const { name, table } of tables) {
        const data = await table.toArray();
        backup.data[name] = data;
        backup.metadata.totalRecords += data.length;
        backup.metadata.tables.push(name);
      }

      // Estimate backup size
      backup.metadata.size = JSON.stringify(backup.data).length;

      // Store backup
      this.backups.push(backup);

      // Keep only last 5 backups
      if (this.backups.length > 5) {
        this.backups = this.backups.slice(-5);
      }

      console.log(
        `[DatabaseMigrator] Backup created: ${backup.metadata.totalRecords} records`
      );
    } catch (error) {
      console.error('[DatabaseMigrator] Failed to create backup:', error);
      throw error;
    }

    return backup;
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(backup: DatabaseBackup): Promise<void> {
    try {
      console.log('[DatabaseMigrator] Starting database restore...');

      // Clear existing data
      await this.db.transaction(
        'rw',
        this.db.tokens,
        this.db.userPreferences,
        this.db.appSettings,
        this.db.apiCache,
        this.db.metadata,
        async () => {
          await this.db.tokens.clear();
          await this.db.userPreferences.clear();
          await this.db.appSettings.clear();
          await this.db.apiCache.clear();
          await this.db.metadata.clear();
        }
      );

      // Restore data
      const tableMap = {
        tokens: this.db.tokens,
        userPreferences: this.db.userPreferences,
        appSettings: this.db.appSettings,
        apiCache: this.db.apiCache,
        metadata: this.db.metadata,
      };

      for (const [tableName, data] of Object.entries(backup.data)) {
        const table = tableMap[tableName as keyof typeof tableMap];
        if (table && data.length > 0) {
          await table.bulkAdd(data);
        }
      }

      // Update version
      await this.updateDatabaseVersion(backup.version);

      console.log(
        `[DatabaseMigrator] Restore completed: ${backup.metadata.totalRecords} records`
      );
    } catch (error) {
      console.error('[DatabaseMigrator] Failed to restore backup:', error);
      throw error;
    }
  }

  /**
   * Get available backups
   */
  getBackups(): DatabaseBackup[] {
    return [...this.backups];
  }

  /**
   * Update database version in metadata
   */
  private async updateDatabaseVersion(version: number): Promise<void> {
    await this.db.metadata.put({
      key: 'db_version',
      value: version,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: 'system',
    });
  }
}

/**
 * Default migration registry instance
 */
export const defaultMigrationRegistry = new MigrationRegistry();

/**
 * Initialize default migrations
 */
function initializeDefaultMigrations(): void {
  // Initial schema migration (placeholder for future migrations)
  defaultMigrationRegistry.register({
    name: 'initial_schema',
    description: 'Initialize database schema',
    fromVersion: 0,
    toVersion: 1,
    migrate: async (db: NoteumDB) => {
      // Initial schema is already handled by Dexie version management
      console.log('[Migration] Initial schema migration completed');
    },
  });
}

// Initialize default migrations
initializeDefaultMigrations();

/**
 * Create migration helper for a database instance
 */
export function createMigrator(
  db: NoteumDB,
  registry = defaultMigrationRegistry
): DatabaseMigrator {
  return new DatabaseMigrator(db, registry);
}

/**
 * Utility function to check if migration is needed
 */
export async function isMigrationNeeded(db: NoteumDB): Promise<boolean> {
  const migrator = createMigrator(db);
  const currentVersion = await migrator.getCurrentVersion();
  return SchemaMigrationHelper.requiresMigration(
    currentVersion,
    SCHEMA_CONSTANTS.CURRENT_VERSION
  );
}

/**
 * Utility function to auto-migrate database
 */
export async function autoMigrate(
  db: NoteumDB,
  createBackup = true
): Promise<MigrationResult[]> {
  const migrator = createMigrator(db);
  const plan = await migrator.createMigrationPlan();

  if (plan.migrations.length === 0) {
    return []; // No migrations needed
  }

  return await migrator.executeMigrationPlan(plan, createBackup);
}

export { MigrationRegistry, DatabaseMigrator };
