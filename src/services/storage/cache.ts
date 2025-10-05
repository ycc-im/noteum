/**
 * Storage cache implementation for performance optimization
 * 
 * This module provides an in-memory cache layer for storage operations
 * to reduce database queries and improve performance. It includes TTL support,
 * LRU eviction, size limits, and smart cache invalidation.
 * 
 * @fileoverview In-memory cache for storage performance
 * @module storage/cache
 */

import { StorageUtils } from './utils';

/**
 * Cache entry interface
 */
export interface CacheEntry<T = any> {
  /** Cached value */
  value: T;
  /** Timestamp when cached */
  timestamp: number;
  /** Expiration timestamp */
  expiresAt: number;
  /** Access count for LRU */
  accessCount: number;
  /** Last access timestamp */
  lastAccessed: number;
  /** Size of cached data in bytes */
  size: number;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  /** Total cache hits */
  hits: number;
  /** Total cache misses */
  misses: number;
  /** Cache hit ratio (0-1) */
  hitRatio: number;
  /** Number of cached items */
  itemCount: number;
  /** Total cache size in bytes */
  totalSize: number;
  /** Evictions due to size limit */
  evictions: number;
  /** Evictions due to TTL */
  expirations: number;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  /** Enable caching */
  enabled: boolean;
  /** Maximum cache size in MB */
  maxSize: number;
  /** Default TTL in milliseconds */
  ttl: number;
  /** Maximum number of entries */
  maxEntries?: number;
  /** Cleanup interval in milliseconds */
  cleanupInterval?: number;
  /** Enable LRU eviction */
  enableLRU?: boolean;
}

/**
 * StorageCache - High-performance in-memory cache
 * 
 * Features:
 * - TTL-based expiration
 * - LRU eviction policy
 * - Size-based limits
 * - Automatic cleanup
 * - Performance statistics
 */
export class StorageCache {
  private cache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRatio: 0,
    itemCount: 0,
    totalSize: 0,
    evictions: 0,
    expirations: 0,
  };
  private config: Required<CacheConfig>;
  private cleanupTimer?: NodeJS.Timeout;
  private maxSizeBytes: number;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      maxSize: config.maxSize ?? 10, // 10MB default
      ttl: config.ttl ?? 5 * 60 * 1000, // 5 minutes default
      maxEntries: config.maxEntries ?? 1000,
      cleanupInterval: config.cleanupInterval ?? 60 * 1000, // 1 minute
      enableLRU: config.enableLRU ?? true,
    };

    this.maxSizeBytes = this.config.maxSize * 1024 * 1024; // Convert MB to bytes
  }

  /**
   * Initialize the cache
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    // Start cleanup timer
    this.startCleanupTimer();
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.config.enabled) {
      return null;
    }

    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRatio();
      return null;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.expirations++;
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    // Update access info for LRU
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    this.stats.hits++;
    this.updateHitRatio();

    return entry.value as T;
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, customTTL?: number): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    // Calculate size
    const size = StorageUtils.estimateSize(value);
    
    // Check if value is too large
    if (size > this.maxSizeBytes * 0.1) { // Don't cache items larger than 10% of max cache size
      return;
    }

    const now = Date.now();
    const ttl = customTTL ?? this.config.ttl;
    
    const entry: CacheEntry<T> = {
      value,
      timestamp: now,
      expiresAt: now + ttl,
      accessCount: 1,
      lastAccessed: now,
      size,
    };

    // Remove existing entry if present
    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key)!;
      this.stats.totalSize -= oldEntry.size;
    }

    // Check cache limits before adding
    await this.ensureCacheSpace(size);

    this.cache.set(key, entry);
    this.stats.totalSize += size;
    this.updateStats();
  }

  /**
   * Check if key exists in cache
   */
  async has(key: string): Promise<boolean> {
    if (!this.config.enabled) {
      return false;
    }

    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.expirations++;
      this.updateStats();
      return false;
    }

    return true;
  }

  /**
   * Remove value from cache
   */
  async remove(key: string): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    const entry = this.cache.get(key);
    if (entry) {
      this.cache.delete(key);
      this.stats.totalSize -= entry.size;
      this.updateStats();
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.stats.totalSize = 0;
    this.stats.itemCount = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Manually trigger cleanup
   */
  async cleanup(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    const now = Date.now();
    const keysToDelete: string[] = [];

    // Find expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    }

    // Remove expired entries
    for (const key of keysToDelete) {
      const entry = this.cache.get(key)!;
      this.cache.delete(key);
      this.stats.totalSize -= entry.size;
      this.stats.expirations++;
    }

    this.updateStats();
  }

  /**
   * Close the cache and cleanup resources
   */
  async close(): Promise<void> {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }

    await this.clear();
  }

  /**
   * Get cache configuration
   */
  getConfig(): CacheConfig {
    return { ...this.config };
  }

  /**
   * Update cache configuration
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.maxSizeBytes = this.config.maxSize * 1024 * 1024;

    // Restart cleanup timer if interval changed
    if (newConfig.cleanupInterval && this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.startCleanupTimer();
    }
  }

  // =================== Private Methods ===================

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    this.stats.itemCount = this.cache.size;
    this.updateHitRatio();
  }

  /**
   * Update hit ratio calculation
   */
  private updateHitRatio(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRatio = total > 0 ? this.stats.hits / total : 0;
  }

  /**
   * Ensure cache has enough space for new entry
   */
  private async ensureCacheSpace(requiredSize: number): Promise<void> {
    // Check size limit
    while (this.stats.totalSize + requiredSize > this.maxSizeBytes) {
      if (!this.evictLRU()) {
        break; // No more entries to evict
      }
    }

    // Check entry count limit
    if (this.config.maxEntries) {
      while (this.cache.size >= this.config.maxEntries) {
        if (!this.evictLRU()) {
          break; // No more entries to evict
        }
      }
    }
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): boolean {
    if (this.cache.size === 0) {
      return false;
    }

    let lruKey: string | null = null;
    let lruEntry: CacheEntry | null = null;

    // Find LRU entry
    for (const [key, entry] of this.cache.entries()) {
      if (!lruEntry || entry.lastAccessed < lruEntry.lastAccessed) {
        lruKey = key;
        lruEntry = entry;
      }
    }

    if (lruKey && lruEntry) {
      this.cache.delete(lruKey);
      this.stats.totalSize -= lruEntry.size;
      this.stats.evictions++;
      this.updateStats();
      return true;
    }

    return false;
  }

  /**
   * Start automatic cleanup timer
   */
  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup().catch(error => {
        console.error('[StorageCache] Automatic cleanup failed:', error);
      });
    }, this.config.cleanupInterval);
  }
}

/**
 * Cache manager for multiple cache instances
 */
export class CacheManager {
  private caches = new Map<string, StorageCache>();

  /**
   * Create or get named cache instance
   */
  getCache(name: string, config?: Partial<CacheConfig>): StorageCache {
    if (!this.caches.has(name)) {
      const cache = new StorageCache(config);
      this.caches.set(name, cache);
    }
    
    return this.caches.get(name)!;
  }

  /**
   * Remove named cache instance
   */
  async removeCache(name: string): Promise<void> {
    const cache = this.caches.get(name);
    if (cache) {
      await cache.close();
      this.caches.delete(name);
    }
  }

  /**
   * Get all cache statistics
   */
  getAllStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    
    for (const [name, cache] of this.caches.entries()) {
      stats[name] = cache.getStats();
    }
    
    return stats;
  }

  /**
   * Clean up all caches
   */
  async cleanupAll(): Promise<void> {
    const cleanupPromises = Array.from(this.caches.values()).map(cache => cache.cleanup());
    await Promise.all(cleanupPromises);
  }

  /**
   * Close all caches
   */
  async closeAll(): Promise<void> {
    const closePromises = Array.from(this.caches.values()).map(cache => cache.close());
    await Promise.all(closePromises);
    this.caches.clear();
  }
}

/**
 * Default cache manager instance
 */
export const defaultCacheManager = new CacheManager();

/**
 * Cache utility functions
 */
export const CacheUtils = {
  /**
   * Create cache key with namespace
   */
  createKey(namespace: string, key: string): string {
    return `${namespace}:${key}`;
  },

  /**
   * Parse cache key to extract namespace
   */
  parseKey(cacheKey: string): { namespace: string; key: string } | null {
    const parts = cacheKey.split(':');
    if (parts.length < 2) {
      return null;
    }
    
    return {
      namespace: parts[0],
      key: parts.slice(1).join(':'),
    };
  },

  /**
   * Calculate optimal TTL based on data characteristics
   */
  calculateOptimalTTL(
    dataSize: number,
    accessFrequency: 'low' | 'medium' | 'high',
    dataVolatility: 'static' | 'dynamic' | 'volatile'
  ): number {
    const baseTTL = 5 * 60 * 1000; // 5 minutes
    
    let multiplier = 1;
    
    // Adjust based on access frequency
    switch (accessFrequency) {
      case 'high':
        multiplier *= 2; // Cache longer for frequently accessed data
        break;
      case 'low':
        multiplier *= 0.5; // Cache shorter for rarely accessed data
        break;
    }
    
    // Adjust based on data volatility
    switch (dataVolatility) {
      case 'static':
        multiplier *= 4; // Cache much longer for static data
        break;
      case 'volatile':
        multiplier *= 0.25; // Cache very short for volatile data
        break;
    }
    
    // Adjust based on data size (smaller data can be cached longer)
    if (dataSize < 1024) { // Less than 1KB
      multiplier *= 1.5;
    } else if (dataSize > 100 * 1024) { // More than 100KB
      multiplier *= 0.5;
    }
    
    return Math.round(baseTTL * multiplier);
  },
};

/**
 * Default export
 */
export default StorageCache;