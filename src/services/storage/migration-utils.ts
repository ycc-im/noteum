/**
 * Migration utility functions for storage operations
 *
 * This module provides utility functions for data migration, transformation,
 * backup/restore operations, and migration analysis tools.
 *
 * @fileoverview Migration utility functions
 * @module storage/migration-utils
 */

import { TokenRecord } from './types';
import {
  DetectedToken,
  MigrationConfig,
  MigrationStatus,
} from './token-migration';
import { ValidationResult } from './migration-validator';

/**
 * Data backup format for localStorage
 */
export interface LocalStorageBackup {
  /** Backup timestamp */
  timestamp: Date;
  /** Backup version for compatibility */
  version: string;
  /** Backed up data */
  data: Record<string, string>;
  /** Metadata about the backup */
  metadata: {
    /** Total items count */
    itemCount: number;
    /** Total size in bytes */
    totalSize: number;
    /** Browser information */
    userAgent: string;
    /** Source URL */
    origin: string;
  };
}

/**
 * Migration report data structure
 */
export interface MigrationReport {
  /** Report metadata */
  metadata: {
    timestamp: Date;
    duration: number;
    version: string;
  };
  /** Migration summary */
  summary: {
    totalTokens: number;
    migratedTokens: number;
    failedTokens: number;
    successRate: number;
    averageTokenSize: number;
  };
  /** Validation results */
  validation: {
    isValid: boolean;
    errorCount: number;
    warningCount: number;
    criticalIssues: string[];
  };
  /** Performance metrics */
  performance: {
    migrationSpeed: number; // tokens per second
    throughput: number; // bytes per second
    memoryUsage: number; // estimated peak memory usage
  };
  /** Recommendations */
  recommendations: string[];
}

/**
 * Data transformation options
 */
export interface TransformationOptions {
  /** Whether to normalize token types */
  normalizeTypes: boolean;
  /** Whether to encrypt values */
  encryptValues: boolean;
  /** Whether to add timestamps */
  addTimestamps: boolean;
  /** Whether to generate IDs */
  generateIds: boolean;
  /** Custom transformation function */
  customTransform?: (token: DetectedToken) => Partial<TokenRecord>;
}

/**
 * Migration strategy configuration
 */
export interface MigrationStrategy {
  /** Strategy type */
  type: 'immediate' | 'progressive' | 'scheduled' | 'hybrid';
  /** Batch size for progressive migration */
  batchSize: number;
  /** Delay between batches in milliseconds */
  batchDelay: number;
  /** Priority order for tokens */
  priorityOrder: 'alphabetical' | 'size' | 'usage' | 'type' | 'custom';
  /** Custom priority function */
  customPriority?: (token: DetectedToken) => number;
  /** Maximum concurrent operations */
  maxConcurrency: number;
}

/**
 * Default transformation options
 */
const DEFAULT_TRANSFORM_OPTIONS: TransformationOptions = {
  normalizeTypes: true,
  encryptValues: false,
  addTimestamps: true,
  generateIds: false,
};

/**
 * Default migration strategy
 */
const DEFAULT_MIGRATION_STRATEGY: MigrationStrategy = {
  type: 'progressive',
  batchSize: 10,
  batchDelay: 100,
  priorityOrder: 'type',
  maxConcurrency: 3,
};

/**
 * Create a backup of localStorage data
 */
export function createLocalStorageBackup(): LocalStorageBackup {
  const data: Record<string, string> = {};
  let totalSize = 0;

  // Collect all localStorage data
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        data[key] = value;
        totalSize += new Blob([key + value]).size;
      }
    }
  }

  return {
    timestamp: new Date(),
    version: '1.0.0',
    data,
    metadata: {
      itemCount: Object.keys(data).length,
      totalSize,
      userAgent: navigator.userAgent,
      origin: window.location.origin,
    },
  };
}

/**
 * Restore localStorage from backup
 */
export function restoreLocalStorageBackup(backup: LocalStorageBackup): void {
  // Clear existing localStorage
  localStorage.clear();

  // Restore data from backup
  Object.entries(backup.data).forEach(([key, value]) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to restore item ${key}:`, error);
    }
  });
}

/**
 * Serialize backup to JSON string
 */
export function serializeBackup(backup: LocalStorageBackup): string {
  return JSON.stringify(backup, null, 2);
}

/**
 * Deserialize backup from JSON string
 */
export function deserializeBackup(backupJson: string): LocalStorageBackup {
  const parsed = JSON.parse(backupJson);

  // Convert timestamp back to Date object
  parsed.timestamp = new Date(parsed.timestamp);

  return parsed;
}

/**
 * Transform detected tokens to TokenRecord format
 */
export function transformTokensToRecords(
  tokens: DetectedToken[],
  options: Partial<TransformationOptions> = {}
): TokenRecord[] {
  const config = { ...DEFAULT_TRANSFORM_OPTIONS, ...options };

  return tokens.map(token => {
    let record: TokenRecord = {
      key: token.key,
      value: token.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (config.normalizeTypes) {
      record.type = normalizeTokenType(token.estimatedType);
    }

    if (config.addTimestamps) {
      record.createdAt = new Date();
      record.updatedAt = new Date();
    }

    if (config.encryptValues) {
      record.value = encryptTokenValue(token.value);
    }

    // Apply custom transformation if provided
    if (config.customTransform) {
      const customFields = config.customTransform(token);
      record = { ...record, ...customFields };
    }

    return record;
  });
}

/**
 * Normalize token type to standard values
 */
export function normalizeTokenType(type: string): string {
  const normalized = type.toLowerCase();

  switch (normalized) {
    case 'access':
    case 'access_token':
      return 'access';
    case 'refresh':
    case 'refresh_token':
      return 'refresh';
    case 'api':
    case 'api_token':
    case 'api_key':
      return 'api';
    default:
      return 'unknown';
  }
}

/**
 * Simple token value encryption (placeholder implementation)
 */
export function encryptTokenValue(value: string): string {
  // In a real implementation, this would use proper encryption
  // For now, we'll just base64 encode as a placeholder
  return btoa(value);
}

/**
 * Simple token value decryption (placeholder implementation)
 */
export function decryptTokenValue(encryptedValue: string): string {
  // In a real implementation, this would use proper decryption
  try {
    return atob(encryptedValue);
  } catch {
    return encryptedValue; // Return as-is if not base64
  }
}

/**
 * Sort tokens by priority for migration
 */
export function sortTokensByPriority(
  tokens: DetectedToken[],
  strategy: Partial<MigrationStrategy> = {}
): DetectedToken[] {
  const config = { ...DEFAULT_MIGRATION_STRATEGY, ...strategy };

  return [...tokens].sort((a, b) => {
    if (config.customPriority) {
      return config.customPriority(b) - config.customPriority(a);
    }

    switch (config.priorityOrder) {
      case 'alphabetical':
        return a.key.localeCompare(b.key);

      case 'size':
        return b.size - a.size; // Larger first

      case 'type':
        return (
          getTypePriority(a.estimatedType) - getTypePriority(b.estimatedType)
        );

      case 'usage':
        return getUsagePriority(a.key) - getUsagePriority(b.key);

      default:
        return 0;
    }
  });
}

/**
 * Get priority score for token type
 */
function getTypePriority(type: string): number {
  switch (type) {
    case 'access':
      return 1; // Highest priority
    case 'refresh':
      return 2;
    case 'api':
      return 3;
    case 'unknown':
      return 4; // Lowest priority
    default:
      return 5;
  }
}

/**
 * Get priority score based on key usage patterns
 */
function getUsagePriority(key: string): number {
  // Critical tokens get highest priority
  if (/^(access_token|token|auth)$/i.test(key)) return 1;
  if (/^refresh/i.test(key)) return 2;
  if (/^api/i.test(key)) return 3;
  return 4;
}

/**
 * Create batches from tokens array
 */
export function createTokenBatches(
  tokens: DetectedToken[],
  batchSize: number
): DetectedToken[][] {
  const batches: DetectedToken[][] = [];

  for (let i = 0; i < tokens.length; i += batchSize) {
    batches.push(tokens.slice(i, i + batchSize));
  }

  return batches;
}

/**
 * Calculate migration statistics
 */
export function calculateMigrationStats(
  status: MigrationStatus,
  tokens: DetectedToken[]
): {
  progress: number;
  speed: number;
  eta: number;
  throughput: number;
} {
  const elapsed = Date.now() - status.startTime.getTime();
  const elapsedSeconds = elapsed / 1000;

  const progress =
    status.totalTokens > 0
      ? (status.migratedTokens / status.totalTokens) * 100
      : 0;

  const speed = elapsedSeconds > 0 ? status.migratedTokens / elapsedSeconds : 0;

  const remaining = status.totalTokens - status.migratedTokens;
  const eta = speed > 0 ? remaining / speed : 0;

  const totalBytes = tokens.reduce((sum, token) => sum + token.size, 0);
  const throughput = elapsedSeconds > 0 ? totalBytes / elapsedSeconds : 0;

  return {
    progress,
    speed,
    eta,
    throughput,
  };
}

/**
 * Generate migration report
 */
export function generateMigrationReport(
  status: MigrationStatus,
  tokens: DetectedToken[],
  validationResults?: ValidationResult[]
): MigrationReport {
  const duration = status.endTime
    ? status.endTime.getTime() - status.startTime.getTime()
    : 0;

  const durationSeconds = duration / 1000;
  const totalSize = tokens.reduce((sum, token) => sum + token.size, 0);
  const averageTokenSize = tokens.length > 0 ? totalSize / tokens.length : 0;

  const migrationSpeed =
    durationSeconds > 0 ? status.migratedTokens / durationSeconds : 0;
  const throughput = durationSeconds > 0 ? totalSize / durationSeconds : 0;

  // Analyze validation results
  let errorCount = 0;
  let warningCount = 0;
  const criticalIssues: string[] = [];

  if (validationResults) {
    validationResults.forEach(result => {
      errorCount += result.errors.length;
      warningCount += result.warnings.length;

      result.errors
        .filter(error => error.severity === 'critical')
        .forEach(error => criticalIssues.push(error.message));
    });
  }

  // Generate recommendations
  const recommendations = generateRecommendations(
    status,
    tokens,
    validationResults
  );

  return {
    metadata: {
      timestamp: new Date(),
      duration,
      version: '1.0.0',
    },
    summary: {
      totalTokens: status.totalTokens,
      migratedTokens: status.migratedTokens,
      failedTokens: status.failedTokens,
      successRate:
        status.totalTokens > 0
          ? (status.migratedTokens / status.totalTokens) * 100
          : 100,
      averageTokenSize,
    },
    validation: {
      isValid: criticalIssues.length === 0,
      errorCount,
      warningCount,
      criticalIssues,
    },
    performance: {
      migrationSpeed,
      throughput,
      memoryUsage: estimateMemoryUsage(tokens),
    },
    recommendations,
  };
}

/**
 * Generate recommendations based on migration results
 */
function generateRecommendations(
  status: MigrationStatus,
  tokens: DetectedToken[],
  validationResults?: ValidationResult[]
): string[] {
  const recommendations: string[] = [];

  // Performance recommendations
  if (status.totalTokens > 100) {
    recommendations.push(
      'Consider using progressive migration for large datasets'
    );
  }

  // Error recommendations
  if (status.failedTokens > 0) {
    recommendations.push('Review failed tokens and consider retry mechanisms');
  }

  // Size recommendations
  const largeTokens = tokens.filter(t => t.size > 10000);
  if (largeTokens.length > 0) {
    recommendations.push(
      'Consider compressing large tokens to save storage space'
    );
  }

  // Security recommendations
  const unencryptedTokens = tokens.filter(t => !t.isEncrypted);
  if (unencryptedTokens.length > 0) {
    recommendations.push('Consider encrypting sensitive token data');
  }

  // Validation recommendations
  if (validationResults) {
    const hasErrors = validationResults.some(r => r.errors.length > 0);
    if (hasErrors) {
      recommendations.push(
        'Address validation errors to ensure data integrity'
      );
    }
  }

  return recommendations;
}

/**
 * Estimate memory usage for tokens
 */
function estimateMemoryUsage(tokens: DetectedToken[]): number {
  // Rough estimation: token size + overhead per token
  const overhead = 100; // bytes per token for metadata
  return tokens.reduce((total, token) => total + token.size + overhead, 0);
}

/**
 * Check storage compatibility
 */
export function checkStorageCompatibility(): {
  hasIndexedDB: boolean;
  hasLocalStorage: boolean;
  hasWebCrypto: boolean;
  estimatedQuota: number;
} {
  const hasIndexedDB = 'indexedDB' in window;
  const hasLocalStorage = 'localStorage' in window;
  const hasWebCrypto = 'crypto' in window && 'subtle' in window.crypto;

  // Estimate available quota (this is a rough estimation)
  let estimatedQuota = 0;
  if (
    'navigator' in window &&
    'storage' in navigator &&
    'estimate' in navigator.storage
  ) {
    navigator.storage.estimate().then(estimate => {
      estimatedQuota = estimate.quota || 0;
    });
  }

  return {
    hasIndexedDB,
    hasLocalStorage,
    hasWebCrypto,
    estimatedQuota,
  };
}

/**
 * Format migration duration for display
 */
export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }

  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Format bytes for display
 */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Format migration progress for display
 */
export function formatProgress(current: number, total: number): string {
  if (total === 0) return '100%';
  const percentage = (current / total) * 100;
  return `${percentage.toFixed(1)}% (${current}/${total})`;
}

/**
 * Create a debounced function for progress updates
 */
export function createProgressDebouncer(
  callback: (status: MigrationStatus) => void,
  delay: number = 250
): (status: MigrationStatus) => void {
  let timeoutId: NodeJS.Timeout;

  return (status: MigrationStatus) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(status), delay);
  };
}

/**
 * Validate migration configuration
 */
export function validateMigrationConfig(config: Partial<MigrationConfig>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (config.batchSize && config.batchSize <= 0) {
    errors.push('Batch size must be greater than 0');
  }

  if (config.maxRetries && config.maxRetries < 0) {
    errors.push('Max retries cannot be negative');
  }

  if (config.retryDelay && config.retryDelay < 0) {
    errors.push('Retry delay cannot be negative');
  }

  if (config.batchSize && config.batchSize > 100) {
    warnings.push('Large batch sizes may impact performance');
  }

  if (config.maxRetries && config.maxRetries > 10) {
    warnings.push('High retry counts may cause long delays');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Utility to safely parse JSON with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Utility to deep clone objects
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Utility to generate unique IDs
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Utility to measure execution time
 */
export async function measureExecutionTime<T>(
  operation: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const startTime = Date.now();
  const result = await operation();
  const duration = Date.now() - startTime;

  return { result, duration };
}
