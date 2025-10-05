/**
 * Configuration Hot Reload Watcher
 * 
 * Provides real-time configuration monitoring and hot reloading capabilities.
 * Supports configuration validation, rollback mechanisms, and change notification system.
 * 
 * @fileoverview Configuration watching and hot reload implementation
 * @module storage/config-watcher
 */

import type { StorageAdapterType } from './types';
import type { StorageConfig } from './interfaces';

/**
 * Configuration change types
 */
export type ConfigChangeType = 
  | 'updated'     // Configuration was updated
  | 'validated'   // Configuration was validated
  | 'applied'     // Configuration was applied
  | 'reverted'    // Configuration was reverted
  | 'corrupted'   // Configuration became corrupted
  | 'reloaded';   // Configuration was reloaded from source

/**
 * Configuration change event
 */
export interface ConfigChangeEvent {
  /** Change type */
  type: ConfigChangeType;
  /** Configuration key that changed */
  key?: string;
  /** Old configuration value */
  oldValue?: any;
  /** New configuration value */
  newValue?: any;
  /** Complete old configuration */
  oldConfig?: any;
  /** Complete new configuration */
  newConfig?: any;
  /** Change timestamp */
  timestamp: Date;
  /** Source of the change */
  source: 'file' | 'api' | 'user' | 'system' | 'network';
  /** Validation results */
  validation?: ConfigValidationResult;
  /** Error information if change failed */
  error?: Error;
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
  /** Validation metadata */
  metadata?: any;
}

/**
 * Configuration rollback information
 */
export interface ConfigRollbackInfo {
  /** Rollback ID */
  id: string;
  /** Configuration before rollback */
  previousConfig: any;
  /** Timestamp of rollback */
  timestamp: Date;
  /** Reason for rollback */
  reason: string;
  /** Whether rollback was automatic */
  automatic: boolean;
}

/**
 * Configuration watcher options
 */
export interface ConfigWatcherOptions {
  /** Enable hot reloading */
  enableHotReload: boolean;
  /** Configuration polling interval (ms) */
  pollingInterval: number;
  /** Enable automatic validation */
  enableValidation: boolean;
  /** Enable automatic rollback on validation failure */
  enableAutoRollback: boolean;
  /** Maximum number of configuration history entries */
  maxHistorySize: number;
  /** Enable configuration persistence */
  enablePersistence: boolean;
  /** Configuration storage key */
  storageKey: string;
  /** Enable change debouncing */
  enableDebouncing: boolean;
  /** Debounce delay in milliseconds */
  debounceDelay: number;
}

/**
 * Configuration watcher listeners
 */
export interface ConfigWatcherListeners {
  /** Called when configuration changes */
  onConfigChanged?: (event: ConfigChangeEvent) => void;
  /** Called when configuration validation fails */
  onValidationFailed?: (result: ConfigValidationResult, config: any) => void;
  /** Called when configuration is rolled back */
  onConfigRolledBack?: (rollbackInfo: ConfigRollbackInfo) => void;
  /** Called when configuration watcher encounters an error */
  onWatcherError?: (error: Error) => void;
}

/**
 * Configuration validator interface
 */
export interface ConfigValidator {
  /** Validate configuration */
  validate(config: any): Promise<ConfigValidationResult>;
  /** Get validation schema */
  getSchema?(): any;
}

/**
 * Configuration Hot Reload Watcher
 */
export class ConfigurationWatcher {
  private currentConfig: any = {};
  private configHistory: { config: any; timestamp: Date; id: string }[] = [];
  private validators = new Set<ConfigValidator>();
  private listeners: ConfigWatcherListeners = {};
  private watchTimer?: number;
  private debounceTimer?: number;
  private idCounter = 0;
  private isDestroyed = false;

  constructor(
    private options: Required<ConfigWatcherOptions>,
    listeners: ConfigWatcherListeners = {}
  ) {
    this.listeners = listeners;
    this.loadPersistedConfig();
    
    if (this.options.enableHotReload) {
      this.startWatching();
    }
  }

  /**
   * Set the current configuration
   */
  async setConfig(config: any, source: ConfigChangeEvent['source'] = 'api'): Promise<ConfigValidationResult> {
    if (this.isDestroyed) {
      throw new Error('ConfigurationWatcher has been destroyed');
    }

    const oldConfig = { ...this.currentConfig };
    
    try {
      // Validate configuration if enabled
      let validationResult: ConfigValidationResult = { isValid: true, errors: [], warnings: [] };
      
      if (this.options.enableValidation) {
        validationResult = await this.validateConfig(config);
        
        if (!validationResult.isValid) {
          this.emitConfigChange({
            type: 'validated',
            oldConfig,
            newConfig: config,
            timestamp: new Date(),
            source,
            validation: validationResult,
            error: new Error(`Validation failed: ${validationResult.errors.join(', ')}`),
          });

          if (this.options.enableAutoRollback) {
            await this.rollbackConfig('Validation failed', true);
          }
          
          this.listeners.onValidationFailed?.(validationResult, config);
          return validationResult;
        }
      }

      // Apply configuration
      this.addToHistory(this.currentConfig);
      this.currentConfig = { ...config };
      
      // Persist if enabled
      if (this.options.enablePersistence) {
        this.persistConfig();
      }

      // Emit change event
      this.emitConfigChange({
        type: 'applied',
        oldConfig,
        newConfig: this.currentConfig,
        timestamp: new Date(),
        source,
        validation: validationResult,
      });

      return validationResult;

    } catch (error) {
      this.emitConfigChange({
        type: 'corrupted',
        oldConfig,
        newConfig: config,
        timestamp: new Date(),
        source,
        error: error as Error,
      });

      throw error;
    }
  }

  /**
   * Get the current configuration
   */
  getConfig(): any {
    return { ...this.currentConfig };
  }

  /**
   * Update specific configuration key
   */
  async updateConfigKey(key: string, value: any, source: ConfigChangeEvent['source'] = 'api'): Promise<ConfigValidationResult> {
    const newConfig = { ...this.currentConfig };
    this.setNestedProperty(newConfig, key, value);
    return this.setConfig(newConfig, source);
  }

  /**
   * Delete configuration key
   */
  async deleteConfigKey(key: string, source: ConfigChangeEvent['source'] = 'api'): Promise<ConfigValidationResult> {
    const newConfig = { ...this.currentConfig };
    this.deleteNestedProperty(newConfig, key);
    return this.setConfig(newConfig, source);
  }

  /**
   * Rollback to previous configuration
   */
  async rollbackConfig(reason: string = 'Manual rollback', automatic: boolean = false): Promise<void> {
    if (this.configHistory.length === 0) {
      throw new Error('No configuration history available for rollback');
    }

    const previousEntry = this.configHistory[this.configHistory.length - 1];
    const rollbackInfo: ConfigRollbackInfo = {
      id: this.generateId(),
      previousConfig: { ...this.currentConfig },
      timestamp: new Date(),
      reason,
      automatic,
    };

    this.currentConfig = { ...previousEntry.config };
    
    // Remove the rolled-back entry from history
    this.configHistory.pop();

    // Persist if enabled
    if (this.options.enablePersistence) {
      this.persistConfig();
    }

    this.listeners.onConfigRolledBack?.(rollbackInfo);
    
    this.emitConfigChange({
      type: 'reverted',
      oldConfig: rollbackInfo.previousConfig,
      newConfig: this.currentConfig,
      timestamp: new Date(),
      source: automatic ? 'system' : 'user',
    });
  }

  /**
   * Add configuration validator
   */
  addValidator(validator: ConfigValidator): void {
    this.validators.add(validator);
  }

  /**
   * Remove configuration validator
   */
  removeValidator(validator: ConfigValidator): void {
    this.validators.delete(validator);
  }

  /**
   * Force reload configuration from source
   */
  async reloadConfig(): Promise<void> {
    try {
      // In a real implementation, this would reload from file/API/etc.
      const reloadedConfig = this.loadConfigFromSource();
      
      if (reloadedConfig) {
        await this.setConfig(reloadedConfig, 'file');
        
        this.emitConfigChange({
          type: 'reloaded',
          oldConfig: this.currentConfig,
          newConfig: reloadedConfig,
          timestamp: new Date(),
          source: 'file',
        });
      }
    } catch (error) {
      this.listeners.onWatcherError?.(error as Error);
    }
  }

  /**
   * Get configuration history
   */
  getConfigHistory(): Array<{ config: any; timestamp: Date; id: string }> {
    return [...this.configHistory];
  }

  /**
   * Clear configuration history
   */
  clearHistory(): void {
    this.configHistory.length = 0;
  }

  /**
   * Get watcher statistics
   */
  getStats() {
    return {
      currentConfigSize: JSON.stringify(this.currentConfig).length,
      historySize: this.configHistory.length,
      validatorCount: this.validators.size,
      isWatching: !!this.watchTimer,
      isDestroyed: this.isDestroyed,
    };
  }

  /**
   * Destroy the configuration watcher
   */
  destroy(): void {
    if (this.isDestroyed) return;

    this.stopWatching();
    this.clearDebounceTimer();
    this.validators.clear();
    this.configHistory.length = 0;
    this.isDestroyed = true;
  }

  // =================== Private Methods ===================

  private startWatching(): void {
    if (this.watchTimer) return;

    this.watchTimer = window.setInterval(() => {
      this.checkForConfigChanges();
    }, this.options.pollingInterval);
  }

  private stopWatching(): void {
    if (this.watchTimer) {
      clearInterval(this.watchTimer);
      this.watchTimer = undefined;
    }
  }

  private async checkForConfigChanges(): Promise<void> {
    try {
      // In a real implementation, this would check file modification time,
      // API endpoints, or other configuration sources
      const externalConfig = this.loadConfigFromSource();
      
      if (externalConfig && !this.isConfigEqual(externalConfig, this.currentConfig)) {
        await this.setConfig(externalConfig, 'file');
      }
    } catch (error) {
      this.listeners.onWatcherError?.(error as Error);
    }
  }

  private loadConfigFromSource(): any {
    // Placeholder for external configuration loading
    // In a real implementation, this would load from file, API, etc.
    return null;
  }

  private async validateConfig(config: any): Promise<ConfigValidationResult> {
    const results: ConfigValidationResult[] = [];
    
    for (const validator of this.validators) {
      try {
        const result = await validator.validate(config);
        results.push(result);
      } catch (error) {
        results.push({
          isValid: false,
          errors: [`Validator error: ${(error as Error).message}`],
          warnings: [],
        });
      }
    }

    // Combine all validation results
    const combinedResult: ConfigValidationResult = {
      isValid: results.every(r => r.isValid),
      errors: results.flatMap(r => r.errors),
      warnings: results.flatMap(r => r.warnings),
    };

    return combinedResult;
  }

  private emitConfigChange(event: ConfigChangeEvent): void {
    if (this.options.enableDebouncing && this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    const emit = () => {
      this.listeners.onConfigChanged?.(event);
    };

    if (this.options.enableDebouncing) {
      this.debounceTimer = window.setTimeout(emit, this.options.debounceDelay);
    } else {
      emit();
    }
  }

  private addToHistory(config: any): void {
    this.configHistory.push({
      config: { ...config },
      timestamp: new Date(),
      id: this.generateId(),
    });

    // Limit history size
    if (this.configHistory.length > this.options.maxHistorySize) {
      this.configHistory.shift();
    }
  }

  private loadPersistedConfig(): void {
    if (!this.options.enablePersistence) return;

    try {
      const stored = localStorage.getItem(this.options.storageKey);
      if (stored) {
        this.currentConfig = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('[ConfigWatcher] Failed to load persisted config:', error);
    }
  }

  private persistConfig(): void {
    if (!this.options.enablePersistence) return;

    try {
      localStorage.setItem(this.options.storageKey, JSON.stringify(this.currentConfig));
    } catch (error) {
      console.warn('[ConfigWatcher] Failed to persist config:', error);
    }
  }

  private isConfigEqual(config1: any, config2: any): boolean {
    try {
      return JSON.stringify(config1) === JSON.stringify(config2);
    } catch {
      return false;
    }
  }

  private setNestedProperty(obj: any, key: string, value: any): void {
    const keys = key.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  private deleteNestedProperty(obj: any, key: string): void {
    const keys = key.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== 'object') {
        return; // Path doesn't exist
      }
      current = current[k];
    }
    
    delete current[keys[keys.length - 1]];
  }

  private clearDebounceTimer(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = undefined;
    }
  }

  private generateId(): string {
    return `config_${++this.idCounter}_${Date.now()}`;
  }
}

/**
 * Default configuration validator
 */
export class DefaultConfigValidator implements ConfigValidator {
  constructor(private schema?: any) {}

  async validate(config: any): Promise<ConfigValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Basic validation
      if (config === null || config === undefined) {
        errors.push('Configuration cannot be null or undefined');
      }

      if (typeof config !== 'object') {
        errors.push('Configuration must be an object');
      }

      // Schema validation if provided
      if (this.schema) {
        const schemaResult = this.validateAgainstSchema(config, this.schema);
        errors.push(...schemaResult.errors);
        warnings.push(...schemaResult.warnings);
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation error: ${(error as Error).message}`],
        warnings,
      };
    }
  }

  private validateAgainstSchema(config: any, schema: any): { errors: string[]; warnings: string[] } {
    // Simplified schema validation
    // In a real implementation, use a proper JSON schema validator
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const [key, schemaValue] of Object.entries(schema)) {
      if (!(key in config)) {
        if ((schemaValue as any).required) {
          errors.push(`Required property '${key}' is missing`);
        } else {
          warnings.push(`Optional property '${key}' is missing`);
        }
      }
    }

    return { errors, warnings };
  }
}

/**
 * Storage configuration validator
 */
export class StorageConfigValidator implements ConfigValidator {
  async validate(config: any): Promise<ConfigValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate storage-specific configuration
    if (config.maxSize && (typeof config.maxSize !== 'number' || config.maxSize <= 0)) {
      errors.push('maxSize must be a positive number');
    }

    if (config.ttl && (typeof config.ttl !== 'number' || config.ttl <= 0)) {
      errors.push('ttl must be a positive number');
    }

    if (config.databaseName && typeof config.databaseName !== 'string') {
      errors.push('databaseName must be a string');
    }

    if (config.version && (typeof config.version !== 'number' || config.version < 1)) {
      errors.push('version must be a number >= 1');
    }

    // Warnings for best practices
    if (config.maxSize && config.maxSize > 1000) {
      warnings.push('maxSize > 1000MB may cause performance issues');
    }

    if (config.ttl && config.ttl < 1000) {
      warnings.push('ttl < 1000ms may cause excessive cache invalidation');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

/**
 * Create configuration watcher with default options
 */
export function createConfigurationWatcher(
  options: Partial<ConfigWatcherOptions> = {},
  listeners: ConfigWatcherListeners = {}
): ConfigurationWatcher {
  const defaultOptions: Required<ConfigWatcherOptions> = {
    enableHotReload: true,
    pollingInterval: 5000, // 5 seconds
    enableValidation: true,
    enableAutoRollback: true,
    maxHistorySize: 10,
    enablePersistence: true,
    storageKey: 'noteum-config',
    enableDebouncing: true,
    debounceDelay: 1000, // 1 second
    ...options,
  };

  return new ConfigurationWatcher(defaultOptions, listeners);
}

/**
 * Configuration management utilities
 */
export class ConfigurationUtils {
  /**
   * Deep merge configurations
   */
  static mergeConfigs(base: any, override: any): any {
    const result = { ...base };

    for (const [key, value] of Object.entries(override)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = this.mergeConfigs(result[key] || {}, value);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Extract configuration diff
   */
  static getConfigDiff(oldConfig: any, newConfig: any): { added: any; modified: any; removed: string[] } {
    const added: any = {};
    const modified: any = {};
    const removed: string[] = [];

    // Find added and modified
    for (const [key, value] of Object.entries(newConfig)) {
      if (!(key in oldConfig)) {
        added[key] = value;
      } else if (JSON.stringify(oldConfig[key]) !== JSON.stringify(value)) {
        modified[key] = { old: oldConfig[key], new: value };
      }
    }

    // Find removed
    for (const key of Object.keys(oldConfig)) {
      if (!(key in newConfig)) {
        removed.push(key);
      }
    }

    return { added, modified, removed };
  }

  /**
   * Validate configuration structure
   */
  static validateStructure(config: any, requiredKeys: string[]): string[] {
    const errors: string[] = [];

    for (const key of requiredKeys) {
      if (!(key in config)) {
        errors.push(`Missing required configuration key: ${key}`);
      }
    }

    return errors;
  }
}

/**
 * Global configuration watcher instance
 */
export const globalConfigWatcher = createConfigurationWatcher({
  enableHotReload: true,
  enableValidation: true,
  enableAutoRollback: false, // Don't auto-rollback global config
}, {
  onConfigChanged: (event) => {
    console.debug('[GlobalConfig] Configuration changed:', event.type);
  },
  onValidationFailed: (result) => {
    console.warn('[GlobalConfig] Validation failed:', result.errors);
  },
  onWatcherError: (error) => {
    console.error('[GlobalConfig] Watcher error:', error);
  },
});