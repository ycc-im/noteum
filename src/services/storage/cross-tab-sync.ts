/**
 * Cross-Tab Synchronization Manager
 *
 * Provides real-time data synchronization across browser tabs using BroadcastChannel API.
 * Handles configuration changes, data updates, and conflict resolution between tabs.
 *
 * @fileoverview Cross-tab synchronization implementation
 * @module storage/cross-tab-sync
 */

import type { StorageAdapterType } from './types';
import type {
  StorageChangeEvent,
  StorageEvent,
  StorageMetadata,
} from './events';
import { StorageEventUtils } from './event-builder';

/**
 * Cross-tab message types
 */
export type CrossTabMessageType =
  | 'data-changed' // Data was modified in another tab
  | 'config-updated' // Configuration was updated
  | 'storage-cleared' // Storage was cleared
  | 'tab-connected' // New tab connected
  | 'tab-disconnected' // Tab disconnected
  | 'heartbeat' // Keep-alive message
  | 'sync-request' // Request full sync
  | 'sync-response' // Response to sync request
  | 'conflict-detected' // Data conflict detected
  | 'conflict-resolved'; // Conflict was resolved

/**
 * Cross-tab message structure
 */
export interface CrossTabMessage {
  /** Message type */
  type: CrossTabMessageType;
  /** Source tab ID */
  tabId: string;
  /** Message timestamp */
  timestamp: Date;
  /** Message payload */
  data?: any;
  /** Message ID for tracking */
  messageId: string;
  /** Source adapter type */
  source?: StorageAdapterType;
}

/**
 * Tab information
 */
export interface TabInfo {
  /** Unique tab identifier */
  id: string;
  /** Tab creation timestamp */
  createdAt: Date;
  /** Last activity timestamp */
  lastActivity: Date;
  /** Tab title/name */
  title?: string;
  /** Whether tab is currently active */
  isActive: boolean;
  /** Browser/environment info */
  userAgent?: string;
}

/**
 * Sync configuration
 */
export interface CrossTabSyncConfig {
  /** BroadcastChannel name */
  channelName: string;
  /** Heartbeat interval in milliseconds */
  heartbeatInterval: number;
  /** Tab timeout in milliseconds */
  tabTimeout: number;
  /** Enable conflict resolution */
  enableConflictResolution: boolean;
  /** Maximum message queue size */
  maxMessageQueueSize: number;
  /** Enable message deduplication */
  enableDeduplication: boolean;
  /** Sync debounce delay in milliseconds */
  syncDebounceMs: number;
}

/**
 * Conflict resolution strategy
 */
export type ConflictResolutionStrategy =
  | 'timestamp'
  | 'manual'
  | 'merge'
  | 'ignore';

/**
 * Conflict information
 */
export interface ConflictInfo {
  /** Conflict key */
  key: string;
  /** Local value */
  localValue: any;
  /** Remote value */
  remoteValue: any;
  /** Local timestamp */
  localTimestamp: Date;
  /** Remote timestamp */
  remoteTimestamp: Date;
  /** Source adapter */
  source: StorageAdapterType;
}

/**
 * Cross-tab sync event listeners
 */
export interface CrossTabSyncListeners {
  onTabConnected?: (tabInfo: TabInfo) => void;
  onTabDisconnected?: (tabId: string) => void;
  onDataSynced?: (data: StorageChangeEvent) => void;
  onConfigSynced?: (config: any) => void;
  onConflictDetected?: (conflict: ConflictInfo) => void;
  onConflictResolved?: (
    key: string,
    resolvedValue: any,
    strategy: ConflictResolutionStrategy
  ) => void;
  onSyncError?: (error: Error, message?: CrossTabMessage) => void;
}

/**
 * Cross-Tab Synchronization Manager
 */
export class CrossTabSyncManager {
  private readonly config: Required<CrossTabSyncConfig>;
  private readonly tabId: string;
  private channel: BroadcastChannel | null = null;
  private tabs = new Map<string, TabInfo>();
  private messageQueue: CrossTabMessage[] = [];
  private heartbeatTimer?: number;
  private cleanupTimer?: number;
  private listeners: CrossTabSyncListeners = {};
  private messageIdCounter = 0;
  private pendingSyncRequests = new Set<string>();
  private isDestroyed = false;

  constructor(
    config: Partial<CrossTabSyncConfig> = {},
    listeners: CrossTabSyncListeners = {}
  ) {
    this.config = {
      channelName: 'noteum-storage-sync',
      heartbeatInterval: 30000, // 30 seconds
      tabTimeout: 90000, // 90 seconds
      enableConflictResolution: true,
      maxMessageQueueSize: 1000,
      enableDeduplication: true,
      syncDebounceMs: 100,
      ...config,
    };

    this.tabId = this.generateTabId();
    this.listeners = listeners;

    // Initialize if BroadcastChannel is supported
    if (this.isBroadcastChannelSupported()) {
      this.initialize();
    } else {
      console.warn(
        '[CrossTabSyncManager] BroadcastChannel not supported in this environment'
      );
    }
  }

  /**
   * Initialize the sync manager
   */
  private initialize(): void {
    try {
      // Create broadcast channel
      this.channel = new BroadcastChannel(this.config.channelName);
      this.channel.addEventListener('message', this.handleMessage.bind(this));

      // Register this tab
      this.registerTab();

      // Start heartbeat
      this.startHeartbeat();

      // Start cleanup timer
      this.startCleanupTimer();

      // Announce connection
      this.broadcastMessage('tab-connected', this.getTabInfo());
    } catch (error) {
      console.error('[CrossTabSyncManager] Initialization failed:', error);
    }
  }

  /**
   * Broadcast data change to other tabs
   */
  broadcastDataChange(
    type: 'added' | 'updated' | 'removed' | 'cleared',
    key: string,
    oldValue?: any,
    newValue?: any,
    source: StorageAdapterType = 'indexeddb',
    metadata?: StorageMetadata
  ): void {
    if (!this.channel || this.isDestroyed) return;

    const changeData = {
      type,
      key,
      oldValue,
      newValue,
      source,
      metadata,
      tabId: this.tabId,
    };

    this.broadcastMessage('data-changed', changeData);
  }

  /**
   * Broadcast configuration update
   */
  broadcastConfigUpdate(
    config: any,
    source: StorageAdapterType = 'indexeddb'
  ): void {
    if (!this.channel || this.isDestroyed) return;

    this.broadcastMessage('config-updated', {
      config,
      source,
      tabId: this.tabId,
    });
  }

  /**
   * Broadcast storage clear event
   */
  broadcastStorageCleared(source: StorageAdapterType = 'indexeddb'): void {
    if (!this.channel || this.isDestroyed) return;

    this.broadcastMessage('storage-cleared', {
      source,
      tabId: this.tabId,
    });
  }

  /**
   * Request full synchronization from other tabs
   */
  requestSync(keys?: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.channel || this.isDestroyed) {
        resolve();
        return;
      }

      const syncId = this.generateMessageId();
      this.pendingSyncRequests.add(syncId);

      this.broadcastMessage('sync-request', {
        syncId,
        keys,
        tabId: this.tabId,
      });

      // Set timeout for sync response
      const timeout = setTimeout(() => {
        this.pendingSyncRequests.delete(syncId);
        resolve(); // Resolve even if no response (might be only tab)
      }, 5000);

      // Listen for sync response
      const originalHandler = this.listeners.onDataSynced;
      this.listeners.onDataSynced = data => {
        if ((data as any).syncId === syncId) {
          clearTimeout(timeout);
          this.pendingSyncRequests.delete(syncId);
          this.listeners.onDataSynced = originalHandler;
          resolve();
        }
        originalHandler?.(data);
      };
    });
  }

  /**
   * Get connected tabs information
   */
  getConnectedTabs(): TabInfo[] {
    return Array.from(this.tabs.values());
  }

  /**
   * Get current tab ID
   */
  getTabId(): string {
    return this.tabId;
  }

  /**
   * Check if sync is supported
   */
  isSupported(): boolean {
    return this.isBroadcastChannelSupported();
  }

  /**
   * Get sync statistics
   */
  getStats() {
    return {
      tabId: this.tabId,
      connectedTabs: this.tabs.size,
      messageQueueSize: this.messageQueue.length,
      pendingSyncRequests: this.pendingSyncRequests.size,
      isSupported: this.isSupported(),
      isDestroyed: this.isDestroyed,
    };
  }

  /**
   * Destroy sync manager and cleanup resources
   */
  destroy(): void {
    if (this.isDestroyed) return;

    // Announce disconnection
    if (this.channel) {
      this.broadcastMessage('tab-disconnected', { tabId: this.tabId });
    }

    // Clear timers
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    // Close channel
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }

    // Clear state
    this.tabs.clear();
    this.messageQueue.length = 0;
    this.pendingSyncRequests.clear();
    this.isDestroyed = true;
  }

  // =================== Private Methods ===================

  private isBroadcastChannelSupported(): boolean {
    return typeof BroadcastChannel !== 'undefined';
  }

  private generateTabId(): string {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${this.tabId}_${++this.messageIdCounter}_${Date.now()}`;
  }

  private getTabInfo(): TabInfo {
    return {
      id: this.tabId,
      createdAt: new Date(),
      lastActivity: new Date(),
      title: typeof document !== 'undefined' ? document.title : undefined,
      isActive: typeof document !== 'undefined' ? !document.hidden : true,
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };
  }

  private registerTab(): void {
    const tabInfo = this.getTabInfo();
    this.tabs.set(this.tabId, tabInfo);
  }

  private broadcastMessage(type: CrossTabMessageType, data?: any): void {
    if (!this.channel || this.isDestroyed) return;

    const message: CrossTabMessage = {
      type,
      tabId: this.tabId,
      timestamp: new Date(),
      data,
      messageId: this.generateMessageId(),
    };

    try {
      this.channel.postMessage(message);
      this.addToMessageQueue(message);
    } catch (error) {
      console.error(
        '[CrossTabSyncManager] Failed to broadcast message:',
        error
      );
    }
  }

  private handleMessage(event: MessageEvent<CrossTabMessage>): void {
    const message = event.data;

    // Ignore messages from self
    if (message.tabId === this.tabId) return;

    // Validate message
    if (!this.isValidMessage(message)) {
      console.warn('[CrossTabSyncManager] Invalid message received:', message);
      return;
    }

    // Check for duplicates
    if (this.config.enableDeduplication && this.isDuplicateMessage(message)) {
      return;
    }

    this.addToMessageQueue(message);

    try {
      switch (message.type) {
        case 'tab-connected':
          this.handleTabConnected(message);
          break;
        case 'tab-disconnected':
          this.handleTabDisconnected(message);
          break;
        case 'data-changed':
          this.handleDataChanged(message);
          break;
        case 'config-updated':
          this.handleConfigUpdated(message);
          break;
        case 'storage-cleared':
          this.handleStorageCleared(message);
          break;
        case 'heartbeat':
          this.handleHeartbeat(message);
          break;
        case 'sync-request':
          this.handleSyncRequest(message);
          break;
        case 'sync-response':
          this.handleSyncResponse(message);
          break;
        case 'conflict-detected':
          this.handleConflictDetected(message);
          break;
        case 'conflict-resolved':
          this.handleConflictResolved(message);
          break;
      }
    } catch (error) {
      console.error('[CrossTabSyncManager] Message handling error:', error);
      this.listeners.onSyncError?.(error as Error, message);
    }
  }

  private isValidMessage(message: any): message is CrossTabMessage {
    return (
      message &&
      typeof message.type === 'string' &&
      typeof message.tabId === 'string' &&
      typeof message.messageId === 'string' &&
      message.timestamp
    );
  }

  private isDuplicateMessage(message: CrossTabMessage): boolean {
    return this.messageQueue.some(
      msg =>
        msg.messageId === message.messageId ||
        (msg.tabId === message.tabId &&
          msg.type === message.type &&
          Math.abs(
            new Date(msg.timestamp).getTime() -
              new Date(message.timestamp).getTime()
          ) < 1000)
    );
  }

  private addToMessageQueue(message: CrossTabMessage): void {
    this.messageQueue.push(message);

    // Limit queue size
    if (this.messageQueue.length > this.config.maxMessageQueueSize) {
      this.messageQueue.splice(
        0,
        this.messageQueue.length - this.config.maxMessageQueueSize
      );
    }
  }

  private handleTabConnected(message: CrossTabMessage): void {
    const tabInfo: TabInfo = message.data;
    this.tabs.set(tabInfo.id, tabInfo);
    this.listeners.onTabConnected?.(tabInfo);
  }

  private handleTabDisconnected(message: CrossTabMessage): void {
    const { tabId } = message.data;
    this.tabs.delete(tabId);
    this.listeners.onTabDisconnected?.(tabId);
  }

  private handleDataChanged(message: CrossTabMessage): void {
    const changeData = message.data;
    const changeEvent: StorageChangeEvent = {
      key: changeData.key,
      type: changeData.type,
      oldValue: changeData.oldValue,
      newValue: changeData.newValue,
      timestamp: new Date(message.timestamp),
      source: 'sync',
      metadata: changeData.metadata,
    };

    // Check for conflicts if enabled
    if (
      this.config.enableConflictResolution &&
      this.shouldCheckConflict(changeEvent)
    ) {
      this.checkForConflict(changeEvent, message);
    }

    this.listeners.onDataSynced?.(changeEvent);
  }

  private handleConfigUpdated(message: CrossTabMessage): void {
    const { config } = message.data;
    this.listeners.onConfigSynced?.(config);
  }

  private handleStorageCleared(message: CrossTabMessage): void {
    const changeEvent: StorageChangeEvent = {
      key: '*',
      type: 'cleared',
      oldValue: undefined,
      newValue: undefined,
      timestamp: new Date(message.timestamp),
      source: 'sync',
      metadata: {},
    };

    this.listeners.onDataSynced?.(changeEvent);
  }

  private handleHeartbeat(message: CrossTabMessage): void {
    const tabInfo = this.tabs.get(message.tabId);
    if (tabInfo) {
      tabInfo.lastActivity = new Date();
      tabInfo.isActive = message.data?.isActive ?? true;
    }
  }

  private handleSyncRequest(message: CrossTabMessage): void {
    const { syncId, keys } = message.data;

    // This would typically trigger a response with current data
    // Implementation depends on the storage adapter
    this.broadcastMessage('sync-response', {
      syncId,
      keys,
      responseTabId: this.tabId,
    });
  }

  private handleSyncResponse(message: CrossTabMessage): void {
    // Handle sync response data
    // Implementation depends on specific sync requirements
  }

  private handleConflictDetected(message: CrossTabMessage): void {
    const conflict: ConflictInfo = message.data;
    this.listeners.onConflictDetected?.(conflict);
  }

  private handleConflictResolved(message: CrossTabMessage): void {
    const { key, resolvedValue, strategy } = message.data;
    this.listeners.onConflictResolved?.(key, resolvedValue, strategy);
  }

  private shouldCheckConflict(changeEvent: StorageChangeEvent): boolean {
    // Basic conflict detection logic
    return changeEvent.type === 'updated' && changeEvent.key !== '*';
  }

  private checkForConflict(
    changeEvent: StorageChangeEvent,
    message: CrossTabMessage
  ): void {
    // Implement conflict detection logic based on timestamps, versions, etc.
    // This is a simplified example
    const conflict: ConflictInfo = {
      key: changeEvent.key,
      localValue: changeEvent.oldValue,
      remoteValue: changeEvent.newValue,
      localTimestamp: new Date(),
      remoteTimestamp: new Date(message.timestamp),
      source: message.source ?? 'indexeddb',
    };

    this.listeners.onConflictDetected?.(conflict);
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = window.setInterval(() => {
      if (!this.isDestroyed) {
        this.broadcastMessage('heartbeat', {
          isActive: typeof document !== 'undefined' ? !document.hidden : true,
        });
      }
    }, this.config.heartbeatInterval);
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = window.setInterval(() => {
      if (!this.isDestroyed) {
        this.cleanupInactiveTabs();
        this.cleanupMessageQueue();
      }
    }, this.config.tabTimeout / 2);
  }

  private cleanupInactiveTabs(): void {
    const now = Date.now();
    const timeoutThreshold = now - this.config.tabTimeout;

    for (const [tabId, tabInfo] of this.tabs) {
      if (tabInfo.lastActivity.getTime() < timeoutThreshold) {
        this.tabs.delete(tabId);
        this.listeners.onTabDisconnected?.(tabId);
      }
    }
  }

  private cleanupMessageQueue(): void {
    const now = Date.now();
    const messageTimeout = 5 * 60 * 1000; // 5 minutes

    this.messageQueue = this.messageQueue.filter(
      message => now - new Date(message.timestamp).getTime() < messageTimeout
    );
  }
}

/**
 * Create a new cross-tab sync manager
 */
export function createCrossTabSyncManager(
  config?: Partial<CrossTabSyncConfig>,
  listeners?: CrossTabSyncListeners
): CrossTabSyncManager {
  return new CrossTabSyncManager(config, listeners);
}
