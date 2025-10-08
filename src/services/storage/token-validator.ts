/**
 * Token validator service for token validation and security checks
 *
 * This module provides comprehensive token validation capabilities including
 * expiration checks, format validation, and security policy enforcement.
 *
 * @fileoverview Token validation utilities for secure storage
 * @module storage/token-validator
 */

import type { TokenRecord } from './types';

/**
 * Token validation configuration
 */
export interface TokenValidationConfig {
  /** Maximum token age in milliseconds */
  maxAge?: number;
  /** Minimum token length */
  minLength?: number;
  /** Maximum token length */
  maxLength?: number;
  /** Required token format patterns */
  patterns?: Record<string, RegExp>;
  /** Enable strict validation mode */
  strict?: boolean;
  /** Grace period for expired tokens in milliseconds */
  gracePeriod?: number;
}

/**
 * Token validation result
 */
export interface TokenValidationResult {
  /** Validation success status */
  valid: boolean;
  /** Validation error messages */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
  /** Token metadata */
  metadata?: {
    /** Token age in milliseconds */
    age?: number;
    /** Time until expiration in milliseconds */
    expiresIn?: number;
    /** Token type detected */
    type?: string;
    /** Security score (0-100) */
    securityScore?: number;
  };
}

/**
 * Token security policy
 */
export interface TokenSecurityPolicy {
  /** Require token encryption */
  requireEncryption: boolean;
  /** Maximum allowed token age */
  maxTokenAge: number;
  /** Minimum security score required */
  minSecurityScore: number;
  /** Allowed token types */
  allowedTypes: string[];
  /** Block suspicious tokens */
  blockSuspicious: boolean;
}

/**
 * Token validator service class
 */
export class TokenValidatorService {
  private config: TokenValidationConfig;
  private securityPolicy: TokenSecurityPolicy;

  constructor(
    config: Partial<TokenValidationConfig> = {},
    securityPolicy: Partial<TokenSecurityPolicy> = {}
  ) {
    this.config = {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      minLength: 10,
      maxLength: 4096,
      patterns: {
        jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
        bearer: /^Bearer\s+[A-Za-z0-9\-_\.]+$/i,
        basic: /^Basic\s+[A-Za-z0-9+/=]+$/i,
        api_key: /^[A-Za-z0-9]{20,}$/,
      },
      strict: false,
      gracePeriod: 5 * 60 * 1000, // 5 minutes
      ...config,
    };

    this.securityPolicy = {
      requireEncryption: true,
      maxTokenAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      minSecurityScore: 70,
      allowedTypes: ['access', 'refresh', 'api'],
      blockSuspicious: true,
      ...securityPolicy,
    };
  }

  /**
   * Validate a token string
   */
  async validateToken(
    token: string,
    type?: string
  ): Promise<TokenValidationResult> {
    const result: TokenValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      metadata: {},
    };

    // Basic length validation
    if (token.length < this.config.minLength!) {
      result.errors.push(`Token too short (min: ${this.config.minLength})`);
      result.valid = false;
    }

    if (token.length > this.config.maxLength!) {
      result.errors.push(`Token too long (max: ${this.config.maxLength})`);
      result.valid = false;
    }

    // Format validation
    if (type && this.config.patterns![type]) {
      if (!this.config.patterns![type].test(token)) {
        result.errors.push(
          `Token does not match expected format for type: ${type}`
        );
        result.valid = false;
      }
    }

    // Detect token type if not provided
    if (!type) {
      type = this.detectTokenType(token);
      result.metadata!.type = type;
    }

    // Security score calculation
    result.metadata!.securityScore = this.calculateSecurityScore(token, type);

    // Apply security policy
    const policyResult = this.applySecurityPolicy(
      token,
      type,
      result.metadata!.securityScore!
    );
    if (!policyResult.valid) {
      result.errors.push(...policyResult.errors);
      result.warnings.push(...policyResult.warnings);
      result.valid = false;
    }

    return result;
  }

  /**
   * Validate a token record
   */
  async validateTokenRecord(
    record: TokenRecord
  ): Promise<TokenValidationResult> {
    const result = await this.validateToken(record.value, record.type);

    // Check expiration
    if (record.expiredAt) {
      const now = new Date();
      const expirationTime = new Date(record.expiredAt);
      const timeUntilExpiration = expirationTime.getTime() - now.getTime();

      result.metadata!.expiresIn = timeUntilExpiration;

      if (timeUntilExpiration < 0) {
        const expiredFor = Math.abs(timeUntilExpiration);
        if (expiredFor > (this.config.gracePeriod || 0)) {
          result.errors.push(
            `Token expired ${Math.floor(expiredFor / 60000)} minutes ago`
          );
          result.valid = false;
        } else {
          result.warnings.push(`Token expired recently (within grace period)`);
        }
      } else if (timeUntilExpiration < 5 * 60 * 1000) {
        result.warnings.push(
          `Token expires soon (in ${Math.floor(timeUntilExpiration / 60000)} minutes)`
        );
      }
    }

    // Check token age
    const age = Date.now() - new Date(record.createdAt).getTime();
    result.metadata!.age = age;

    if (age > (this.config.maxAge || 0)) {
      result.warnings.push(`Token is older than recommended maximum age`);
    }

    return result;
  }

  /**
   * Check if a token is expired
   */
  isTokenExpired(record: TokenRecord): boolean {
    if (!record.expiredAt) {
      return false;
    }

    const now = new Date();
    const expirationTime = new Date(record.expiredAt);
    const gracePeriod = this.config.gracePeriod || 0;

    return expirationTime.getTime() + gracePeriod < now.getTime();
  }

  /**
   * Check if a token needs refresh
   */
  needsRefresh(
    record: TokenRecord,
    refreshThreshold: number = 5 * 60 * 1000
  ): boolean {
    if (!record.expiredAt) {
      return false;
    }

    const now = new Date();
    const expirationTime = new Date(record.expiredAt);
    const timeUntilExpiration = expirationTime.getTime() - now.getTime();

    return timeUntilExpiration <= refreshThreshold && timeUntilExpiration > 0;
  }

  /**
   * Sanitize a token value for logging
   */
  sanitizeTokenForLogging(token: string): string {
    if (token.length <= 10) {
      return '*'.repeat(token.length);
    }

    const start = token.slice(0, 4);
    const end = token.slice(-4);
    const middle = '*'.repeat(Math.max(0, token.length - 8));

    return `${start}${middle}${end}`;
  }

  /**
   * Detect token type based on format
   */
  private detectTokenType(token: string): string {
    for (const [type, pattern] of Object.entries(this.config.patterns!)) {
      if (pattern.test(token)) {
        return type;
      }
    }
    return 'unknown';
  }

  /**
   * Calculate security score for a token
   */
  private calculateSecurityScore(token: string, type: string): number {
    let score = 50; // Base score

    // Length bonus
    if (token.length >= 32) score += 20;
    else if (token.length >= 16) score += 10;

    // Complexity bonus
    const hasNumbers = /\d/.test(token);
    const hasLower = /[a-z]/.test(token);
    const hasUpper = /[A-Z]/.test(token);
    const hasSpecial = /[^A-Za-z0-9]/.test(token);

    const complexity = [hasNumbers, hasLower, hasUpper, hasSpecial].filter(
      Boolean
    ).length;
    score += complexity * 5;

    // Type bonus
    if (type === 'jwt') score += 15;
    else if (type === 'api_key') score += 10;

    // Entropy estimation (simplified)
    const uniqueChars = new Set(token).size;
    const entropyBonus = Math.min(15, Math.floor(uniqueChars / 4));
    score += entropyBonus;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Apply security policy to token validation
   */
  private applySecurityPolicy(
    token: string,
    type: string,
    securityScore: number
  ): TokenValidationResult {
    const result: TokenValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    };

    // Check security score
    if (securityScore < this.securityPolicy.minSecurityScore) {
      result.errors.push(
        `Token security score too low: ${securityScore} (min: ${this.securityPolicy.minSecurityScore})`
      );
      result.valid = false;
    }

    // Check allowed types
    if (
      type &&
      !this.securityPolicy.allowedTypes.includes(type) &&
      type !== 'unknown'
    ) {
      result.errors.push(`Token type not allowed: ${type}`);
      result.valid = false;
    }

    // Suspicious pattern detection
    if (this.securityPolicy.blockSuspicious) {
      const suspiciousPatterns = [
        /(.)\1{10,}/, // Repeated characters
        /^(test|demo|example|default)/i, // Test tokens
        /^(password|secret|key)/i, // Obvious keywords
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(token)) {
          result.warnings.push('Token matches suspicious pattern');
          if (this.config.strict) {
            result.errors.push('Suspicious token pattern detected');
            result.valid = false;
          }
          break;
        }
      }
    }

    return result;
  }

  /**
   * Update validation configuration
   */
  updateConfig(config: Partial<TokenValidationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Update security policy
   */
  updateSecurityPolicy(policy: Partial<TokenSecurityPolicy>): void {
    this.securityPolicy = { ...this.securityPolicy, ...policy };
  }
}

/**
 * Default token validator instance
 */
export const defaultTokenValidator = new TokenValidatorService();

/**
 * Convenience functions for common validation tasks
 */
export async function validateToken(
  token: string,
  type?: string
): Promise<TokenValidationResult> {
  return defaultTokenValidator.validateToken(token, type);
}

export async function validateTokenRecord(
  record: TokenRecord
): Promise<TokenValidationResult> {
  return defaultTokenValidator.validateTokenRecord(record);
}

export function isTokenExpired(record: TokenRecord): boolean {
  return defaultTokenValidator.isTokenExpired(record);
}

export function needsTokenRefresh(
  record: TokenRecord,
  threshold?: number
): boolean {
  return defaultTokenValidator.needsRefresh(record, threshold);
}

export function sanitizeToken(token: string): string {
  return defaultTokenValidator.sanitizeTokenForLogging(token);
}
