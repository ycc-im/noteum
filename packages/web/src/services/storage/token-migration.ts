/**
 * Token migration service for migrating localStorage tokens to IndexedDB
 * 
 * This service handles the migration of existing token data from localStorage
 * to the new IndexedDB-based storage system with enhanced security and features.
 * 
 * @fileoverview Token storage migration service
 * @module storage/token-migration
 */

import { TokenRecord, MigrationResult, StorageOperationError } from './types';
import { StorageService } from './interfaces';

/**
 * Migration status and progress tracking
 */
export interface MigrationStatus {
  /** Current migration phase */
  phase: 'detecting' | 'backing-up' | 'migrating' | 'validating' | 'cleaning' | 'completed' | 'failed';
  /** Overall progress percentage (0-100) */
  progress: number;
  /** Number of tokens detected for migration */
  totalTokens: number;
  /** Number of tokens successfully migrated */
  migratedTokens: number;
  /** Number of tokens that failed to migrate */
  failedTokens: number;
  /** Start time of migration */
  startTime: Date;
  /** End time of migration (if completed) */
  endTime?: Date;
  /** Any error messages */
  errors: string[];
  /** Detailed log of migration steps */
  log: MigrationLogEntry[];
}

/**
 * Migration log entry for tracking detailed progress
 */
export interface MigrationLogEntry {
  /** Timestamp of log entry */
  timestamp: Date;
  /** Log level */
  level: 'info' | 'warn' | 'error';
  /** Log message */
  message: string;
  /** Additional context data */
  context?: Record<string, any>;
}

/**
 * Token data found in localStorage
 */
export interface DetectedToken {
  /** localStorage key */
  key: string;
  /** Token value */
  value: string;
  /** Estimated token type based on key pattern */
  estimatedType: 'access' | 'refresh' | 'api' | 'unknown';
  /** Size in bytes */
  size: number;
  /** Whether value appears to be encrypted */
  isEncrypted: boolean;
}

/**
 * Migration configuration options
 */
export interface MigrationConfig {
  /** Whether to backup localStorage before migration */
  createBackup: boolean;
  /** Whether to clean up localStorage after successful migration */
  cleanupAfterMigration: boolean;
  /** Batch size for migration operations */
  batchSize: number;
  /** Maximum retry attempts for failed migrations */
  maxRetries: number;
  /** Delay between retry attempts in milliseconds */
  retryDelay: number;
  /** Custom key patterns for token detection */
  tokenKeyPatterns: RegExp[];
  /** Whether to validate migrated data */
  validateMigration: boolean;
  /** Whether to enable detailed logging */
  enableDetailedLogging: boolean;
}

/**
 * Default migration configuration
 */
const DEFAULT_MIGRATION_CONFIG: MigrationConfig = {
  createBackup: true,
  cleanupAfterMigration: true,
  batchSize: 10,
  maxRetries: 3,
  retryDelay: 1000,
  tokenKeyPatterns: [
    /^token$/i,
    /^access_token$/i,
    /^refresh_token$/i,
    /^api_token$/i,
    /^auth_token$/i,
    /.*token.*$/i,
    /^jwt$/i,
    /^bearer$/i,
    /^auth$/i,
    /^session$/i,
  ],
  validateMigration: true,
  enableDetailedLogging: true,
};

/**
 * Token migration service for localStorage to IndexedDB migration
 */
export class TokenMigrationService {
  private storageService: StorageService;
  private config: MigrationConfig;
  private status: MigrationStatus;
  private backupData: Record<string, string> = {};

  /**
   * Initialize migration service
   */
  constructor(storageService: StorageService, config?: Partial<MigrationConfig>) {
    this.storageService = storageService;
    this.config = { ...DEFAULT_MIGRATION_CONFIG, ...config };
    this.status = this.createInitialStatus();
  }

  /**
   * Create initial migration status
   */
  private createInitialStatus(): MigrationStatus {
    return {
      phase: 'detecting',
      progress: 0,
      totalTokens: 0,
      migratedTokens: 0,
      failedTokens: 0,
      startTime: new Date(),
      errors: [],
      log: [],
    };
  }

  /**
   * Detect existing tokens in localStorage
   */
  async detectExistingTokens(): Promise<DetectedToken[]> {
    this.log('info', 'Starting token detection in localStorage');
    this.updateStatus({ phase: 'detecting', progress: 10 });

    const detectedTokens: DetectedToken[] = [];

    try {
      // Scan localStorage for token-like keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        // Check if key matches any token patterns
        const isTokenKey = this.config.tokenKeyPatterns.some(pattern => 
          pattern.test(key)
        );

        if (isTokenKey) {
          const value = localStorage.getItem(key);
          if (value) {
            const detectedToken: DetectedToken = {
              key,
              value,
              estimatedType: this.estimateTokenType(key),
              size: new Blob([value]).size,
              isEncrypted: this.detectEncryption(value),
            };
            detectedTokens.push(detectedToken);
            this.log('info', `Detected token: ${key}`, { token: detectedToken });
          }
        }
      }

      this.updateStatus({ 
        totalTokens: detectedTokens.length,
        progress: 20 
      });

      this.log('info', `Detection completed. Found ${detectedTokens.length} tokens`);
      return detectedTokens;

    } catch (error) {
      const errorMessage = `Failed to detect tokens: ${error}`;
      this.log('error', errorMessage, { error });
      throw new StorageOperationError({
        code: 'DETECTION_FAILED',
        message: errorMessage,
        operation: 'get',
        originalError: error as Error,
      });
    }
  }

  /**
   * Estimate token type based on key pattern
   */
  private estimateTokenType(key: string): 'access' | 'refresh' | 'api' | 'unknown' {
    const lowerKey = key.toLowerCase();
    
    if (lowerKey.includes('access')) return 'access';
    if (lowerKey.includes('refresh')) return 'refresh';
    if (lowerKey.includes('api')) return 'api';
    
    return 'unknown';
  }

  /**
   * Detect if a value appears to be encrypted
   */
  private detectEncryption(value: string): boolean {
    // Simple heuristics for encrypted data detection
    // JWT tokens typically have 3 parts separated by dots
    if (value.split('.').length === 3) return false;
    
    // Base64 encoded data might be encrypted
    if (/^[A-Za-z0-9+/]+=*$/.test(value) && value.length > 50) return true;
    
    // Very long random-looking strings
    if (value.length > 100 && !/\s/.test(value)) return true;
    
    return false;
  }

  /**
   * Create backup of localStorage data
   */
  private async createBackup(): Promise<void> {
    if (!this.config.createBackup) return;

    this.log('info', 'Creating localStorage backup');
    this.updateStatus({ phase: 'backing-up', progress: 25 });

    try {
      this.backupData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            this.backupData[key] = value;
          }
        }
      }

      this.log('info', `Backup created with ${Object.keys(this.backupData).length} items`);
    } catch (error) {
      const errorMessage = `Failed to create backup: ${error}`;
      this.log('error', errorMessage, { error });
      throw new StorageOperationError({
        code: 'BACKUP_FAILED',
        message: errorMessage,
        operation: 'get',
        originalError: error as Error,
      });
    }
  }

  /**
   * Migrate tokens from localStorage to IndexedDB
   */
  async migrateTokensFromLocalStorage(): Promise<MigrationResult> {
    this.log('info', 'Starting token migration process');
    this.status = this.createInitialStatus();

    try {
      // Step 1: Detect existing tokens
      const detectedTokens = await this.detectExistingTokens();
      
      if (detectedTokens.length === 0) {
        this.log('info', 'No tokens found to migrate');
        this.updateStatus({ 
          phase: 'completed', 
          progress: 100, 
          endTime: new Date() 
        });
        return this.createMigrationResult(true);
      }

      // Step 2: Create backup
      await this.createBackup();

      // Step 3: Migrate tokens in batches
      this.updateStatus({ phase: 'migrating', progress: 30 });
      await this.migrateBatches(detectedTokens);

      // Step 4: Validate migration
      if (this.config.validateMigration) {
        this.updateStatus({ phase: 'validating', progress: 80 });
        await this.validateMigration(detectedTokens);
      }

      // Step 5: Cleanup localStorage
      if (this.config.cleanupAfterMigration && this.status.failedTokens === 0) {
        this.updateStatus({ phase: 'cleaning', progress: 90 });
        await this.cleanupOldTokens(detectedTokens);
      }

      // Step 6: Complete migration
      this.updateStatus({ 
        phase: 'completed', 
        progress: 100, 
        endTime: new Date() 
      });

      this.log('info', 'Migration completed successfully');
      return this.createMigrationResult(true);

    } catch (error) {
      const errorMessage = `Migration failed: ${error}`;
      this.log('error', errorMessage, { error });
      this.updateStatus({ 
        phase: 'failed', 
        endTime: new Date() 
      });
      this.status.errors.push(errorMessage);

      return this.createMigrationResult(false);
    }
  }

  /**
   * Migrate tokens in batches
   */
  private async migrateBatches(detectedTokens: DetectedToken[]): Promise<void> {
    const batches = this.createBatches(detectedTokens, this.config.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchProgress = 30 + ((i / batches.length) * 40);
      
      this.updateStatus({ progress: batchProgress });
      this.log('info', `Processing batch ${i + 1}/${batches.length} (${batch.length} tokens)`);

      await this.migrateBatch(batch);
    }
  }

  /**
   * Create batches from detected tokens
   */
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Migrate a single batch of tokens
   */
  private async migrateBatch(batch: DetectedToken[]): Promise<void> {
    const batchData: Record<string, TokenRecord> = {};

    // Convert detected tokens to TokenRecord format
    for (const detectedToken of batch) {
      const tokenRecord: TokenRecord = {
        key: detectedToken.key,
        value: detectedToken.value,
        type: detectedToken.estimatedType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      batchData[detectedToken.key] = tokenRecord;
    }

    // Attempt to store batch with retries
    await this.executeWithRetry(async () => {
      await this.storageService.setBatch(batchData);
      this.status.migratedTokens += batch.length;
      this.log('info', `Successfully migrated batch of ${batch.length} tokens`);
    }, batch);
  }

  /**
   * Execute operation with retry logic
   */
  private async executeWithRetry(
    operation: () => Promise<void>,
    context: DetectedToken[]
  ): Promise<void> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        await operation();
        return; // Success
      } catch (error) {
        lastError = error as Error;
        this.log('warn', `Attempt ${attempt} failed: ${error}`, { 
          attempt, 
          context: context.map(t => t.key) 
        });

        if (attempt < this.config.maxRetries) {
          await this.delay(this.config.retryDelay * attempt);
        }
      }
    }

    // All retries failed
    this.status.failedTokens += context.length;
    const errorMessage = `Failed to migrate batch after ${this.config.maxRetries} attempts: ${lastError}`;
    this.log('error', errorMessage, { context: context.map(t => t.key) });
    throw lastError;
  }

  /**
   * Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate migration by comparing localStorage and IndexedDB data
   */
  async validateMigration(detectedTokens: DetectedToken[]): Promise<boolean> {
    this.log('info', 'Starting migration validation');

    try {
      let validationErrors = 0;

      for (const detectedToken of detectedTokens) {
        const migratedValue = await this.storageService.get<TokenRecord>(detectedToken.key);
        
        if (!migratedValue) {
          this.log('error', `Validation failed: Token not found in IndexedDB`, { 
            key: detectedToken.key 
          });
          validationErrors++;
          continue;
        }

        if (migratedValue.value !== detectedToken.value) {
          this.log('error', `Validation failed: Token value mismatch`, { 
            key: detectedToken.key 
          });
          validationErrors++;
          continue;
        }

        this.log('info', `Validation passed for token: ${detectedToken.key}`);
      }

      const isValid = validationErrors === 0;
      this.log('info', `Migration validation ${isValid ? 'passed' : 'failed'}. Errors: ${validationErrors}`);
      
      return isValid;

    } catch (error) {
      const errorMessage = `Validation failed: ${error}`;
      this.log('error', errorMessage, { error });
      return false;
    }
  }

  /**
   * Clean up old token data from localStorage
   */
  async cleanupOldTokens(detectedTokens: DetectedToken[]): Promise<void> {
    this.log('info', 'Starting localStorage cleanup');

    try {
      for (const detectedToken of detectedTokens) {
        localStorage.removeItem(detectedToken.key);
        this.log('info', `Removed token from localStorage: ${detectedToken.key}`);
      }

      this.log('info', `Cleanup completed. Removed ${detectedTokens.length} tokens from localStorage`);

    } catch (error) {
      const errorMessage = `Cleanup failed: ${error}`;
      this.log('error', errorMessage, { error });
      throw new StorageOperationError({
        code: 'CLEANUP_FAILED',
        message: errorMessage,
        operation: 'remove',
        originalError: error as Error,
      });
    }
  }

  /**
   * Rollback migration by restoring localStorage from backup
   */
  async rollbackMigration(): Promise<void> {
    this.log('info', 'Starting migration rollback');

    try {
      if (Object.keys(this.backupData).length === 0) {
        throw new Error('No backup data available for rollback');
      }

      // Clear localStorage
      localStorage.clear();

      // Restore from backup
      for (const [key, value] of Object.entries(this.backupData)) {
        localStorage.setItem(key, value);
      }

      this.log('info', `Rollback completed. Restored ${Object.keys(this.backupData).length} items`);

    } catch (error) {
      const errorMessage = `Rollback failed: ${error}`;
      this.log('error', errorMessage, { error });
      throw new StorageOperationError({
        code: 'ROLLBACK_FAILED',
        message: errorMessage,
        operation: 'set',
        originalError: error as Error,
      });
    }
  }

  /**
   * Get current migration status
   */
  getMigrationStatus(): MigrationStatus {
    return { ...this.status };
  }

  /**
   * Update migration status
   */
  private updateStatus(updates: Partial<MigrationStatus>): void {
    this.status = { ...this.status, ...updates };
  }

  /**
   * Log migration progress
   */
  private log(level: 'info' | 'warn' | 'error', message: string, context?: Record<string, any>): void {
    const entry: MigrationLogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
    };

    this.status.log.push(entry);

    if (this.config.enableDetailedLogging) {
      console[level](`[TokenMigration] ${message}`, context || '');
    }
  }

  /**
   * Create migration result
   */
  private createMigrationResult(success: boolean): MigrationResult {
    return {
      success,
      fromVersion: 0, // localStorage version
      toVersion: 1,   // IndexedDB version
      duration: this.status.endTime 
        ? this.status.endTime.getTime() - this.status.startTime.getTime()
        : 0,
      errors: this.status.errors,
    };
  }

  /**
   * Check if migration is needed
   */
  async isMigrationNeeded(): Promise<boolean> {
    try {
      const detectedTokens = await this.detectExistingTokens();
      return detectedTokens.length > 0;
    } catch (error) {
      this.log('error', `Failed to check migration need: ${error}`);
      return false;
    }
  }

  /**
   * Get migration report for analysis
   */
  getMigrationReport(): {
    status: MigrationStatus;
    summary: {
      totalTokens: number;
      migratedTokens: number;
      failedTokens: number;
      successRate: number;
      duration: number;
    };
    recommendations: string[];
  } {
    const duration = this.status.endTime 
      ? this.status.endTime.getTime() - this.status.startTime.getTime()
      : 0;

    const successRate = this.status.totalTokens > 0 
      ? (this.status.migratedTokens / this.status.totalTokens) * 100 
      : 100;

    const recommendations: string[] = [];
    
    if (this.status.failedTokens > 0) {
      recommendations.push('Some tokens failed to migrate. Check the error log for details.');
    }
    
    if (successRate < 100) {
      recommendations.push('Consider running migration again for failed tokens.');
    }
    
    if (this.status.errors.length > 0) {
      recommendations.push('Review error messages to prevent future migration issues.');
    }

    return {
      status: this.getMigrationStatus(),
      summary: {
        totalTokens: this.status.totalTokens,
        migratedTokens: this.status.migratedTokens,
        failedTokens: this.status.failedTokens,
        successRate,
        duration,
      },
      recommendations,
    };
  }
}

/**
 * Create a new token migration service instance
 */
export function createTokenMigrationService(
  storageService: StorageService,
  config?: Partial<MigrationConfig>
): TokenMigrationService {
  return new TokenMigrationService(storageService, config);
}

/**
 * Utility function to check if any tokens exist in localStorage
 */
export async function hasTokensInLocalStorage(): Promise<boolean> {
  const patterns = DEFAULT_MIGRATION_CONFIG.tokenKeyPatterns;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && patterns.some(pattern => pattern.test(key))) {
      return true;
    }
  }
  
  return false;
}