/**
 * Token encryption service for secure token storage
 * 
 * This module provides encryption/decryption capabilities for token storage
 * using Web Crypto API for maximum security in browser environments.
 * 
 * @fileoverview Token encryption utilities for secure storage
 * @module storage/token-encryption
 */

/**
 * Token encryption configuration
 */
export interface TokenEncryptionConfig {
  /** Encryption algorithm to use */
  algorithm: 'AES-GCM' | 'AES-CBC';
  /** Key length in bits */
  keyLength: 128 | 192 | 256;
  /** Derive encryption key from a master key */
  deriveKey: boolean;
  /** Salt for key derivation */
  salt?: Uint8Array;
}

/**
 * Encrypted token data structure
 */
export interface EncryptedTokenData {
  /** Encrypted data */
  data: ArrayBuffer;
  /** Initialization vector */
  iv: Uint8Array;
  /** Authentication tag (for GCM mode) */
  tag?: Uint8Array;
  /** Salt used for key derivation */
  salt?: Uint8Array;
  /** Algorithm used for encryption */
  algorithm: string;
}

/**
 * Token encryption service class
 */
export class TokenEncryptionService {
  private config: TokenEncryptionConfig;
  private masterKey: CryptoKey | null = null;
  private encryptionKey: CryptoKey | null = null;

  constructor(config: Partial<TokenEncryptionConfig> = {}) {
    this.config = {
      algorithm: 'AES-GCM',
      keyLength: 256,
      deriveKey: true,
      ...config,
    };
  }

  /**
   * Initialize the encryption service with a master key
   */
  async initialize(password?: string): Promise<void> {
    try {
      if (password) {
        // Derive master key from password
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
          'raw',
          encoder.encode(password),
          'PBKDF2',
          false,
          ['deriveKey']
        );

        const salt = this.config.salt || crypto.getRandomValues(new Uint8Array(16));
        this.masterKey = await crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256',
          },
          keyMaterial,
          {
            name: this.config.algorithm,
            length: this.config.keyLength,
          },
          false,
          ['encrypt', 'decrypt']
        );

        if (!this.config.salt) {
          this.config.salt = salt;
        }
      } else {
        // Generate a random master key
        this.masterKey = await crypto.subtle.generateKey(
          {
            name: this.config.algorithm,
            length: this.config.keyLength,
          },
          false,
          ['encrypt', 'decrypt']
        );
      }

      this.encryptionKey = this.masterKey;
    } catch (error) {
      throw new Error(`Failed to initialize token encryption: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Encrypt a token value
   */
  async encryptToken(token: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initialize();
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(token);
      const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM

      const encrypted = await crypto.subtle.encrypt(
        {
          name: this.config.algorithm,
          iv,
        },
        this.encryptionKey!,
        data
      );

      const encryptedData: EncryptedTokenData = {
        data: encrypted,
        iv,
        algorithm: this.config.algorithm,
        salt: this.config.salt,
      };

      // Convert to base64 for storage
      return this.serializeEncryptedData(encryptedData);
    } catch (error) {
      throw new Error(`Failed to encrypt token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decrypt a token value
   */
  async decryptToken(encryptedToken: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initialize();
    }

    try {
      const encryptedData = this.deserializeEncryptedData(encryptedToken);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: encryptedData.algorithm,
          iv: encryptedData.iv,
        },
        this.encryptionKey!,
        encryptedData.data
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      throw new Error(`Failed to decrypt token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if Web Crypto API is available
   */
  static isAvailable(): boolean {
    return typeof crypto !== 'undefined' && 
           typeof crypto.subtle !== 'undefined' &&
           typeof crypto.getRandomValues !== 'undefined';
  }

  /**
   * Generate a secure random salt
   */
  static generateSalt(length: number = 16): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  /**
   * Serialize encrypted data to base64 string
   */
  private serializeEncryptedData(data: EncryptedTokenData): string {
    const serialized = {
      data: this.arrayBufferToBase64(data.data),
      iv: this.uint8ArrayToBase64(data.iv),
      algorithm: data.algorithm,
      salt: data.salt ? this.uint8ArrayToBase64(data.salt) : undefined,
    };

    return btoa(JSON.stringify(serialized));
  }

  /**
   * Deserialize encrypted data from base64 string
   */
  private deserializeEncryptedData(serialized: string): EncryptedTokenData {
    try {
      const parsed = JSON.parse(atob(serialized));
      
      return {
        data: this.base64ToArrayBuffer(parsed.data),
        iv: this.base64ToUint8Array(parsed.iv),
        algorithm: parsed.algorithm,
        salt: parsed.salt ? this.base64ToUint8Array(parsed.salt) : undefined,
      };
    } catch (error) {
      throw new Error(`Failed to deserialize encrypted data: ${error instanceof Error ? error.message : 'Invalid format'}`);
    }
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary);
  }

  /**
   * Convert base64 string to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return buffer;
  }

  /**
   * Convert Uint8Array to base64 string
   */
  private uint8ArrayToBase64(array: Uint8Array): string {
    let binary = '';
    for (const byte of array) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary);
  }

  /**
   * Convert base64 string to Uint8Array
   */
  private base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return array;
  }
}

/**
 * Default token encryption service instance
 */
export const defaultTokenEncryption = new TokenEncryptionService();

/**
 * Convenience functions for quick encryption/decryption
 */
export async function encryptToken(token: string, password?: string): Promise<string> {
  const service = new TokenEncryptionService();
  await service.initialize(password);
  return service.encryptToken(token);
}

export async function decryptToken(encryptedToken: string, password?: string): Promise<string> {
  const service = new TokenEncryptionService();
  await service.initialize(password);
  return service.decryptToken(encryptedToken);
}