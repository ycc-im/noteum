/**
 * Migration validator service for ensuring data integrity during migrations
 *
 * This service provides comprehensive validation capabilities for migration operations,
 * including data integrity checks, consistency validation, and corruption detection.
 *
 * @fileoverview Migration validation service
 * @module storage/migration-validator
 */

import { TokenRecord, StorageOperationError } from './types';
import { StorageService } from './interfaces';
import { DetectedToken, MigrationLogEntry } from './token-migration';

/**
 * Validation result for individual data items
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Validation errors if any */
  errors: ValidationError[];
  /** Warnings that don't fail validation */
  warnings: ValidationWarning[];
  /** Additional metadata about validation */
  metadata: ValidationMetadata;
}

/**
 * Validation error details
 */
export interface ValidationError {
  /** Error code for categorization */
  code:
    | 'MISSING_DATA'
    | 'DATA_MISMATCH'
    | 'CORRUPTION_DETECTED'
    | 'INVALID_FORMAT'
    | 'SIZE_MISMATCH'
    | 'TYPE_MISMATCH';
  /** Human-readable error message */
  message: string;
  /** Key that failed validation */
  key: string;
  /** Expected value or type */
  expected?: any;
  /** Actual value found */
  actual?: any;
  /** Severity level */
  severity: 'critical' | 'major' | 'minor';
}

/**
 * Validation warning details
 */
export interface ValidationWarning {
  /** Warning code */
  code:
    | 'PERFORMANCE_IMPACT'
    | 'COMPATIBILITY_ISSUE'
    | 'DEPRECATED_FORMAT'
    | 'POTENTIAL_ISSUE';
  /** Warning message */
  message: string;
  /** Key related to warning */
  key?: string;
  /** Suggested action */
  suggestion?: string;
}

/**
 * Validation metadata
 */
export interface ValidationMetadata {
  /** Validation timestamp */
  timestamp: Date;
  /** Time taken for validation in milliseconds */
  duration: number;
  /** Number of items validated */
  itemCount: number;
  /** Total data size validated in bytes */
  dataSize: number;
  /** Validation method used */
  method: 'full' | 'sample' | 'incremental';
}

/**
 * Batch validation result
 */
export interface BatchValidationResult {
  /** Overall validation status */
  isValid: boolean;
  /** Individual validation results */
  results: ValidationResult[];
  /** Summary statistics */
  summary: ValidationSummary;
  /** Detailed log of validation process */
  log: MigrationLogEntry[];
}

/**
 * Validation summary statistics
 */
export interface ValidationSummary {
  /** Total items validated */
  totalItems: number;
  /** Number of valid items */
  validItems: number;
  /** Number of invalid items */
  invalidItems: number;
  /** Number of items with warnings */
  warningItems: number;
  /** Critical errors count */
  criticalErrors: number;
  /** Major errors count */
  majorErrors: number;
  /** Minor errors count */
  minorErrors: number;
  /** Overall success rate percentage */
  successRate: number;
}

/**
 * Validation configuration
 */
export interface ValidationConfig {
  /** Whether to perform deep validation */
  deepValidation: boolean;
  /** Maximum size difference allowed in bytes */
  maxSizeDifference: number;
  /** Whether to validate token format */
  validateTokenFormat: boolean;
  /** Whether to check for data corruption */
  checkForCorruption: boolean;
  /** Sample size for large datasets (0 = validate all) */
  sampleSize: number;
  /** Timeout for individual validations in milliseconds */
  validationTimeout: number;
  /** Whether to log detailed validation steps */
  enableDetailedLogging: boolean;
}

/**
 * Default validation configuration
 */
const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  deepValidation: true,
  maxSizeDifference: 100, // 100 bytes
  validateTokenFormat: true,
  checkForCorruption: true,
  sampleSize: 0, // Validate all items
  validationTimeout: 5000,
  enableDetailedLogging: true,
};

/**
 * Migration validator service for ensuring data integrity
 */
export class MigrationValidator {
  private storageService: StorageService;
  private config: ValidationConfig;
  private log: MigrationLogEntry[] = [];

  /**
   * Initialize validator service
   */
  constructor(
    storageService: StorageService,
    config?: Partial<ValidationConfig>
  ) {
    this.storageService = storageService;
    this.config = { ...DEFAULT_VALIDATION_CONFIG, ...config };
  }

  /**
   * Validate migrated data against source data
   */
  async validateMigration(
    sourceTokens: DetectedToken[],
    targetTokens?: TokenRecord[]
  ): Promise<BatchValidationResult> {
    const startTime = Date.now();
    this.logInfo('Starting migration validation', {
      sourceCount: sourceTokens.length,
      targetCount: targetTokens?.length || 'unknown',
    });

    try {
      // If target tokens not provided, fetch from storage
      const actualTargetTokens =
        targetTokens || (await this.fetchTargetTokens(sourceTokens));

      // Determine validation method based on dataset size
      const method = this.determineValidationMethod(sourceTokens.length);
      const tokensToValidate = this.selectValidationSample(
        sourceTokens,
        method
      );

      // Perform validation
      const results: ValidationResult[] = [];

      for (const sourceToken of tokensToValidate) {
        const result = await this.validateSingleToken(
          sourceToken,
          actualTargetTokens
        );
        results.push(result);
      }

      // Calculate summary
      const summary = this.calculateValidationSummary(results);
      const duration = Date.now() - startTime;

      this.logInfo('Migration validation completed', {
        summary,
        duration,
      });

      return {
        isValid: summary.criticalErrors === 0 && summary.majorErrors === 0,
        results,
        summary,
        log: [...this.log],
      };
    } catch (error) {
      const errorMessage = `Validation failed: ${error}`;
      this.logError(errorMessage, { error });
      throw new StorageOperationError({
        code: 'VALIDATION_FAILED',
        message: errorMessage,
        operation: 'query',
        originalError: error as Error,
      });
    }
  }

  /**
   * Fetch target tokens from storage
   */
  private async fetchTargetTokens(
    sourceTokens: DetectedToken[]
  ): Promise<TokenRecord[]> {
    const targetTokens: TokenRecord[] = [];

    for (const sourceToken of sourceTokens) {
      try {
        const targetToken = await this.storageService.get<TokenRecord>(
          sourceToken.key
        );
        if (targetToken) {
          targetTokens.push(targetToken);
        }
      } catch (error) {
        this.logWarning(`Failed to fetch target token: ${sourceToken.key}`, {
          error,
        });
      }
    }

    return targetTokens;
  }

  /**
   * Determine optimal validation method based on dataset size
   */
  private determineValidationMethod(
    itemCount: number
  ): 'full' | 'sample' | 'incremental' {
    if (itemCount <= 100) return 'full';
    if (itemCount <= 1000) return 'sample';
    return 'incremental';
  }

  /**
   * Select validation sample based on method
   */
  private selectValidationSample(
    tokens: DetectedToken[],
    method: 'full' | 'sample' | 'incremental'
  ): DetectedToken[] {
    if (method === 'full' || this.config.sampleSize === 0) {
      return tokens;
    }

    const sampleSize = this.config.sampleSize || Math.min(tokens.length, 100);
    const step = Math.floor(tokens.length / sampleSize);

    return tokens.filter((_, index) => index % step === 0).slice(0, sampleSize);
  }

  /**
   * Validate a single token migration
   */
  async validateSingleToken(
    sourceToken: DetectedToken,
    targetTokens: TokenRecord[]
  ): Promise<ValidationResult> {
    const startTime = Date.now();
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      // Find corresponding target token
      const targetToken = targetTokens.find(t => t.key === sourceToken.key);

      // Check if target exists
      if (!targetToken) {
        errors.push({
          code: 'MISSING_DATA',
          message: `Target token not found for key: ${sourceToken.key}`,
          key: sourceToken.key,
          severity: 'critical',
        });
        return this.createValidationResult(
          false,
          errors,
          warnings,
          startTime,
          1,
          sourceToken.size
        );
      }

      // Validate token value
      if (this.config.deepValidation) {
        this.validateTokenValue(sourceToken, targetToken, errors, warnings);
      }

      // Validate token format
      if (this.config.validateTokenFormat) {
        this.validateTokenFormat(sourceToken, targetToken, errors, warnings);
      }

      // Check for data corruption
      if (this.config.checkForCorruption) {
        this.checkDataCorruption(sourceToken, targetToken, errors, warnings);
      }

      // Validate token type mapping
      this.validateTokenType(sourceToken, targetToken, errors, warnings);

      // Check size consistency
      this.validateTokenSize(sourceToken, targetToken, errors, warnings);

      const isValid = errors.filter(e => e.severity !== 'minor').length === 0;
      return this.createValidationResult(
        isValid,
        errors,
        warnings,
        startTime,
        1,
        sourceToken.size
      );
    } catch (error) {
      errors.push({
        code: 'CORRUPTION_DETECTED',
        message: `Validation error for ${sourceToken.key}: ${error}`,
        key: sourceToken.key,
        severity: 'critical',
      });
      return this.createValidationResult(
        false,
        errors,
        warnings,
        startTime,
        1,
        sourceToken.size
      );
    }
  }

  /**
   * Validate token value consistency
   */
  private validateTokenValue(
    sourceToken: DetectedToken,
    targetToken: TokenRecord,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (sourceToken.value !== targetToken.value) {
      errors.push({
        code: 'DATA_MISMATCH',
        message: `Token value mismatch for key: ${sourceToken.key}`,
        key: sourceToken.key,
        expected: sourceToken.value,
        actual: targetToken.value,
        severity: 'critical',
      });
    }
  }

  /**
   * Validate token format consistency
   */
  private validateTokenFormat(
    sourceToken: DetectedToken,
    targetToken: TokenRecord,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Check JWT format
    if (
      this.isJWTToken(sourceToken.value) !== this.isJWTToken(targetToken.value)
    ) {
      warnings.push({
        code: 'COMPATIBILITY_ISSUE',
        message: `Token format changed from JWT to non-JWT or vice versa: ${sourceToken.key}`,
        key: sourceToken.key,
        suggestion: 'Verify token format compatibility',
      });
    }

    // Check base64 format
    if (this.isBase64(sourceToken.value) !== this.isBase64(targetToken.value)) {
      warnings.push({
        code: 'COMPATIBILITY_ISSUE',
        message: `Token encoding format changed: ${sourceToken.key}`,
        key: sourceToken.key,
        suggestion: 'Verify token encoding compatibility',
      });
    }
  }

  /**
   * Check for data corruption indicators
   */
  private checkDataCorruption(
    sourceToken: DetectedToken,
    targetToken: TokenRecord,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Check for null bytes
    if (targetToken.value.includes('\0')) {
      errors.push({
        code: 'CORRUPTION_DETECTED',
        message: `Null bytes detected in token value: ${sourceToken.key}`,
        key: sourceToken.key,
        severity: 'major',
      });
    }

    // Check for unusual encoding issues
    try {
      JSON.stringify(targetToken.value);
    } catch (error) {
      errors.push({
        code: 'CORRUPTION_DETECTED',
        message: `Token value contains non-serializable data: ${sourceToken.key}`,
        key: sourceToken.key,
        severity: 'major',
      });
    }

    // Check for size corruption
    const expectedSize = new Blob([sourceToken.value]).size;
    const actualSize = new Blob([targetToken.value]).size;

    if (Math.abs(expectedSize - actualSize) > this.config.maxSizeDifference) {
      errors.push({
        code: 'SIZE_MISMATCH',
        message: `Significant size difference detected: ${sourceToken.key}`,
        key: sourceToken.key,
        expected: expectedSize,
        actual: actualSize,
        severity: 'major',
      });
    }
  }

  /**
   * Validate token type mapping
   */
  private validateTokenType(
    sourceToken: DetectedToken,
    targetToken: TokenRecord,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (targetToken.type && targetToken.type !== sourceToken.estimatedType) {
      // This is expected for 'unknown' types
      if (sourceToken.estimatedType !== 'unknown') {
        warnings.push({
          code: 'COMPATIBILITY_ISSUE',
          message: `Token type changed during migration: ${sourceToken.key}`,
          key: sourceToken.key,
          suggestion: `Expected: ${sourceToken.estimatedType}, Got: ${targetToken.type}`,
        });
      }
    }
  }

  /**
   * Validate token size consistency
   */
  private validateTokenSize(
    sourceToken: DetectedToken,
    targetToken: TokenRecord,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const targetSize = new Blob([targetToken.value]).size;
    const sizeDifference = Math.abs(sourceToken.size - targetSize);

    if (sizeDifference > this.config.maxSizeDifference) {
      errors.push({
        code: 'SIZE_MISMATCH',
        message: `Token size mismatch exceeds threshold: ${sourceToken.key}`,
        key: sourceToken.key,
        expected: sourceToken.size,
        actual: targetSize,
        severity:
          sizeDifference > this.config.maxSizeDifference * 2
            ? 'major'
            : 'minor',
      });
    }
  }

  /**
   * Check if value is a JWT token
   */
  private isJWTToken(value: string): boolean {
    return value.split('.').length === 3;
  }

  /**
   * Check if value is base64 encoded
   */
  private isBase64(value: string): boolean {
    try {
      return btoa(atob(value)) === value;
    } catch {
      return false;
    }
  }

  /**
   * Create validation result object
   */
  private createValidationResult(
    isValid: boolean,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    startTime: number,
    itemCount: number,
    dataSize: number
  ): ValidationResult {
    return {
      isValid,
      errors,
      warnings,
      metadata: {
        timestamp: new Date(),
        duration: Date.now() - startTime,
        itemCount,
        dataSize,
        method: this.determineValidationMethod(itemCount),
      },
    };
  }

  /**
   * Calculate validation summary statistics
   */
  private calculateValidationSummary(
    results: ValidationResult[]
  ): ValidationSummary {
    const totalItems = results.length;
    const validItems = results.filter(r => r.isValid).length;
    const invalidItems = totalItems - validItems;
    const warningItems = results.filter(r => r.warnings.length > 0).length;

    let criticalErrors = 0;
    let majorErrors = 0;
    let minorErrors = 0;

    results.forEach(result => {
      result.errors.forEach(error => {
        switch (error.severity) {
          case 'critical':
            criticalErrors++;
            break;
          case 'major':
            majorErrors++;
            break;
          case 'minor':
            minorErrors++;
            break;
        }
      });
    });

    return {
      totalItems,
      validItems,
      invalidItems,
      warningItems,
      criticalErrors,
      majorErrors,
      minorErrors,
      successRate: totalItems > 0 ? (validItems / totalItems) * 100 : 100,
    };
  }

  /**
   * Validate migration integrity across all tokens
   */
  async validateMigrationIntegrity(): Promise<{
    isIntegrityValid: boolean;
    issues: ValidationError[];
    recommendations: string[];
  }> {
    this.logInfo('Starting migration integrity validation');

    const issues: ValidationError[] = [];
    const recommendations: string[] = [];

    try {
      // Check storage service availability
      const keys = await this.storageService.keys();

      // Check for orphaned data
      const orphanedKeys = await this.findOrphanedKeys();
      if (orphanedKeys.length > 0) {
        issues.push({
          code: 'CORRUPTION_DETECTED',
          message: `Found ${orphanedKeys.length} orphaned keys in storage`,
          key: 'storage_integrity',
          severity: 'minor',
        });
        recommendations.push(
          'Clean up orphaned keys to improve storage efficiency'
        );
      }

      // Check for duplicate keys
      const duplicates = await this.findDuplicateKeys();
      if (duplicates.length > 0) {
        issues.push({
          code: 'CORRUPTION_DETECTED',
          message: `Found ${duplicates.length} duplicate keys`,
          key: 'storage_integrity',
          severity: 'major',
        });
        recommendations.push(
          'Remove duplicate keys to prevent data inconsistency'
        );
      }

      // Check storage usage
      const usage = await this.storageService.getUsage();
      if (usage.percentage > 90) {
        recommendations.push(
          'Storage usage is high. Consider cleaning up old data'
        );
      }

      return {
        isIntegrityValid:
          issues.filter(i => i.severity !== 'minor').length === 0,
        issues,
        recommendations,
      };
    } catch (error) {
      this.logError('Migration integrity validation failed', { error });
      issues.push({
        code: 'CORRUPTION_DETECTED',
        message: `Integrity validation failed: ${error}`,
        key: 'storage_integrity',
        severity: 'critical',
      });

      return {
        isIntegrityValid: false,
        issues,
        recommendations: [
          'Re-run migration validation to identify specific issues',
        ],
      };
    }
  }

  /**
   * Find orphaned keys in storage
   */
  private async findOrphanedKeys(): Promise<string[]> {
    // This would implement logic to find keys that don't follow expected patterns
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Find duplicate keys in storage
   */
  private async findDuplicateKeys(): Promise<string[]> {
    // This would implement logic to find duplicate keys
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Log information message
   */
  private logInfo(message: string, context?: Record<string, any>): void {
    const entry: MigrationLogEntry = {
      timestamp: new Date(),
      level: 'info',
      message,
      context,
    };
    this.log.push(entry);

    if (this.config.enableDetailedLogging) {
      console.info(`[MigrationValidator] ${message}`, context || '');
    }
  }

  /**
   * Log warning message
   */
  private logWarning(message: string, context?: Record<string, any>): void {
    const entry: MigrationLogEntry = {
      timestamp: new Date(),
      level: 'warn',
      message,
      context,
    };
    this.log.push(entry);

    if (this.config.enableDetailedLogging) {
      console.warn(`[MigrationValidator] ${message}`, context || '');
    }
  }

  /**
   * Log error message
   */
  private logError(message: string, context?: Record<string, any>): void {
    const entry: MigrationLogEntry = {
      timestamp: new Date(),
      level: 'error',
      message,
      context,
    };
    this.log.push(entry);

    if (this.config.enableDetailedLogging) {
      console.error(`[MigrationValidator] ${message}`, context || '');
    }
  }

  /**
   * Get validation log
   */
  getValidationLog(): MigrationLogEntry[] {
    return [...this.log];
  }

  /**
   * Clear validation log
   */
  clearLog(): void {
    this.log = [];
  }
}

/**
 * Create a new migration validator instance
 */
export function createMigrationValidator(
  storageService: StorageService,
  config?: Partial<ValidationConfig>
): MigrationValidator {
  return new MigrationValidator(storageService, config);
}

/**
 * Quick validation utility for simple checks
 */
export async function quickValidateToken(
  sourceKey: string,
  sourceValue: string,
  targetValue: string
): Promise<boolean> {
  return sourceValue === targetValue;
}

/**
 * Utility to create validation error
 */
export function createValidationError(
  code: ValidationError['code'],
  message: string,
  key: string,
  severity: ValidationError['severity'] = 'major'
): ValidationError {
  return { code, message, key, severity };
}
