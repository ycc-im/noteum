/**
 * Configuration Validation System
 *
 * Provides comprehensive configuration validation with schema support,
 * custom validation rules, and type checking for storage configurations.
 *
 * @fileoverview Configuration validation implementation
 * @module storage/config-validator
 */

import type { ConfigValidationResult, ConfigValidator } from './config-watcher';
import type { StorageConfig } from './interfaces';

/**
 * Validation rule types
 */
export type ValidationRuleType =
  | 'required' // Field is required
  | 'type' // Type validation
  | 'range' // Numeric range validation
  | 'pattern' // Regex pattern validation
  | 'enum' // Enum value validation
  | 'custom' // Custom validation function
  | 'dependency' // Field dependency validation
  | 'conditional'; // Conditional validation

/**
 * Validation rule definition
 */
export interface ValidationRule {
  /** Rule type */
  type: ValidationRuleType;
  /** Field path (supports dot notation) */
  path: string;
  /** Validation parameters */
  params?: any;
  /** Error message template */
  message?: string;
  /** Warning message template */
  warningMessage?: string;
  /** Rule is only a warning, not an error */
  warningOnly?: boolean;
  /** Condition for applying this rule */
  condition?: (config: any) => boolean;
}

/**
 * Validation schema
 */
export interface ValidationSchema {
  /** Schema version */
  version: string;
  /** Schema title/description */
  title?: string;
  /** Validation rules */
  rules: ValidationRule[];
  /** Custom validators */
  customValidators?: Record<
    string,
    (value: any, config: any) => ValidationRuleResult
  >;
}

/**
 * Individual rule validation result
 */
export interface ValidationRuleResult {
  /** Whether the rule passed */
  passed: boolean;
  /** Error message if failed */
  error?: string;
  /** Warning message */
  warning?: string;
  /** Additional metadata */
  metadata?: any;
}

/**
 * Validation context
 */
export interface ValidationContext {
  /** Current configuration being validated */
  config: any;
  /** Field path being validated */
  currentPath: string;
  /** Validation options */
  options: ValidationOptions;
  /** Parent validator instance */
  validator: ConfigValidator;
}

/**
 * Validation options
 */
export interface ValidationOptions {
  /** Stop validation on first error */
  failFast: boolean;
  /** Include warnings in results */
  includeWarnings: boolean;
  /** Enable strict mode (additional checks) */
  strictMode: boolean;
  /** Custom validation context */
  context?: any;
}

/**
 * Built-in validation rules
 */
export class ValidationRules {
  /**
   * Required field validation
   */
  static required(value: any, config: any, params: any): ValidationRuleResult {
    const passed = value !== undefined && value !== null && value !== '';
    return {
      passed,
      error: passed ? undefined : params.message || 'Field is required',
    };
  }

  /**
   * Type validation
   */
  static type(
    value: any,
    config: any,
    params: { type: string; message?: string }
  ): ValidationRuleResult {
    if (value === undefined || value === null) {
      return { passed: true }; // Type validation skips null/undefined (use required rule for that)
    }

    let passed = false;
    const expectedType = params.type;

    switch (expectedType) {
      case 'string':
        passed = typeof value === 'string';
        break;
      case 'number':
        passed = typeof value === 'number' && !isNaN(value);
        break;
      case 'boolean':
        passed = typeof value === 'boolean';
        break;
      case 'array':
        passed = Array.isArray(value);
        break;
      case 'object':
        passed = typeof value === 'object' && !Array.isArray(value);
        break;
      case 'integer':
        passed = Number.isInteger(value);
        break;
      case 'positive':
        passed = typeof value === 'number' && value > 0;
        break;
      case 'non-negative':
        passed = typeof value === 'number' && value >= 0;
        break;
      default:
        passed = false;
    }

    return {
      passed,
      error: passed
        ? undefined
        : params.message ||
          `Expected type ${expectedType}, got ${typeof value}`,
    };
  }

  /**
   * Range validation for numbers
   */
  static range(
    value: any,
    config: any,
    params: { min?: number; max?: number; message?: string }
  ): ValidationRuleResult {
    if (typeof value !== 'number') {
      return { passed: false, error: 'Range validation requires a number' };
    }

    const { min, max } = params;
    let passed = true;
    let error: string | undefined;

    if (min !== undefined && value < min) {
      passed = false;
      error = `Value ${value} is below minimum ${min}`;
    } else if (max !== undefined && value > max) {
      passed = false;
      error = `Value ${value} is above maximum ${max}`;
    }

    return {
      passed,
      error: error || params.message,
    };
  }

  /**
   * Pattern validation using regex
   */
  static pattern(
    value: any,
    config: any,
    params: { pattern: string | RegExp; message?: string }
  ): ValidationRuleResult {
    if (typeof value !== 'string') {
      return { passed: false, error: 'Pattern validation requires a string' };
    }

    const regex =
      typeof params.pattern === 'string'
        ? new RegExp(params.pattern)
        : params.pattern;
    const passed = regex.test(value);

    return {
      passed,
      error: passed
        ? undefined
        : params.message || `Value does not match pattern ${regex}`,
    };
  }

  /**
   * Enum validation
   */
  static enum(
    value: any,
    config: any,
    params: { values: any[]; message?: string }
  ): ValidationRuleResult {
    const passed = params.values.includes(value);
    return {
      passed,
      error: passed
        ? undefined
        : params.message || `Value must be one of: ${params.values.join(', ')}`,
    };
  }

  /**
   * Dependency validation (field depends on another field)
   */
  static dependency(
    value: any,
    config: any,
    params: { dependsOn: string; message?: string }
  ): ValidationRuleResult {
    const dependentValue = this.getNestedValue(config, params.dependsOn);
    const passed = dependentValue !== undefined && dependentValue !== null;

    return {
      passed,
      error: passed
        ? undefined
        : params.message || `Field depends on ${params.dependsOn} being set`,
    };
  }

  /**
   * Custom validation
   */
  static custom(
    value: any,
    config: any,
    params: { validator: string | Function; message?: string }
  ): ValidationRuleResult {
    try {
      let validator: Function;

      if (typeof params.validator === 'string') {
        // Look up validator by name
        validator = CustomValidators[params.validator];
        if (!validator) {
          return {
            passed: false,
            error: `Unknown validator: ${params.validator}`,
          };
        }
      } else {
        validator = params.validator;
      }

      const result = validator(value, config);

      if (typeof result === 'boolean') {
        return {
          passed: result,
          error: result
            ? undefined
            : params.message || 'Custom validation failed',
        };
      }

      return result;
    } catch (error) {
      return {
        passed: false,
        error: `Custom validation error: ${(error as Error).message}`,
      };
    }
  }

  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

/**
 * Custom validators library
 */
export const CustomValidators: Record<
  string,
  (value: any, config: any) => ValidationRuleResult | boolean
> = {
  /**
   * Validate database name format
   */
  databaseName: (value: string): ValidationRuleResult => {
    if (typeof value !== 'string') {
      return { passed: false, error: 'Database name must be a string' };
    }

    const validPattern = /^[a-zA-Z0-9_-]+$/;
    const passed =
      validPattern.test(value) && value.length >= 3 && value.length <= 50;

    return {
      passed,
      error: passed
        ? undefined
        : 'Database name must be 3-50 characters, alphanumeric, underscore, or dash only',
    };
  },

  /**
   * Validate cache size is reasonable
   */
  cacheSize: (value: number): ValidationRuleResult => {
    const passed = value >= 1 && value <= 1000; // 1MB to 1GB
    const warning =
      value > 100 ? 'Cache size > 100MB may impact performance' : undefined;

    return {
      passed,
      warning,
      error: passed ? undefined : 'Cache size must be between 1MB and 1000MB',
    };
  },

  /**
   * Validate TTL is reasonable
   */
  ttlValue: (value: number): ValidationRuleResult => {
    const passed = value >= 1000 && value <= 7 * 24 * 60 * 60 * 1000; // 1 second to 1 week
    const warning =
      value < 60000 ? 'TTL < 1 minute may cause performance issues' : undefined;

    return {
      passed,
      warning,
      error: passed ? undefined : 'TTL must be between 1 second and 1 week',
    };
  },

  /**
   * Validate storage adapter type
   */
  storageAdapterType: (value: string): boolean => {
    return ['indexeddb', 'localstorage', 'memory'].includes(value);
  },

  /**
   * Validate cache strategy
   */
  cacheStrategy: (value: string): boolean => {
    return ['LRU', 'LFU', 'FIFO', 'TTL'].includes(value);
  },
};

/**
 * Schema-based Configuration Validator
 */
export class SchemaConfigValidator implements ConfigValidator {
  private schema: ValidationSchema;
  private options: ValidationOptions;

  constructor(
    schema: ValidationSchema,
    options: Partial<ValidationOptions> = {}
  ) {
    this.schema = schema;
    this.options = {
      failFast: false,
      includeWarnings: true,
      strictMode: false,
      ...options,
    };
  }

  async validate(config: any): Promise<ConfigValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const context: ValidationContext = {
      config,
      currentPath: '',
      options: this.options,
      validator: this,
    };

    try {
      for (const rule of this.schema.rules) {
        // Check if rule condition is met
        if (rule.condition && !rule.condition(config)) {
          continue;
        }

        const result = await this.validateRule(rule, config, context);

        if (!result.passed) {
          if (rule.warningOnly) {
            if (result.warning) warnings.push(result.warning);
          } else {
            if (result.error) errors.push(result.error);
            if (this.options.failFast) break;
          }
        } else if (result.warning && this.options.includeWarnings) {
          warnings.push(result.warning);
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        metadata: {
          schemaVersion: this.schema.version,
          validatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation error: ${(error as Error).message}`],
        warnings,
      };
    }
  }

  private async validateRule(
    rule: ValidationRule,
    config: any,
    context: ValidationContext
  ): Promise<ValidationRuleResult> {
    const value = this.getNestedValue(config, rule.path);
    context.currentPath = rule.path;

    let result: ValidationRuleResult;

    switch (rule.type) {
      case 'required':
        result = ValidationRules.required(value, config, rule.params || {});
        break;
      case 'type':
        result = ValidationRules.type(value, config, rule.params || {});
        break;
      case 'range':
        result = ValidationRules.range(value, config, rule.params || {});
        break;
      case 'pattern':
        result = ValidationRules.pattern(value, config, rule.params || {});
        break;
      case 'enum':
        result = ValidationRules.enum(value, config, rule.params || {});
        break;
      case 'dependency':
        result = ValidationRules.dependency(value, config, rule.params || {});
        break;
      case 'custom':
        result = ValidationRules.custom(value, config, rule.params || {});
        break;
      default:
        result = {
          passed: false,
          error: `Unknown validation rule type: ${rule.type}`,
        };
    }

    // Override messages if provided in rule
    if (rule.message && !result.passed) {
      result.error = this.interpolateMessage(rule.message, {
        value,
        path: rule.path,
        config,
      });
    }
    if (rule.warningMessage && result.warning) {
      result.warning = this.interpolateMessage(rule.warningMessage, {
        value,
        path: rule.path,
        config,
      });
    }

    return result;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private interpolateMessage(
    template: string,
    variables: Record<string, any>
  ): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  }
}

/**
 * Storage configuration validation schema
 */
export const StorageConfigSchema: ValidationSchema = {
  version: '1.0.0',
  title: 'Storage Configuration Schema',
  rules: [
    // Database configuration
    {
      type: 'required',
      path: 'databaseName',
      message: 'Database name is required',
    },
    {
      type: 'custom',
      path: 'databaseName',
      params: { validator: 'databaseName' },
    },
    {
      type: 'type',
      path: 'version',
      params: { type: 'integer' },
    },
    {
      type: 'range',
      path: 'version',
      params: { min: 1, max: 1000 },
    },

    // Cache configuration
    {
      type: 'type',
      path: 'maxSize',
      params: { type: 'positive' },
    },
    {
      type: 'custom',
      path: 'maxSize',
      params: { validator: 'cacheSize' },
    },
    {
      type: 'type',
      path: 'ttl',
      params: { type: 'positive' },
    },
    {
      type: 'custom',
      path: 'ttl',
      params: { validator: 'ttlValue' },
    },

    // Boolean flags
    {
      type: 'type',
      path: 'debug',
      params: { type: 'boolean' },
    },
    {
      type: 'type',
      path: 'enableCompression',
      params: { type: 'boolean' },
    },
    {
      type: 'type',
      path: 'fallbackToLocalStorage',
      params: { type: 'boolean' },
    },

    // Cache strategy validation
    {
      type: 'custom',
      path: 'cacheConfig.strategy',
      params: { validator: 'cacheStrategy' },
      condition: config => config.cacheConfig?.strategy !== undefined,
    },

    // Warning for large cache sizes
    {
      type: 'range',
      path: 'maxSize',
      params: { max: 100 },
      warningOnly: true,
      warningMessage: 'Cache size > 100MB may impact browser performance',
      condition: config => config.maxSize > 100,
    },

    // Warning for short TTL
    {
      type: 'range',
      path: 'ttl',
      params: { min: 60000 },
      warningOnly: true,
      warningMessage: 'TTL < 1 minute may cause frequent cache invalidation',
      condition: config => config.ttl < 60000,
    },
  ],
};

/**
 * Create a storage configuration validator
 */
export function createStorageConfigValidator(
  customSchema?: Partial<ValidationSchema>,
  options?: Partial<ValidationOptions>
): SchemaConfigValidator {
  const schema = customSchema
    ? { ...StorageConfigSchema, ...customSchema }
    : StorageConfigSchema;

  return new SchemaConfigValidator(schema, options);
}

/**
 * Validate storage configuration with default schema
 */
export async function validateStorageConfig(
  config: TypedStorageConfig
): Promise<ConfigValidationResult> {
  const validator = createStorageConfigValidator();
  return validator.validate(config);
}

/**
 * Configuration validation utilities
 */
export class ConfigValidationUtils {
  /**
   * Create a validation rule
   */
  static createRule(
    type: ValidationRuleType,
    path: string,
    params?: any,
    options?: {
      message?: string;
      warningMessage?: string;
      warningOnly?: boolean;
      condition?: (config: any) => boolean;
    }
  ): ValidationRule {
    return {
      type,
      path,
      params,
      ...options,
    };
  }

  /**
   * Merge validation schemas
   */
  static mergeSchemas(...schemas: ValidationSchema[]): ValidationSchema {
    return {
      version: schemas[schemas.length - 1].version,
      title: schemas
        .map(s => s.title)
        .filter(Boolean)
        .join(' + '),
      rules: schemas.flatMap(s => s.rules),
      customValidators: Object.assign(
        {},
        ...schemas.map(s => s.customValidators)
      ),
    };
  }

  /**
   * Create conditional validation rule
   */
  static conditionalRule(
    condition: (config: any) => boolean,
    rule: Omit<ValidationRule, 'condition'>
  ): ValidationRule {
    return { ...rule, condition };
  }

  /**
   * Create warning-only rule
   */
  static warningRule(
    rule: Omit<ValidationRule, 'warningOnly'>
  ): ValidationRule {
    return { ...rule, warningOnly: true };
  }
}
