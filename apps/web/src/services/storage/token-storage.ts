/**
 * TokenStorageService - Specialized service for secure token management
 * 
 * This module provides a comprehensive token storage solution built on top of
 * the existing storage infrastructure. It includes encryption, validation,
 * expiration management, and maintains backward compatibility with localStorage APIs.
 * 
 * @fileoverview Token storage service implementation
 * @module storage/token-storage
 */

import type { TokenRecord } from './schema';
import { TableNames } from './schema';
import { NoteumDB, getDatabase } from './database';
import { TokenEncryptionService } from './token-encryption';
import { TokenValidatorService, type TokenValidationResult } from './token-validator';
import { DexieStorageAdapter } from './dexie-adapter';

/**
 * Token storage configuration
 */
export interface TokenStorageConfig {
  /** Enable token encryption */
  enableEncryption: boolean;
  /** Encryption password for tokens */
  encryptionPassword?: string;
  /** Enable token validation */
  enableValidation: boolean;
  /** Enable automatic cleanup of expired tokens */
  enableAutoCleanup: boolean;
  /** Default token expiration time in milliseconds */
  defaultExpirationMs: number;
  /** Grace period for expired tokens in milliseconds */
  gracePeriodMs: number;
  /** Maximum number of tokens per user */
  maxTokensPerUser: number;
  /** Enable in-memory caching */
  enableCaching: boolean;
  /** Cache TTL in milliseconds */
  cacheTtlMs: number;
}

/**
 * Token metadata interface
 */
export interface TokenMetadata {
  /** Token creation timestamp */
  createdAt: Date;
  /** Token last access timestamp */
  lastUsed?: Date;
  /** Token type */
  type?: string;
  /** Associated user ID */
  userId?: string;
  /** Token validation result */
  validation?: TokenValidationResult;
  /** Token security score */
  securityScore?: number;
}

/**
 * Batch token operation interface
 */
export interface TokenBatchOperation {
  /** Operation type */
  type: 'set' | 'remove';
  /** Token key */
  key: string;
  /** Token value (for set operations) */
  value?: string;
  /** Token expiration (for set operations) */
  expiredAt?: Date;
  /** Token type (for set operations) */
  tokenType?: string;
  /** User ID (for set operations) */
  userId?: string;
}

/**
 * Token storage statistics
 */
export interface TokenStorageStats {
  /** Total number of tokens */
  totalTokens: number;
  /** Number of expired tokens */
  expiredTokens: number;
  /** Number of tokens by type */
  tokensByType: Record<string, number>;
  /** Number of tokens by user */
  tokensByUser: Record<string, number>;
  /** Average token age in milliseconds */
  averageTokenAge: number;
  /** Storage size in bytes */
  storageSize: number;
  /** Last cleanup timestamp */
  lastCleanup?: Date;
}

/**
 * TokenStorageService - Comprehensive token management service
 * 
 * Features:
 * - Backward compatible with localStorage token APIs
 * - Enhanced security with encryption and validation
 * - Multi-user support with user isolation
 * - Automatic expiration management
 * - Batch operations for performance
 * - Comprehensive monitoring and statistics
 */
export class TokenStorageService {
  private db: NoteumDB;
  private encryption: TokenEncryptionService;
  private validator: TokenValidatorService;
  private adapter: DexieStorageAdapter;
  private config: Required<TokenStorageConfig>;
  private cache: Map<string, { value: string; timestamp: number }> = new Map();
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: Partial<TokenStorageConfig> = {}) {
    this.config = {
      enableEncryption: true,
      enableValidation: true,
      enableAutoCleanup: true,
      defaultExpirationMs: 24 * 60 * 60 * 1000, // 24 hours
      gracePeriodMs: 5 * 60 * 1000, // 5 minutes
      maxTokensPerUser: 100,
      enableCaching: true,
      cacheTtlMs: 5 * 60 * 1000, // 5 minutes
      ...config,
    };

    this.db = getDatabase();
    this.encryption = new TokenEncryptionService();
    this.validator = new TokenValidatorService();
    this.adapter = new DexieStorageAdapter();
  }

  /**
   * Initialize the token storage service
   */
  async initialize(): Promise<void> {
    try {
      // Initialize encryption if enabled
      if (this.config.enableEncryption) {
        await this.encryption.initialize(this.config.encryptionPassword);
      }

      // Start automatic cleanup if enabled
      if (this.config.enableAutoCleanup) {
        this.startAutoCleanup();
      }
    } catch (error) {
      throw new Error(`Failed to initialize TokenStorageService: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =================== Backward Compatible localStorage API ===================

  /**
   * Set a token (backward compatible with localStorage API)
   */
  async setToken(key: string, token: string, expiry?: number): Promise<void> {
    const expiredAt = expiry ? new Date(expiry) : new Date(Date.now() + this.config.defaultExpirationMs);
    return this.setTokenWithMetadata(key, token, { expiredAt });
  }

  /**
   * Get a token (backward compatible with localStorage API)
   */
  async getToken(key: string): Promise<string | null> {
    try {
      // Check cache first if enabled
      if (this.config.enableCaching) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.config.cacheTtlMs) {
          return cached.value;
        }
      }

      const record = await this.db.tokens.get(key);
      if (!record) {
        return null;
      }

      // Check if token is expired
      if (this.validator.isTokenExpired(record)) {
        await this.removeToken(key);
        return null;
      }

      // Decrypt token if encryption is enabled
      let token = record.value;
      if (this.config.enableEncryption) {
        token = await this.encryption.decryptToken(record.value);
      }

      // Update cache if enabled
      if (this.config.enableCaching) {
        this.cache.set(key, { value: token, timestamp: Date.now() });
      }

      // Update last used timestamp
      await this.db.tokens.update(key, { 
        createdAt: new Date() // Update access time 
      });

      return token;
    } catch (error) {
      console.error(`Failed to get token ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove a token (backward compatible with localStorage API)
   */
  async removeToken(key: string): Promise<void> {
    try {
      await this.db.tokens.delete(key);
      this.cache.delete(key);
    } catch (error) {
      throw new Error(`Failed to remove token ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clear all tokens (backward compatible with localStorage API)
   */
  async clearTokens(): Promise<void> {
    try {
      await this.db.tokens.clear();
      this.cache.clear();
    } catch (error) {
      throw new Error(`Failed to clear tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =================== Enhanced API ===================

  /**
   * Set a token with full metadata support
   */
  async setTokenWithMetadata(
    key: string,
    token: string,
    metadata: Partial<Pick<TokenRecord, 'expiredAt' | 'type' | 'userId'>> = {}
  ): Promise<void> {
    try {
      // Validate token if validation is enabled
      if (this.config.enableValidation) {
        const validation = await this.validator.validateToken(token, metadata.type);
        if (!validation.valid) {
          throw new Error(`Token validation failed: ${validation.errors.join(', ')}`);
        }
      }

      // Encrypt token if encryption is enabled
      let encryptedToken = token;
      if (this.config.enableEncryption) {
        encryptedToken = await this.encryption.encryptToken(token);
      }

      // Create token record
      const record: TokenRecord = {
        key,
        value: encryptedToken,
        createdAt: new Date(),
        expiredAt: metadata.expiredAt || new Date(Date.now() + this.config.defaultExpirationMs),
        type: metadata.type,
        userId: metadata.userId,
      };

      // Check user token limit
      if (metadata.userId) {
        const userTokenCount = await this.db.tokens
          .where('userId')
          .equals(metadata.userId)
          .count();

        if (userTokenCount >= this.config.maxTokensPerUser) {
          throw new Error(`User ${metadata.userId} has reached maximum token limit (${this.config.maxTokensPerUser})`);
        }
      }

      // Store token
      await this.db.tokens.put(record);

      // Update cache if enabled
      if (this.config.enableCaching) {
        this.cache.set(key, { value: token, timestamp: Date.now() });
      }
    } catch (error) {
      throw new Error(`Failed to set token ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Set a user-specific token
   */
  async setUserToken(userId: string, tokenType: string, token: string, expiredAt?: Date): Promise<void> {
    const key = `${userId}:${tokenType}`;
    return this.setTokenWithMetadata(key, token, { userId, type: tokenType, expiredAt });
  }

  /**
   * Get all tokens for a specific user
   */
  async getUserTokens(userId: string): Promise<Record<string, string>> {
    try {
      const records = await this.db.tokens
        .where('userId')
        .equals(userId)
        .toArray();

      const tokens: Record<string, string> = {};

      for (const record of records) {
        if (!this.validator.isTokenExpired(record)) {
          let token = record.value;
          if (this.config.enableEncryption) {
            token = await this.encryption.decryptToken(record.value);
          }
          // Use token type as key instead of full key
          const tokenKey = record.type || record.key.split(':').pop() || record.key;
          tokens[tokenKey] = token;
        }
      }

      return tokens;
    } catch (error) {
      throw new Error(`Failed to get tokens for user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if a token is expired
   */
  async isTokenExpired(key: string): Promise<boolean> {
    try {
      const record = await this.db.tokens.get(key);
      if (!record) {
        return true;
      }
      return this.validator.isTokenExpired(record);
    } catch (error) {
      console.error(`Failed to check token expiration for ${key}:`, error);
      return true;
    }
  }

  /**
   * Refresh a token if it needs refreshing
   */
  async refreshTokenIfNeeded(key: string, refreshThreshold: number = 5 * 60 * 1000): Promise<string | null> {
    try {
      const record = await this.db.tokens.get(key);
      if (!record) {
        return null;
      }

      if (this.validator.needsRefresh(record, refreshThreshold)) {
        // Token needs refresh - this is a placeholder for refresh logic
        // In a real implementation, this would call a refresh endpoint
        console.warn(`Token ${key} needs refresh but no refresh logic implemented`);
        return null;
      }

      return this.getToken(key);
    } catch (error) {
      console.error(`Failed to refresh token ${key}:`, error);
      return null;
    }
  }

  // =================== Batch Operations ===================

  /**
   * Perform batch token operations
   */
  async batchTokenOperations(operations: TokenBatchOperation[]): Promise<void> {
    try {
      await this.db.transaction('rw', this.db.tokens, async () => {
        for (const op of operations) {
          switch (op.type) {
            case 'set':
              if (op.value) {
                await this.setTokenWithMetadata(op.key, op.value, {
                  expiredAt: op.expiredAt,
                  type: op.tokenType,
                  userId: op.userId,
                });
              }
              break;
            case 'remove':
              await this.removeToken(op.key);
              break;
          }
        }
      });
    } catch (error) {
      throw new Error(`Batch token operations failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // =================== Security and Validation ===================

  /**
   * Validate a token
   */
  async validateToken(token: string, type?: string): Promise<TokenValidationResult> {
    return this.validator.validateToken(token, type);
  }

  /**
   * Get token metadata
   */
  async getTokenMetadata(key: string): Promise<TokenMetadata | null> {
    try {
      const record = await this.db.tokens.get(key);
      if (!record) {
        return null;
      }

      return {
        createdAt: record.createdAt,
        type: record.type,
        userId: record.userId,
      };
    } catch (error) {
      console.error(`Failed to get token metadata for ${key}:`, error);
      return null;
    }
  }

  // =================== Utility Methods ===================

  /**
   * Get token storage statistics
   */
  async getStorageStats(): Promise<TokenStorageStats> {
    try {
      const allTokens = await this.db.tokens.toArray();
      const now = Date.now();

      const stats: TokenStorageStats = {
        totalTokens: allTokens.length,
        expiredTokens: 0,
        tokensByType: {},
        tokensByUser: {},
        averageTokenAge: 0,
        storageSize: 0,
      };

      let totalAge = 0;

      for (const token of allTokens) {
        // Count expired tokens
        if (this.validator.isTokenExpired(token)) {
          stats.expiredTokens++;
        }

        // Count by type
        const type = token.type || 'unknown';
        stats.tokensByType[type] = (stats.tokensByType[type] || 0) + 1;

        // Count by user
        const userId = token.userId || 'anonymous';
        stats.tokensByUser[userId] = (stats.tokensByUser[userId] || 0) + 1;

        // Calculate age
        const age = now - token.createdAt.getTime();
        totalAge += age;

        // Estimate storage size
        stats.storageSize += token.key.length + token.value.length;
      }

      if (allTokens.length > 0) {
        stats.averageTokenAge = totalAge / allTokens.length;
      }

      return stats;
    } catch (error) {
      throw new Error(`Failed to get storage stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clean up expired tokens
   */
  async cleanupExpiredTokens(): Promise<number> {
    try {
      const expiredTokens = await this.db.tokens
        .filter(token => this.validator.isTokenExpired(token))
        .toArray();

      if (expiredTokens.length > 0) {
        const expiredKeys = expiredTokens.map(token => token.key);
        await this.db.tokens.bulkDelete(expiredKeys);

        // Clear cache entries for expired tokens
        for (const key of expiredKeys) {
          this.cache.delete(key);
        }
      }

      return expiredTokens.length;
    } catch (error) {
      console.error('Failed to cleanup expired tokens:', error);
      return 0;
    }
  }

  /**
   * Start automatic cleanup of expired tokens
   */
  private startAutoCleanup(): void {
    const cleanupInterval = 60 * 60 * 1000; // 1 hour

    this.cleanupTimer = setInterval(async () => {
      try {
        const removed = await this.cleanupExpiredTokens();
        if (removed > 0) {
          console.log(`TokenStorageService: Cleaned up ${removed} expired tokens`);
        }
      } catch (error) {
        console.error('Automatic token cleanup failed:', error);
      }
    }, cleanupInterval);
  }

  /**
   * Stop automatic cleanup
   */
  stop(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  /**
   * Get all token keys
   */
  async getAllTokenKeys(): Promise<string[]> {
    try {
      return await this.db.tokens.orderBy('key').primaryKeys();
    } catch (error) {
      throw new Error(`Failed to get all token keys: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if a token exists
   */
  async tokenExists(key: string): Promise<boolean> {
    try {
      const record = await this.db.tokens.get(key);
      return !!record && !this.validator.isTokenExpired(record);
    } catch (error) {
      console.error(`Failed to check token existence for ${key}:`, error);
      return false;
    }
  }
}

/**
 * Default token storage service instance
 */
export const defaultTokenStorage = new TokenStorageService();

/**
 * Convenience functions for backward compatibility
 */
export async function setToken(key: string, token: string, expiry?: number): Promise<void> {
  return defaultTokenStorage.setToken(key, token, expiry);
}

export async function getToken(key: string): Promise<string | null> {
  return defaultTokenStorage.getToken(key);
}

export async function removeToken(key: string): Promise<void> {
  return defaultTokenStorage.removeToken(key);
}

export async function clearTokens(): Promise<void> {
  return defaultTokenStorage.clearTokens();
}

export async function setUserToken(userId: string, tokenType: string, token: string): Promise<void> {
  return defaultTokenStorage.setUserToken(userId, tokenType, token);
}

export async function getUserTokens(userId: string): Promise<Record<string, string>> {
  return defaultTokenStorage.getUserTokens(userId);
}