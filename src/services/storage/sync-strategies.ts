/**
 * Cross-Tab Synchronization Strategies
 * 
 * Provides different synchronization strategies for cross-tab data consistency.
 * Includes immediate sync, batched sync, conflict resolution, and optimization algorithms.
 * 
 * @fileoverview Synchronization strategies implementation
 * @module storage/sync-strategies
 */

import type { StorageChangeEvent, StorageMetadata } from './events';
import type { StorageAdapterType } from './types';
import type { ConflictInfo, ConflictResolutionStrategy, CrossTabMessage } from './cross-tab-sync';

/**
 * Sync strategy types
 */
export type SyncStrategyType = 
  | 'immediate'     // Sync immediately on every change
  | 'batched'       // Batch changes and sync periodically
  | 'on-demand'     // Sync only when requested
  | 'intelligent'   // Use AI/heuristics to optimize sync timing
  | 'priority-based'; // Sync based on data priority

/**
 * Sync operation
 */
export interface SyncOperation {
  /** Operation ID */
  id: string;
  /** Operation type */
  type: 'data-change' | 'config-update' | 'storage-clear' | 'full-sync';
  /** Target key or pattern */
  key: string;
  /** Operation data */
  data: any;
  /** Priority level (1-10, higher = more important) */
  priority: number;
  /** Creation timestamp */
  createdAt: Date;
  /** Retry count */
  retryCount: number;
  /** Source adapter */
  source: StorageAdapterType;
}

/**
 * Batch sync configuration
 */
export interface BatchSyncConfig {
  /** Maximum batch size */
  maxBatchSize: number;
  /** Batch timeout in milliseconds */
  batchTimeout: number;
  /** Priority threshold for immediate sync */
  immediateThreshold: number;
  /** Enable compression for large batches */
  enableCompression: boolean;
}

/**
 * Conflict resolution configuration
 */
export interface ConflictResolutionConfig {
  /** Default resolution strategy */
  defaultStrategy: ConflictResolutionStrategy;
  /** Custom resolution functions by key pattern */
  customResolvers: Map<string | RegExp, ConflictResolver>;
  /** Enable automatic resolution */
  autoResolve: boolean;
  /** Maximum conflict queue size */
  maxConflictQueue: number;
}

/**
 * Custom conflict resolver function
 */
export type ConflictResolver = (conflict: ConflictInfo) => Promise<{
  resolvedValue: any;
  strategy: ConflictResolutionStrategy;
}>;

/**
 * Sync metrics
 */
export interface SyncMetrics {
  /** Total operations synced */
  totalOperations: number;
  /** Failed operations */
  failedOperations: number;
  /** Average sync latency */
  averageLatency: number;
  /** Conflicts detected */
  conflictsDetected: number;
  /** Conflicts resolved */
  conflictsResolved: number;
  /** Bytes transferred */
  bytesTransferred: number;
  /** Last sync timestamp */
  lastSync: Date;
}

/**
 * Base Sync Strategy Interface
 */
export interface SyncStrategy {
  /** Strategy type */
  readonly type: SyncStrategyType;
  
  /** Initialize strategy */
  initialize(): Promise<void>;
  
  /** Queue sync operation */
  queueOperation(operation: SyncOperation): Promise<void>;
  
  /** Process queued operations */
  processQueue(): Promise<void>;
  
  /** Handle conflict */
  resolveConflict(conflict: ConflictInfo): Promise<{ resolvedValue: any; strategy: ConflictResolutionStrategy }>;
  
  /** Get strategy metrics */
  getMetrics(): SyncMetrics;
  
  /** Cleanup strategy resources */
  destroy(): void;
}

/**
 * Immediate Sync Strategy
 * Syncs every change immediately across tabs
 */
export class ImmediateSyncStrategy implements SyncStrategy {
  readonly type: SyncStrategyType = 'immediate';
  
  private metrics: SyncMetrics = {
    totalOperations: 0,
    failedOperations: 0,
    averageLatency: 0,
    conflictsDetected: 0,
    conflictsResolved: 0,
    bytesTransferred: 0,
    lastSync: new Date(),
  };
  
  private latencyHistory: number[] = [];
  private conflictConfig: ConflictResolutionConfig;
  
  constructor(
    private syncCallback: (operation: SyncOperation) => Promise<void>,
    conflictConfig: Partial<ConflictResolutionConfig> = {}
  ) {
    this.conflictConfig = {
      defaultStrategy: 'timestamp',
      customResolvers: new Map(),
      autoResolve: true,
      maxConflictQueue: 100,
      ...conflictConfig,
    };
  }

  async initialize(): Promise<void> {
    // No initialization needed for immediate strategy
  }

  async queueOperation(operation: SyncOperation): Promise<void> {
    const startTime = performance.now();
    
    try {
      await this.syncCallback(operation);
      
      // Update metrics
      this.metrics.totalOperations++;
      this.metrics.lastSync = new Date();
      
      const latency = performance.now() - startTime;
      this.updateLatencyMetrics(latency);
      
    } catch (error) {
      this.metrics.failedOperations++;
      throw error;
    }
  }

  async processQueue(): Promise<void> {
    // No queue processing needed - operations are immediate
  }

  async resolveConflict(conflict: ConflictInfo): Promise<{ resolvedValue: any; strategy: ConflictResolutionStrategy }> {
    this.metrics.conflictsDetected++;
    
    // Check for custom resolver
    const customResolver = this.findCustomResolver(conflict.key);
    if (customResolver) {
      const result = await customResolver(conflict);
      this.metrics.conflictsResolved++;
      return result;
    }

    // Use default strategy
    const result = await this.applyDefaultResolution(conflict);
    this.metrics.conflictsResolved++;
    return result;
  }

  getMetrics(): SyncMetrics {
    return { ...this.metrics };
  }

  destroy(): void {
    this.latencyHistory.length = 0;
  }

  private updateLatencyMetrics(latency: number): void {
    this.latencyHistory.push(latency);
    
    // Keep only last 100 measurements
    if (this.latencyHistory.length > 100) {
      this.latencyHistory.shift();
    }
    
    // Calculate average
    this.metrics.averageLatency = this.latencyHistory.reduce((a, b) => a + b, 0) / this.latencyHistory.length;
  }

  private findCustomResolver(key: string): ConflictResolver | undefined {
    for (const [pattern, resolver] of this.conflictConfig.customResolvers) {
      if (typeof pattern === 'string' && key.includes(pattern)) {
        return resolver;
      } else if (pattern instanceof RegExp && pattern.test(key)) {
        return resolver;
      }
    }
    return undefined;
  }

  private async applyDefaultResolution(conflict: ConflictInfo): Promise<{ resolvedValue: any; strategy: ConflictResolutionStrategy }> {
    const strategy = this.conflictConfig.defaultStrategy;
    
    switch (strategy) {
      case 'timestamp':
        // Use newest value based on timestamp
        const resolvedValue = conflict.remoteTimestamp > conflict.localTimestamp 
          ? conflict.remoteValue 
          : conflict.localValue;
        return { resolvedValue, strategy };
        
      case 'merge':
        // Simple merge strategy (for objects)
        if (typeof conflict.localValue === 'object' && typeof conflict.remoteValue === 'object') {
          const merged = { ...conflict.localValue, ...conflict.remoteValue };
          return { resolvedValue: merged, strategy };
        }
        // Fallback to timestamp for non-objects
        return this.applyDefaultResolution({ ...conflict, defaultStrategy: 'timestamp' } as any);
        
      case 'ignore':
        // Keep local value
        return { resolvedValue: conflict.localValue, strategy };
        
      case 'manual':
        // Manual resolution needed - keep remote for now
        return { resolvedValue: conflict.remoteValue, strategy };
        
      default:
        return { resolvedValue: conflict.remoteValue, strategy: 'timestamp' };
    }
  }
}

/**
 * Batched Sync Strategy
 * Batches changes and syncs periodically for efficiency
 */
export class BatchedSyncStrategy implements SyncStrategy {
  readonly type: SyncStrategyType = 'batched';
  
  private operationQueue: SyncOperation[] = [];
  private batchTimer?: number;
  private isProcessing = false;
  private metrics: SyncMetrics = {
    totalOperations: 0,
    failedOperations: 0,
    averageLatency: 0,
    conflictsDetected: 0,
    conflictsResolved: 0,
    bytesTransferred: 0,
    lastSync: new Date(),
  };

  constructor(
    private syncCallback: (operations: SyncOperation[]) => Promise<void>,
    private batchConfig: BatchSyncConfig,
    private conflictConfig: ConflictResolutionConfig
  ) {}

  async initialize(): Promise<void> {
    this.startBatchTimer();
  }

  async queueOperation(operation: SyncOperation): Promise<void> {
    this.operationQueue.push(operation);
    
    // Check if we should sync immediately based on priority or queue size
    if (operation.priority >= this.batchConfig.immediateThreshold ||
        this.operationQueue.length >= this.batchConfig.maxBatchSize) {
      await this.processQueue();
    }
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing || this.operationQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const startTime = performance.now();
    
    try {
      // Get batch to process
      const batch = this.operationQueue.splice(0, this.batchConfig.maxBatchSize);
      
      // Sort by priority (highest first)
      batch.sort((a, b) => b.priority - a.priority);
      
      // Process batch
      await this.syncCallback(batch);
      
      // Update metrics
      this.metrics.totalOperations += batch.length;
      this.metrics.lastSync = new Date();
      
      const latency = performance.now() - startTime;
      this.updateLatencyMetrics(latency);
      
      // Restart timer if there are more operations
      if (this.operationQueue.length > 0) {
        this.startBatchTimer();
      }
      
    } catch (error) {
      this.metrics.failedOperations += this.operationQueue.length;
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  async resolveConflict(conflict: ConflictInfo): Promise<{ resolvedValue: any; strategy: ConflictResolutionStrategy }> {
    // Delegate to immediate strategy for conflict resolution
    const immediateStrategy = new ImmediateSyncStrategy(() => Promise.resolve(), this.conflictConfig);
    return immediateStrategy.resolveConflict(conflict);
  }

  getMetrics(): SyncMetrics {
    return {
      ...this.metrics,
      queuedOperations: this.operationQueue.length,
    } as any;
  }

  destroy(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    this.operationQueue.length = 0;
  }

  private startBatchTimer(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    
    this.batchTimer = window.setTimeout(() => {
      this.processQueue();
    }, this.batchConfig.batchTimeout);
  }

  private updateLatencyMetrics(latency: number): void {
    // Simple moving average
    this.metrics.averageLatency = (this.metrics.averageLatency + latency) / 2;
  }
}

/**
 * Intelligent Sync Strategy
 * Uses heuristics to optimize sync timing and reduce conflicts
 */
export class IntelligentSyncStrategy implements SyncStrategy {
  readonly type: SyncStrategyType = 'intelligent';
  
  private immediateStrategy: ImmediateSyncStrategy;
  private batchedStrategy: BatchedSyncStrategy;
  private currentStrategy: SyncStrategy;
  private adaptationMetrics = {
    conflictRate: 0,
    averageLatency: 0,
    operationFrequency: 0,
  };

  constructor(
    private syncCallback: (operation: SyncOperation | SyncOperation[]) => Promise<void>,
    private batchConfig: BatchSyncConfig,
    private conflictConfig: ConflictResolutionConfig
  ) {
    this.immediateStrategy = new ImmediateSyncStrategy(
      (op) => this.syncCallback(op),
      conflictConfig
    );
    
    this.batchedStrategy = new BatchedSyncStrategy(
      (ops) => this.syncCallback(ops),
      batchConfig,
      conflictConfig
    );
    
    // Start with immediate strategy
    this.currentStrategy = this.immediateStrategy;
  }

  async initialize(): Promise<void> {
    await this.immediateStrategy.initialize();
    await this.batchedStrategy.initialize();
  }

  async queueOperation(operation: SyncOperation): Promise<void> {
    // Adapt strategy based on current conditions
    this.adaptStrategy();
    
    return this.currentStrategy.queueOperation(operation);
  }

  async processQueue(): Promise<void> {
    return this.currentStrategy.processQueue();
  }

  async resolveConflict(conflict: ConflictInfo): Promise<{ resolvedValue: any; strategy: ConflictResolutionStrategy }> {
    return this.currentStrategy.resolveConflict(conflict);
  }

  getMetrics(): SyncMetrics {
    const currentMetrics = this.currentStrategy.getMetrics();
    return {
      ...currentMetrics,
      strategyType: this.currentStrategy.type,
      adaptationMetrics: this.adaptationMetrics,
    } as any;
  }

  destroy(): void {
    this.immediateStrategy.destroy();
    this.batchedStrategy.destroy();
  }

  private adaptStrategy(): void {
    const immediateMetrics = this.immediateStrategy.getMetrics();
    const batchedMetrics = this.batchedStrategy.getMetrics();
    
    // Update adaptation metrics
    this.adaptationMetrics.conflictRate = immediateMetrics.conflictsDetected / Math.max(immediateMetrics.totalOperations, 1);
    this.adaptationMetrics.averageLatency = immediateMetrics.averageLatency;
    
    // Decision logic
    const shouldUseBatched = 
      this.adaptationMetrics.conflictRate < 0.1 && // Low conflict rate
      this.adaptationMetrics.averageLatency > 100; // High latency
    
    const targetStrategy = shouldUseBatched ? this.batchedStrategy : this.immediateStrategy;
    
    if (this.currentStrategy !== targetStrategy) {
      console.debug(`[IntelligentSync] Switching to ${targetStrategy.type} strategy`);
      this.currentStrategy = targetStrategy;
    }
  }
}

/**
 * Sync Strategy Factory
 */
export class SyncStrategyFactory {
  static create(
    type: SyncStrategyType,
    syncCallback: (operation: SyncOperation | SyncOperation[]) => Promise<void>,
    config: {
      batchConfig?: Partial<BatchSyncConfig>;
      conflictConfig?: Partial<ConflictResolutionConfig>;
    } = {}
  ): SyncStrategy {
    const batchConfig: BatchSyncConfig = {
      maxBatchSize: 10,
      batchTimeout: 1000,
      immediateThreshold: 8,
      enableCompression: false,
      ...config.batchConfig,
    };
    
    const conflictConfig: ConflictResolutionConfig = {
      defaultStrategy: 'timestamp',
      customResolvers: new Map(),
      autoResolve: true,
      maxConflictQueue: 100,
      ...config.conflictConfig,
    };

    switch (type) {
      case 'immediate':
        return new ImmediateSyncStrategy(
          (op) => syncCallback(op),
          conflictConfig
        );
        
      case 'batched':
        return new BatchedSyncStrategy(
          (ops) => syncCallback(ops),
          batchConfig,
          conflictConfig
        );
        
      case 'intelligent':
        return new IntelligentSyncStrategy(
          syncCallback,
          batchConfig,
          conflictConfig
        );
        
      default:
        throw new Error(`Unsupported sync strategy type: ${type}`);
    }
  }
}

/**
 * Built-in conflict resolvers
 */
export const BuiltInResolvers = {
  /**
   * Last-writer-wins based on timestamp
   */
  timestampResolver: async (conflict: ConflictInfo) => ({
    resolvedValue: conflict.remoteTimestamp > conflict.localTimestamp 
      ? conflict.remoteValue 
      : conflict.localValue,
    strategy: 'timestamp' as ConflictResolutionStrategy,
  }),

  /**
   * Merge objects intelligently
   */
  objectMergeResolver: async (conflict: ConflictInfo) => {
    if (typeof conflict.localValue === 'object' && typeof conflict.remoteValue === 'object') {
      const merged = { ...conflict.localValue, ...conflict.remoteValue };
      return { resolvedValue: merged, strategy: 'merge' as ConflictResolutionStrategy };
    }
    return BuiltInResolvers.timestampResolver(conflict);
  },

  /**
   * Array merge resolver
   */
  arrayMergeResolver: async (conflict: ConflictInfo) => {
    if (Array.isArray(conflict.localValue) && Array.isArray(conflict.remoteValue)) {
      const merged = [...new Set([...conflict.localValue, ...conflict.remoteValue])];
      return { resolvedValue: merged, strategy: 'merge' as ConflictResolutionStrategy };
    }
    return BuiltInResolvers.timestampResolver(conflict);
  },
};