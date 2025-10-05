/**
 * Storage utility functions and helpers
 * 
 * This module provides utility functions for storage operations including
 * key parsing, error handling, serialization, compression, and performance helpers.
 * 
 * @fileoverview Storage utility functions
 * @module storage/utils
 */

import type { StorageError } from './interfaces';
import type { StorageOperationError } from './types';
import { TableNames } from './schema';

/**
 * Key parsing result interface
 */
export interface KeyParseResult {
  /** Table name extracted from key */
  tableName: string;
  /** Original key */
  originalKey: string;
  /** Additional fields based on table type */
  additionalFields: Record<string, any>;
}

/**
 * Compression options
 */
export interface CompressionOptions {
  /** Minimum size threshold for compression (bytes) */
  threshold: number;
  /** Compression algorithm */
  algorithm: 'gzip' | 'deflate' | 'none';
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  /** Operation duration in milliseconds */
  duration: number;
  /** Data size in bytes */
  dataSize: number;
  /** Number of records processed */
  recordCount: number;
  /** Operations per second */
  opsPerSecond: number;
}

/**
 * StorageUtils - Utility class for storage operations
 */
export class StorageUtils {
  
  // =================== Key Management ===================

  /**
   * Parse storage key to determine table and extract metadata
   */
  static parseKey(key: string): KeyParseResult | null {
    try {
      // Key format: prefix:identifier or tableName:identifier
      const parts = key.split(':');
      if (parts.length < 2) {
        // Fallback to userPreferences for simple keys
        return {
          tableName: TableNames.USER_PREFERENCES,
          originalKey: key,
          additionalFields: {
            category: 'general',
            userId: 'default',
          },
        };
      }

      const prefix = parts[0].toLowerCase();
      const identifier = parts.slice(1).join(':');

      let tableName: string;
      let additionalFields: Record<string, any> = {};

      switch (prefix) {
        case 'token':
        case 'auth':
          tableName = TableNames.TOKENS;
          additionalFields = {
            type: 'access_token',
            createdAt: new Date(),
          };
          break;

        case 'pref':
        case 'preference':
        case 'user':
          tableName = TableNames.USER_PREFERENCES;
          additionalFields = {
            category: 'user',
            userId: parts[2] || 'default',
          };
          break;

        case 'setting':
        case 'config':
          tableName = TableNames.APP_SETTINGS;
          additionalFields = {
            scope: 'global',
          };
          break;

        case 'cache':
        case 'api':
          tableName = TableNames.API_CACHE;
          additionalFields = {
            expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            source: 'api',
          };
          break;

        case 'meta':
        case 'metadata':
        case 'system':
          tableName = TableNames.METADATA;
          additionalFields = {
            type: 'system',
          };
          break;

        default:
          // Default to userPreferences for unknown prefixes
          tableName = TableNames.USER_PREFERENCES;
          additionalFields = {
            category: prefix,
            userId: 'default',
          };
          break;
      }

      return {
        tableName,
        originalKey: key,
        additionalFields,
      };
    } catch (error) {
      console.error('[StorageUtils] Key parsing failed:', error);
      return null;
    }
  }

  /**
   * Generate key with proper prefix
   */
  static generateKey(tableName: string, identifier: string, userId?: string): string {
    const prefix = this.getTablePrefix(tableName);
    
    if (userId && (tableName === TableNames.USER_PREFERENCES || tableName === TableNames.TOKENS)) {
      return `${prefix}:${userId}:${identifier}`;
    }
    
    return `${prefix}:${identifier}`;
  }

  /**
   * Get table prefix for key generation
   */
  static getTablePrefix(tableName: string): string {
    switch (tableName) {
      case TableNames.TOKENS:
        return 'token';
      case TableNames.USER_PREFERENCES:
        return 'pref';
      case TableNames.APP_SETTINGS:
        return 'setting';
      case TableNames.API_CACHE:
        return 'cache';
      case TableNames.METADATA:
        return 'meta';
      default:
        return 'data';
    }
  }

  /**
   * Validate key format
   */
  static isValidKey(key: string): boolean {
    if (!key || typeof key !== 'string' || key.length === 0) {
      return false;
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (invalidChars.test(key)) {
      return false;
    }

    // Check length (reasonable limit)
    if (key.length > 250) {
      return false;
    }

    return true;
  }

  // =================== Error Handling ===================

  /**
   * Create standardized storage error
   */
  static createError(
    code: string,
    message: string,
    originalError?: Error,
    context?: Record<string, any>
  ): StorageError {
    return {
      code,
      message,
      originalError,
      context,
    };
  }

  /**
   * Create operation-specific error
   */
  static createOperationError(
    operation: 'get' | 'set' | 'remove' | 'clear' | 'batch' | 'query' | 'transaction',
    keys: string[],
    originalError: Error,
    retryable = false,
    retryDelay = 1000
  ): StorageOperationError {
    return {
      code: `${operation.toUpperCase()}_FAILED`,
      message: `${operation} operation failed`,
      operation,
      keys,
      originalError,
      retryable,
      retryDelay,
    };
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: Error): boolean {
    const retryableMessages = [
      'database is locked',
      'quota exceeded',
      'transaction aborted',
      'network error',
      'timeout',
    ];

    const message = error.message.toLowerCase();
    return retryableMessages.some(msg => message.includes(msg));
  }

  // =================== Data Serialization ===================

  /**
   * Serialize value for storage
   */
  static serialize(value: any, useCompression = false): string {
    try {
      const serialized = JSON.stringify(value);
      
      if (useCompression && serialized.length > 1024) {
        return this.compress(serialized);
      }
      
      return serialized;
    } catch (error) {
      throw new Error(`Serialization failed: ${error}`);
    }
  }

  /**
   * Deserialize value from storage
   */
  static deserialize<T>(data: string, isCompressed = false): T {
    try {
      const decompressed = isCompressed ? this.decompress(data) : data;
      return JSON.parse(decompressed);
    } catch (error) {
      throw new Error(`Deserialization failed: ${error}`);
    }
  }

  /**
   * Check if value should be compressed
   */
  static shouldCompress(value: any, threshold = 1024): boolean {
    try {
      const serialized = JSON.stringify(value);
      return serialized.length > threshold;
    } catch {
      return false;
    }
  }

  /**
   * Simple compression using built-in compression
   */
  static compress(data: string): string {
    // Basic compression implementation
    // In a real implementation, you might use pako or another compression library
    try {
      // For now, just return the original data with a compression marker
      return `__COMPRESSED__:${data}`;
    } catch (error) {
      console.warn('[StorageUtils] Compression failed, returning original data');
      return data;
    }
  }

  /**
   * Simple decompression
   */
  static decompress(data: string): string {
    try {
      if (data.startsWith('__COMPRESSED__:')) {
        return data.substring('__COMPRESSED__:'.length);
      }
      return data;
    } catch (error) {
      console.warn('[StorageUtils] Decompression failed, returning original data');
      return data;
    }
  }

  // =================== Performance Utilities ===================

  /**
   * Create performance timer
   */
  static createTimer(): () => PerformanceMetrics {
    const startTime = performance.now();
    let recordCount = 0;
    let dataSize = 0;

    return (count = 1, size = 0): PerformanceMetrics => {
      recordCount += count;
      dataSize += size;
      const duration = performance.now() - startTime;
      
      return {
        duration,
        dataSize,
        recordCount,
        opsPerSecond: recordCount / (duration / 1000),
      };
    };
  }

  /**
   * Estimate data size in bytes
   */
  static estimateSize(value: any): number {
    try {
      return new Blob([JSON.stringify(value)]).size;
    } catch {
      // Fallback calculation
      return JSON.stringify(value).length * 2; // Rough estimate
    }
  }

  /**
   * Create chunks for batch processing
   */
  static createChunks<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    
    return chunks;
  }

  /**
   * Debounce function calls
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Throttle function calls
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // =================== Validation Utilities ===================

  /**
   * Validate storage value
   */
  static isValidValue(value: any): boolean {
    if (value === null || value === undefined) {
      return true; // Allow null/undefined
    }

    try {
      JSON.stringify(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate storage configuration
   */
  static validateConfig(config: any): boolean {
    const required = ['databaseName', 'version'];
    
    for (const field of required) {
      if (!(field in config)) {
        return false;
      }
    }

    if (typeof config.databaseName !== 'string' || config.databaseName.length === 0) {
      return false;
    }

    if (typeof config.version !== 'number' || config.version < 1) {
      return false;
    }

    return true;
  }

  /**
   * Check storage quota
   */
  static async checkStorageQuota(): Promise<{ usage: number; quota: number; available: number }> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const available = quota - usage;

        return { usage, quota, available };
      }
    } catch (error) {
      console.warn('[StorageUtils] Storage quota check failed:', error);
    }

    // Fallback values
    return {
      usage: 0,
      quota: 0,
      available: 0,
    };
  }

  // =================== Migration Utilities ===================

  /**
   * Check if migration is needed
   */
  static needsMigration(currentVersion: number, targetVersion: number): boolean {
    return currentVersion < targetVersion;
  }

  /**
   * Generate migration plan
   */
  static createMigrationPlan(
    currentVersion: number,
    targetVersion: number
  ): { from: number; to: number; steps: number[] } {
    const steps: number[] = [];
    
    for (let v = currentVersion + 1; v <= targetVersion; v++) {
      steps.push(v);
    }

    return {
      from: currentVersion,
      to: targetVersion,
      steps,
    };
  }

  // =================== Debug Utilities ===================

  /**
   * Log storage operation for debugging
   */
  static logOperation(
    operation: string,
    key: string,
    value?: any,
    duration?: number
  ): void {
    if (typeof window !== 'undefined' && window.localStorage.getItem('storage-debug') === 'true') {
      console.group(`[StorageUtils] ${operation}`);
      console.log('Key:', key);
      if (value !== undefined) {
        console.log('Value:', value);
      }
      if (duration !== undefined) {
        console.log('Duration:', `${duration}ms`);
      }
      console.groupEnd();
    }
  }

  /**
   * Get storage statistics for debugging
   */
  static async getDebugInfo(): Promise<Record<string, any>> {
    const quota = await this.checkStorageQuota();
    
    return {
      quota,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      indexedDBSupported: typeof indexedDB !== 'undefined',
      storageSupported: typeof Storage !== 'undefined',
    };
  }
}

/**
 * Storage constants
 */
export const STORAGE_CONSTANTS = {
  /** Maximum key length */
  MAX_KEY_LENGTH: 250,
  /** Maximum value size for localStorage fallback (5MB) */
  MAX_LOCALSTORAGE_SIZE: 5 * 1024 * 1024,
  /** Default compression threshold (1KB) */
  COMPRESSION_THRESHOLD: 1024,
  /** Default batch size */
  DEFAULT_BATCH_SIZE: 100,
  /** Default cache TTL (5 minutes) */
  DEFAULT_CACHE_TTL: 5 * 60 * 1000,
  /** Default debounce delay (100ms) */
  DEFAULT_DEBOUNCE_DELAY: 100,
  /** Storage event types */
  EVENT_TYPES: {
    CHANGE: 'change',
    ERROR: 'error',
    QUOTA_EXCEEDED: 'quota-exceeded',
    CONNECTION_LOST: 'connection-lost',
    CONNECTION_RESTORED: 'connection-restored',
  } as const,
} as const;

/**
 * Export utility functions as named exports
 */
export const {
  parseKey,
  generateKey,
  isValidKey,
  createError,
  serialize,
  deserialize,
  estimateSize,
  createChunks,
  debounce,
  throttle,
  isValidValue,
  checkStorageQuota,
  logOperation,
} = StorageUtils;

/**
 * Default export
 */
export default StorageUtils;