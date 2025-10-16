/**
 * Port management logger utility
 * Provides structured logging for port configuration and management operations
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export enum LogCategory {
  PORT_CONFIG = 'PORT_CONFIG',
  PORT_VALIDATION = 'PORT_VALIDATION',
  PORT_SCAN = 'PORT_SCAN',
  PORT_CONFLICT = 'PORT_CONFLICT',
  DOCKER_CONFIG = 'DOCKER_CONFIG',
  ENVIRONMENT = 'ENVIRONMENT',
  HEALTH_CHECK = 'HEALTH_CHECK',
  AUDIT = 'AUDIT'
}

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  category: LogCategory
  message: string
  data?: Record<string, unknown>
  error?: Error
  correlationId?: string
}

export interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableFile: boolean
  logDirectory?: string
  maxFileSize?: number // bytes
  maxFiles?: number
  enableColors: boolean
  enableTimestamp: boolean
  enableMetadata: boolean
}

/**
 * Port management logger
 */
export class PortLogger {
  private config: LoggerConfig
  private static instance: PortLogger

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      enableColors: true,
      enableTimestamp: true,
      enableMetadata: true,
      ...config
    }

    // Create log directory if file logging is enabled
    if (this.config.enableFile && this.config.logDirectory) {
      // In a real implementation, you would create the directory here
      // For now, we'll just ensure the path exists conceptually
    }
  }

  /**
   * Get singleton logger instance
   */
  public static getInstance(config?: Partial<LoggerConfig>): PortLogger {
    if (!PortLogger.instance) {
      PortLogger.instance = new PortLogger(config)
    }
    return PortLogger.instance
  }

  /**
   * Log debug message
   */
  public debug(message: string, category: LogCategory, data?: Record<string, unknown>, correlationId?: string): void {
    this.log(LogLevel.DEBUG, message, category, data, correlationId)
  }

  /**
   * Log info message
   */
  public info(message: string, category: LogCategory, data?: Record<string, unknown>, correlationId?: string): void {
    this.log(LogLevel.INFO, message, category, data, correlationId)
  }

  /**
   * Log warning message
   */
  public warn(message: string, category: LogCategory, data?: Record<string, unknown>, correlationId?: string): void {
    this.log(LogLevel.WARN, message, category, data, correlationId)
  }

  /**
   * Log error message
   */
  public error(message: string, category: LogCategory, error?: Error, data?: Record<string, unknown>, correlationId?: string): void {
    this.log(LogLevel.ERROR, message, category, data, correlationId, error)
  }

  /**
   * Log fatal message
   */
  public fatal(message: string, category: LogCategory, error?: Error, data?: Record<string, unknown>, correlationId?: string): void {
    this.log(LogLevel.FATAL, message, category, data, correlationId, error)
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    category: LogCategory,
    data?: Record<string, unknown>,
    correlationId?: string,
    error?: Error
  ): void {
    if (level < this.config.level) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category,
      message,
      data,
      error,
      correlationId
    }

    // Log to console
    if (this.config.enableConsole) {
      this.logToConsole(entry)
    }

    // Log to file
    if (this.config.enableFile) {
      this.logToFile(entry)
    }
  }

  /**
   * Log to console with formatting
   */
  private logToConsole(entry: LogEntry): void {
    const levelName = LogLevel[entry.level].padEnd(5)
    const categoryName = entry.category.padEnd(16)
    const timestamp = this.config.enableTimestamp ? entry.timestamp.toISOString() + ' ' : ''
    const correlation = entry.correlationId ? `[${entry.correlationId}] ` : ''

    let message = `${timestamp}${levelName} ${categoryName} ${correlation}${entry.message}`

    if (this.config.enableColors) {
      message = this.colorizeMessage(message, entry.level)
    }

    if (entry.data && this.config.enableMetadata) {
      message += ` ${JSON.stringify(entry.data)}`
    }

    if (entry.error) {
      message += `\n${entry.error.stack || entry.error.message}`
    }

    console.log(message)
  }

  /**
   * Log to file (simplified implementation)
   */
  private logToFile(entry: LogEntry): void {
    // In a real implementation, you would write to a file here
    // For now, we'll just use console as a fallback
    if (!this.config.enableConsole) {
      console.log(JSON.stringify(entry))
    }
  }

  /**
   * Add colors to log messages based on level
   */
  private colorizeMessage(message: string, level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.FATAL]: '\x1b[35m'  // Magenta
    }

    const reset = '\x1b[0m'
    return `${colors[level]}${message}${reset}`
  }

  /**
   * Update logger configuration
   */
  public updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Get current logger configuration
   */
  public getConfig(): LoggerConfig {
    return { ...this.config }
  }

  /**
   * Create child logger with additional context
   */
  public child(context: Record<string, unknown>): PortChildLogger {
    return new PortChildLogger(this, context)
  }
}

/**
 * Child logger with predefined context
 */
export class PortChildLogger {
  constructor(
    private parent: PortLogger,
    private context: Record<string, unknown>
  ) {}

  public debug(message: string, category: LogCategory, additionalData?: Record<string, unknown>, correlationId?: string): void {
    const data = { ...this.context, ...additionalData }
    this.parent.debug(message, category, data, correlationId)
  }

  public info(message: string, category: LogCategory, additionalData?: Record<string, unknown>, correlationId?: string): void {
    const data = { ...this.context, ...additionalData }
    this.parent.info(message, category, data, correlationId)
  }

  public warn(message: string, category: LogCategory, additionalData?: Record<string, unknown>, correlationId?: string): void {
    const data = { ...this.context, ...additionalData }
    this.parent.warn(message, category, data, correlationId)
  }

  public error(message: string, category: LogCategory, error?: Error, additionalData?: Record<string, unknown>, correlationId?: string): void {
    const data = { ...this.context, ...additionalData }
    this.parent.error(message, category, error, data, correlationId)
  }

  public fatal(message: string, category: LogCategory, error?: Error, additionalData?: Record<string, unknown>, correlationId?: string): void {
    const data = { ...this.context, ...additionalData }
    this.parent.fatal(message, category, error, data, correlationId)
  }
}

/**
 * Default logger instance
 */
export const logger = PortLogger.getInstance({
  level: LogLevel.INFO,
  enableConsole: true,
  enableColors: true,
  enableTimestamp: true,
  enableMetadata: true
})

/**
 * Create a logger for a specific service
 */
export function createServiceLogger(service: string, config?: Partial<LoggerConfig>): PortChildLogger {
  return logger.child({ service })
}

/**
 * Create a logger for a specific operation
 */
export function createOperationLogger(operation: string, config?: Partial<LoggerConfig>): PortChildLogger {
  return logger.child({ operation })
}

/**
 * Log port configuration changes
 */
export function logPortConfigurationChange(
  service: string,
  oldPort: number,
  newPort: number,
  reason?: string
): void {
  logger.info(
    `Port configuration changed for ${service}`,
    LogCategory.PORT_CONFIG,
    {
      service,
      oldPort,
      newPort,
      reason: reason || 'No reason provided'
    }
  )
}

/**
 * Log port validation results
 */
export function logPortValidation(
  port: number,
  isValid: boolean,
  errors: string[],
  warnings: string[]
): void {
  const level = isValid ? LogLevel.INFO : LogLevel.WARN

  logger.log(
    level,
    `Port validation completed for ${port}`,
    LogCategory.PORT_VALIDATION,
    {
      port,
      isValid,
      errors,
      warnings
    }
  )
}

/**
 * Log port scan results
 */
export function logPortScanResults(
  totalPorts: number,
  availablePorts: number,
  occupiedPorts: number,
  duration: number
): void {
  logger.info(
    `Port scan completed`,
    LogCategory.PORT_SCAN,
    {
      totalPorts,
      availablePorts,
      occupiedPorts,
      conflicts: totalPorts - availablePorts - occupiedPorts,
      duration: `${duration}ms`
    }
  )
}

/**
 * Log port conflicts
 */
export function logPortConflict(
  port: number,
  conflictingServices: string[],
  resolution?: string
): void {
  logger.warn(
    `Port conflict detected`,
    LogCategory.PORT_CONFLICT,
    {
      port,
      conflictingServices,
      resolution: resolution || 'No resolution provided'
    }
  )
}

/**
 * Generate correlation ID for tracking operations
 */
export function generateCorrelationId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}