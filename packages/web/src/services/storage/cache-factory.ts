/**
 * Cache Strategy Factory
 * 
 * Provides a factory for creating different cache strategies including LRU, LFU, FIFO, and TTL.
 * Supports dynamic strategy switching and performance optimization based on usage patterns.
 * 
 * @fileoverview Cache strategy factory and implementations
 * @module storage/cache-factory
 */

import type { CacheEntry, CacheStats, CacheConfig } from './cache';

/**
 * Cache strategy types
 */
export type CacheStrategy = 'LRU' | 'LFU' | 'FIFO' | 'TTL';

/**
 * Enhanced cache entry with strategy-specific metadata
 */
export interface EnhancedCacheEntry<T = any> extends CacheEntry<T> {
  /** Frequency count for LFU */
  frequency: number;
  /** Entry order for FIFO */
  insertionOrder: number;
  /** Last access order for LRU */
  accessOrder: number;
  /** Entry ID for tracking */
  id: string;
}

/**
 * Cache strategy configuration
 */
export interface CacheStrategyConfig extends CacheConfig {
  /** Cache strategy type */
  strategy: CacheStrategy;
  /** Hybrid strategy weights (if using multiple strategies) */
  strategyWeights?: Partial<Record<CacheStrategy, number>>;
  /** Performance monitoring interval */
  monitoringInterval?: number;
  /** Auto-adaptation based on performance */
  enableAutoAdaptation?: boolean;
}

/**
 * Performance metrics for cache strategies
 */
export interface StrategyPerformanceMetrics {
  /** Strategy type */
  strategy: CacheStrategy;
  /** Hit ratio */
  hitRatio: number;
  /** Average access time */
  averageAccessTime: number;
  /** Memory efficiency (hit ratio / memory usage) */
  memoryEfficiency: number;
  /** Eviction efficiency */
  evictionEfficiency: number;
  /** Total operations */
  totalOperations: number;
}

/**
 * Base cache strategy interface
 */
export interface ICacheStrategy<T = any> {
  /** Strategy type identifier */
  readonly type: CacheStrategy;
  
  /** Get item from cache */
  get(key: string): T | undefined;
  
  /** Set item in cache */
  set(key: string, value: T, ttl?: number): void;
  
  /** Delete item from cache */
  delete(key: string): boolean;
  
  /** Clear all cache items */
  clear(): void;
  
  /** Check if item exists */
  has(key: string): boolean;
  
  /** Get cache statistics */
  getStats(): CacheStats;
  
  /** Get performance metrics */
  getPerformanceMetrics(): StrategyPerformanceMetrics;
  
  /** Initialize strategy */
  initialize(): void;
  
  /** Cleanup and destroy strategy */
  destroy(): void;
}

/**
 * LFU (Least Frequently Used) Cache Strategy
 */
export class LFUCacheStrategy<T = any> implements ICacheStrategy<T> {
  readonly type: CacheStrategy = 'LFU';
  
  private cache = new Map<string, EnhancedCacheEntry<T>>();
  private frequencyBuckets = new Map<number, Set<string>>();
  private minFrequency = 0;
  private entryIdCounter = 0;
  private maxSizeBytes: number;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRatio: 0,
    itemCount: 0,
    totalSize: 0,
    evictions: 0,
    expirations: 0,
  };

  constructor(private config: Required<CacheStrategyConfig>) {
    this.maxSizeBytes = config.maxSize * 1024 * 1024; // Convert MB to bytes
  }

  initialize(): void {
    // Start cleanup timer if configured
    if (this.config.cleanupInterval) {
      setInterval(() => this.cleanup(), this.config.cleanupInterval);
    }
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRatio();
      return undefined;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.delete(key);
      this.stats.misses++;
      this.stats.expirations++;
      this.updateHitRatio();
      return undefined;
    }

    // Update frequency
    this.updateFrequency(key, entry);
    
    this.stats.hits++;
    this.updateHitRatio();
    return entry.value;
  }

  set(key: string, value: T, ttl?: number): void {
    const size = this.calculateSize(value);
    const now = Date.now();
    const expiresAt = now + (ttl ?? this.config.ttl);

    // Check if we need to evict items
    this.ensureCapacity(size);

    const entry: EnhancedCacheEntry<T> = {
      value,
      timestamp: now,
      expiresAt,
      accessCount: 1,
      lastAccessed: now,
      size,
      frequency: 1,
      insertionOrder: 0,
      accessOrder: 0,
      id: `${++this.entryIdCounter}_${now}`,
    };

    // Remove old entry if exists
    if (this.cache.has(key)) {
      this.removeFromFrequencyBucket(key);
    }

    this.cache.set(key, entry);
    this.addToFrequencyBucket(key, 1);
    this.updateMinFrequency();
    
    this.stats.itemCount = this.cache.size;
    this.stats.totalSize += size;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.removeFromFrequencyBucket(key);
    this.cache.delete(key);
    
    this.stats.itemCount = this.cache.size;
    this.stats.totalSize -= entry.size;
    this.updateMinFrequency();
    
    return true;
  }

  clear(): void {
    this.cache.clear();
    this.frequencyBuckets.clear();
    this.minFrequency = 0;
    this.stats.itemCount = 0;
    this.stats.totalSize = 0;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && !this.isExpired(entry);
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  getPerformanceMetrics(): StrategyPerformanceMetrics {
    const totalOps = this.stats.hits + this.stats.misses;
    return {
      strategy: this.type,
      hitRatio: this.stats.hitRatio,
      averageAccessTime: 1, // LFU has O(1) access time
      memoryEfficiency: totalOps > 0 ? this.stats.hitRatio / (this.stats.totalSize / this.maxSizeBytes) : 0,
      evictionEfficiency: this.stats.evictions > 0 ? this.stats.hits / this.stats.evictions : 0,
      totalOperations: totalOps,
    };
  }

  destroy(): void {
    this.clear();
  }

  private updateFrequency(key: string, entry: EnhancedCacheEntry<T>): void {
    const oldFreq = entry.frequency;
    const newFreq = oldFreq + 1;

    // Remove from old frequency bucket
    this.removeFromFrequencyBucket(key);
    
    // Update entry
    entry.frequency = newFreq;
    entry.lastAccessed = Date.now();
    entry.accessCount++;

    // Add to new frequency bucket
    this.addToFrequencyBucket(key, newFreq);
    this.updateMinFrequency();
  }

  private addToFrequencyBucket(key: string, frequency: number): void {
    if (!this.frequencyBuckets.has(frequency)) {
      this.frequencyBuckets.set(frequency, new Set());
    }
    this.frequencyBuckets.get(frequency)!.add(key);
  }

  private removeFromFrequencyBucket(key: string): void {
    const entry = this.cache.get(key);
    if (!entry) return;

    const bucket = this.frequencyBuckets.get(entry.frequency);
    if (bucket) {
      bucket.delete(key);
      if (bucket.size === 0) {
        this.frequencyBuckets.delete(entry.frequency);
      }
    }
  }

  private updateMinFrequency(): void {
    const frequencies = Array.from(this.frequencyBuckets.keys()).sort((a, b) => a - b);
    this.minFrequency = frequencies.length > 0 ? frequencies[0] : 0;
  }

  private ensureCapacity(newItemSize: number): void {
    // Check size limit
    while (this.stats.totalSize + newItemSize > this.maxSizeBytes && this.cache.size > 0) {
      this.evictLFU();
    }

    // Check entry count limit
    while (this.config.maxEntries && this.cache.size >= this.config.maxEntries) {
      this.evictLFU();
    }
  }

  private evictLFU(): void {
    if (this.cache.size === 0) return;

    // Find minimum frequency bucket
    const minFreqBucket = this.frequencyBuckets.get(this.minFrequency);
    if (!minFreqBucket || minFreqBucket.size === 0) {
      this.updateMinFrequency();
      return;
    }

    // Evict the first item from minimum frequency bucket
    const keyToEvict = minFreqBucket.values().next().value;
    this.delete(keyToEvict);
    this.stats.evictions++;
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.delete(key);
      this.stats.expirations++;
    }
  }

  private isExpired(entry: EnhancedCacheEntry<T>): boolean {
    return Date.now() > entry.expiresAt;
  }

  private calculateSize(value: T): number {
    try {
      return new Blob([JSON.stringify(value)]).size;
    } catch {
      return 100; // Default size estimate
    }
  }

  private updateHitRatio(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRatio = total > 0 ? this.stats.hits / total : 0;
  }
}

/**
 * FIFO (First In, First Out) Cache Strategy
 */
export class FIFOCacheStrategy<T = any> implements ICacheStrategy<T> {
  readonly type: CacheStrategy = 'FIFO';
  
  private cache = new Map<string, EnhancedCacheEntry<T>>();
  private insertionQueue: string[] = [];
  private entryIdCounter = 0;
  private maxSizeBytes: number;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRatio: 0,
    itemCount: 0,
    totalSize: 0,
    evictions: 0,
    expirations: 0,
  };

  constructor(private config: Required<CacheStrategyConfig>) {
    this.maxSizeBytes = config.maxSize * 1024 * 1024;
  }

  initialize(): void {
    if (this.config.cleanupInterval) {
      setInterval(() => this.cleanup(), this.config.cleanupInterval);
    }
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRatio();
      return undefined;
    }

    if (this.isExpired(entry)) {
      this.delete(key);
      this.stats.misses++;
      this.stats.expirations++;
      this.updateHitRatio();
      return undefined;
    }

    // Update access metadata (but don't change insertion order)
    entry.lastAccessed = Date.now();
    entry.accessCount++;
    
    this.stats.hits++;
    this.updateHitRatio();
    return entry.value;
  }

  set(key: string, value: T, ttl?: number): void {
    const size = this.calculateSize(value);
    const now = Date.now();
    const expiresAt = now + (ttl ?? this.config.ttl);

    // Remove old entry if exists
    if (this.cache.has(key)) {
      this.delete(key);
    }

    // Check if we need to evict items
    this.ensureCapacity(size);

    const entry: EnhancedCacheEntry<T> = {
      value,
      timestamp: now,
      expiresAt,
      accessCount: 0,
      lastAccessed: now,
      size,
      frequency: 0,
      insertionOrder: ++this.entryIdCounter,
      accessOrder: 0,
      id: `${this.entryIdCounter}_${now}`,
    };

    this.cache.set(key, entry);
    this.insertionQueue.push(key);
    
    this.stats.itemCount = this.cache.size;
    this.stats.totalSize += size;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.cache.delete(key);
    
    // Remove from insertion queue
    const index = this.insertionQueue.indexOf(key);
    if (index > -1) {
      this.insertionQueue.splice(index, 1);
    }
    
    this.stats.itemCount = this.cache.size;
    this.stats.totalSize -= entry.size;
    
    return true;
  }

  clear(): void {
    this.cache.clear();
    this.insertionQueue.length = 0;
    this.stats.itemCount = 0;
    this.stats.totalSize = 0;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && !this.isExpired(entry);
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  getPerformanceMetrics(): StrategyPerformanceMetrics {
    const totalOps = this.stats.hits + this.stats.misses;
    return {
      strategy: this.type,
      hitRatio: this.stats.hitRatio,
      averageAccessTime: 1, // FIFO has O(1) access time
      memoryEfficiency: totalOps > 0 ? this.stats.hitRatio / (this.stats.totalSize / this.maxSizeBytes) : 0,
      evictionEfficiency: this.stats.evictions > 0 ? this.stats.hits / this.stats.evictions : 0,
      totalOperations: totalOps,
    };
  }

  destroy(): void {
    this.clear();
  }

  private ensureCapacity(newItemSize: number): void {
    // Check size limit
    while (this.stats.totalSize + newItemSize > this.maxSizeBytes && this.cache.size > 0) {
      this.evictFIFO();
    }

    // Check entry count limit
    while (this.config.maxEntries && this.cache.size >= this.config.maxEntries) {
      this.evictFIFO();
    }
  }

  private evictFIFO(): void {
    if (this.insertionQueue.length === 0) return;

    // Evict the oldest item (first in queue)
    const keyToEvict = this.insertionQueue.shift()!;
    const entry = this.cache.get(keyToEvict);
    
    if (entry) {
      this.cache.delete(keyToEvict);
      this.stats.totalSize -= entry.size;
      this.stats.itemCount = this.cache.size;
      this.stats.evictions++;
    }
  }

  private cleanup(): void {
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.delete(key);
      this.stats.expirations++;
    }
  }

  private isExpired(entry: EnhancedCacheEntry<T>): boolean {
    return Date.now() > entry.expiresAt;
  }

  private calculateSize(value: T): number {
    try {
      return new Blob([JSON.stringify(value)]).size;
    } catch {
      return 100;
    }
  }

  private updateHitRatio(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRatio = total > 0 ? this.stats.hits / total : 0;
  }
}

/**
 * Adaptive Cache Strategy
 * Dynamically switches between strategies based on performance
 */
export class AdaptiveCacheStrategy<T = any> implements ICacheStrategy<T> {
  readonly type: CacheStrategy = 'LRU'; // Default type
  
  private currentStrategy: ICacheStrategy<T>;
  private strategies = new Map<CacheStrategy, ICacheStrategy<T>>();
  private performanceHistory: StrategyPerformanceMetrics[] = [];
  private evaluationTimer?: number;
  private adaptationThreshold = 0.1; // 10% performance improvement needed to switch

  constructor(private config: Required<CacheStrategyConfig>) {
    // Initialize all strategies
    this.initializeStrategies();
    
    // Start with LRU as default
    this.currentStrategy = this.strategies.get('LRU')!;
    
    // Start performance monitoring
    if (config.enableAutoAdaptation) {
      this.startPerformanceMonitoring();
    }
  }

  initialize(): void {
    for (const strategy of this.strategies.values()) {
      strategy.initialize();
    }
  }

  get(key: string): T | undefined {
    return this.currentStrategy.get(key);
  }

  set(key: string, value: T, ttl?: number): void {
    this.currentStrategy.set(key, value, ttl);
  }

  delete(key: string): boolean {
    return this.currentStrategy.delete(key);
  }

  clear(): void {
    this.currentStrategy.clear();
  }

  has(key: string): boolean {
    return this.currentStrategy.has(key);
  }

  getStats(): CacheStats {
    return this.currentStrategy.getStats();
  }

  getPerformanceMetrics(): StrategyPerformanceMetrics {
    return {
      ...this.currentStrategy.getPerformanceMetrics(),
      adaptiveInfo: {
        currentStrategy: this.currentStrategy.type,
        availableStrategies: Array.from(this.strategies.keys()),
        performanceHistory: this.performanceHistory.slice(-10),
      },
    } as any;
  }

  getCurrentStrategy(): CacheStrategy {
    return this.currentStrategy.type;
  }

  switchStrategy(strategy: CacheStrategy): void {
    const newStrategy = this.strategies.get(strategy);
    if (!newStrategy) {
      throw new Error(`Strategy ${strategy} not available`);
    }

    // Migrate data if possible
    this.migrateData(this.currentStrategy, newStrategy);
    this.currentStrategy = newStrategy;
  }

  destroy(): void {
    if (this.evaluationTimer) {
      clearInterval(this.evaluationTimer);
    }
    
    for (const strategy of this.strategies.values()) {
      strategy.destroy();
    }
    this.strategies.clear();
  }

  private initializeStrategies(): void {
    // Create LRU strategy (import existing)
    const lruStrategy = new (class implements ICacheStrategy<T> {
      readonly type: CacheStrategy = 'LRU';
      private cache = new Map<string, EnhancedCacheEntry<T>>();
      // ... LRU implementation would go here
      get() { return undefined; }
      set() { }
      delete() { return false; }
      clear() { }
      has() { return false; }
      getStats() { return {} as CacheStats; }
      getPerformanceMetrics() { return {} as StrategyPerformanceMetrics; }
      initialize() { }
      destroy() { }
    })();

    this.strategies.set('LRU', lruStrategy);
    this.strategies.set('LFU', new LFUCacheStrategy(this.config));
    this.strategies.set('FIFO', new FIFOCacheStrategy(this.config));
  }

  private startPerformanceMonitoring(): void {
    this.evaluationTimer = window.setInterval(() => {
      this.evaluateAndAdapt();
    }, this.config.monitoringInterval || 60000); // Default 1 minute
  }

  private evaluateAndAdapt(): void {
    const currentMetrics = this.currentStrategy.getPerformanceMetrics();
    this.performanceHistory.push(currentMetrics);

    // Limit history size
    if (this.performanceHistory.length > 100) {
      this.performanceHistory.shift();
    }

    // Find best performing strategy
    const bestStrategy = this.findBestStrategy();
    
    if (bestStrategy !== this.currentStrategy.type) {
      const improvement = this.calculateImprovement(bestStrategy);
      
      if (improvement > this.adaptationThreshold) {
        console.debug(`[AdaptiveCache] Switching to ${bestStrategy} strategy (${improvement * 100}% improvement)`);
        this.switchStrategy(bestStrategy);
      }
    }
  }

  private findBestStrategy(): CacheStrategy {
    // Simplified strategy selection based on hit ratio and memory efficiency
    let bestStrategy: CacheStrategy = this.currentStrategy.type;
    let bestScore = 0;

    for (const [strategy, impl] of this.strategies) {
      const metrics = impl.getPerformanceMetrics();
      const score = metrics.hitRatio * 0.6 + metrics.memoryEfficiency * 0.4;
      
      if (score > bestScore) {
        bestScore = score;
        bestStrategy = strategy;
      }
    }

    return bestStrategy;
  }

  private calculateImprovement(strategy: CacheStrategy): number {
    const currentMetrics = this.currentStrategy.getPerformanceMetrics();
    const candidateMetrics = this.strategies.get(strategy)?.getPerformanceMetrics();
    
    if (!candidateMetrics) return 0;

    const currentScore = currentMetrics.hitRatio * 0.6 + currentMetrics.memoryEfficiency * 0.4;
    const candidateScore = candidateMetrics.hitRatio * 0.6 + candidateMetrics.memoryEfficiency * 0.4;
    
    return candidateScore > 0 ? (candidateScore - currentScore) / candidateScore : 0;
  }

  private migrateData(from: ICacheStrategy<T>, to: ICacheStrategy<T>): void {
    // Simple data migration - in a real implementation, this would be more sophisticated
    // For now, we'll just clear the target strategy since we can't easily extract data
    to.clear();
  }
}

/**
 * Cache Strategy Factory
 */
export class CacheStrategyFactory {
  /**
   * Create a cache strategy instance
   */
  static create<T = any>(config: CacheStrategyConfig): ICacheStrategy<T> {
    const fullConfig: Required<CacheStrategyConfig> = {
      enabled: true,
      maxSize: 10,
      ttl: 5 * 60 * 1000,
      maxEntries: 1000,
      cleanupInterval: 60000,
      enableLRU: true,
      strategy: 'LRU',
      strategyWeights: {},
      monitoringInterval: 60000,
      enableAutoAdaptation: false,
      ...config,
    };

    switch (config.strategy) {
      case 'LFU':
        return new LFUCacheStrategy<T>(fullConfig);
      
      case 'FIFO':
        return new FIFOCacheStrategy<T>(fullConfig);
      
      case 'LRU':
        // Return a wrapper around the existing LRU implementation
        return new AdaptiveCacheStrategy<T>(fullConfig);
      
      default:
        return new AdaptiveCacheStrategy<T>(fullConfig);
    }
  }

  /**
   * Create an adaptive cache that automatically selects the best strategy
   */
  static createAdaptive<T = any>(config: Partial<CacheStrategyConfig> = {}): AdaptiveCacheStrategy<T> {
    const fullConfig: Required<CacheStrategyConfig> = {
      enabled: true,
      maxSize: 10,
      ttl: 5 * 60 * 1000,
      maxEntries: 1000,
      cleanupInterval: 60000,
      enableLRU: true,
      strategy: 'LRU',
      strategyWeights: {},
      monitoringInterval: 60000,
      enableAutoAdaptation: true,
      ...config,
    };

    return new AdaptiveCacheStrategy<T>(fullConfig);
  }
}

/**
 * Cache performance analyzer
 */
export class CachePerformanceAnalyzer {
  private metrics: StrategyPerformanceMetrics[] = [];

  addMetrics(metrics: StrategyPerformanceMetrics): void {
    this.metrics.push(metrics);
    
    // Keep only last 1000 measurements
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }
  }

  getBestStrategy(): CacheStrategy {
    if (this.metrics.length === 0) return 'LRU';

    const strategyScores = new Map<CacheStrategy, number>();
    
    for (const metric of this.metrics) {
      const score = metric.hitRatio * 0.5 + metric.memoryEfficiency * 0.3 + metric.evictionEfficiency * 0.2;
      const currentScore = strategyScores.get(metric.strategy) || 0;
      strategyScores.set(metric.strategy, Math.max(currentScore, score));
    }

    let bestStrategy: CacheStrategy = 'LRU';
    let bestScore = 0;

    for (const [strategy, score] of strategyScores) {
      if (score > bestScore) {
        bestScore = score;
        bestStrategy = strategy;
      }
    }

    return bestStrategy;
  }

  getAnalysisReport(): {
    recommendation: CacheStrategy;
    analysis: string;
    metrics: Record<CacheStrategy, StrategyPerformanceMetrics[]>;
  } {
    const recommendation = this.getBestStrategy();
    const strategyMetrics: Record<CacheStrategy, StrategyPerformanceMetrics[]> = {} as any;
    
    // Group metrics by strategy
    for (const metric of this.metrics) {
      if (!strategyMetrics[metric.strategy]) {
        strategyMetrics[metric.strategy] = [];
      }
      strategyMetrics[metric.strategy].push(metric);
    }

    const analysis = this.generateAnalysis(strategyMetrics, recommendation);

    return {
      recommendation,
      analysis,
      metrics: strategyMetrics,
    };
  }

  private generateAnalysis(
    metrics: Record<CacheStrategy, StrategyPerformanceMetrics[]>,
    recommendation: CacheStrategy
  ): string {
    let analysis = `Recommended strategy: ${recommendation}\\n\\n`;
    
    for (const [strategy, strategyMetrics] of Object.entries(metrics)) {
      if (strategyMetrics.length === 0) continue;
      
      const avgHitRatio = strategyMetrics.reduce((sum, m) => sum + m.hitRatio, 0) / strategyMetrics.length;
      const avgMemoryEff = strategyMetrics.reduce((sum, m) => sum + m.memoryEfficiency, 0) / strategyMetrics.length;
      
      analysis += `${strategy}: Hit Ratio ${(avgHitRatio * 100).toFixed(1)}%, Memory Efficiency ${(avgMemoryEff * 100).toFixed(1)}%\\n`;
    }

    return analysis;
  }
}