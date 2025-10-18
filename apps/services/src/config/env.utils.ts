import { Environment, LogLevel } from './constants'

export class EnvUtils {
  /**
   * Check if the current environment is development
   */
  static isDevelopment(): boolean {
    return process.env.NODE_ENV === Environment.DEVELOPMENT
  }

  /**
   * Check if the current environment is production
   */
  static isProduction(): boolean {
    return process.env.NODE_ENV === Environment.PRODUCTION
  }

  /**
   * Check if the current environment is test
   */
  static isTest(): boolean {
    return process.env.NODE_ENV === Environment.TEST
  }

  /**
   * Get the current environment
   */
  static getEnvironment(): Environment {
    return (process.env.NODE_ENV as Environment) || Environment.DEVELOPMENT
  }

  /**
   * Parse a boolean environment variable
   */
  static parseBoolean(
    value: string | undefined,
    defaultValue = false
  ): boolean {
    if (!value) return defaultValue
    return value.toLowerCase() === 'true'
  }

  /**
   * Parse a number environment variable
   */
  static parseNumber(value: string | undefined, defaultValue = 0): number {
    if (!value) return defaultValue
    const parsed = parseInt(value, 10)
    return isNaN(parsed) ? defaultValue : parsed
  }

  /**
   * Parse a string array environment variable (comma-separated)
   */
  static parseStringArray(
    value: string | undefined,
    defaultValue: string[] = []
  ): string[] {
    if (!value) return defaultValue
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }

  /**
   * Get a required environment variable or throw an error
   */
  static getRequired(key: string): string {
    const value = process.env[key]
    if (!value) {
      throw new Error(`Required environment variable ${key} is not set`)
    }
    return value
  }

  /**
   * Get an optional environment variable with a default value
   */
  static getOptional(key: string, defaultValue = ''): string {
    return process.env[key] || defaultValue
  }

  /**
   * Validate that required environment variables are present
   */
  static validateRequired(keys: string[]): void {
    const missing = keys.filter(key => !process.env[key])
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      )
    }
  }

  /**
   * Get database URL with fallback for different formats
   */
  static getDatabaseUrl(): string {
    // Direct DATABASE_URL
    if (process.env.DATABASE_URL) {
      return process.env.DATABASE_URL
    }

    // Individual database components
    const host = this.getOptional('DB_HOST', 'localhost')
    const port = this.getOptional('DB_PORT', '5432')
    const user = this.getOptional('DB_USER', 'postgres')
    const password = this.getRequired('DB_PASSWORD')
    const name = this.getOptional('DB_NAME', 'noteum')
    const schema = this.getOptional('DB_SCHEMA', 'public')

    return `postgresql://${user}:${password}@${host}:${port}/${name}?schema=${schema}`
  }

  /**
   * Get Redis URL with fallback for different formats
   */
  static getRedisUrl(): string {
    // Direct REDIS_URL
    if (process.env.REDIS_URL) {
      return process.env.REDIS_URL
    }

    // Individual Redis components
    const host = this.getOptional('REDIS_HOST', 'localhost')
    const port = this.getOptional('REDIS_PORT', '6379')
    const password = process.env.REDIS_PASSWORD

    return password
      ? `redis://:${password}@${host}:${port}`
      : `redis://${host}:${port}`
  }

  /**
   * Get log level with validation
   */
  static getLogLevel(): LogLevel {
    const level = this.getOptional('LOG_LEVEL', 'info').toLowerCase()
    return Object.values(LogLevel).includes(level as LogLevel)
      ? (level as LogLevel)
      : LogLevel.INFO
  }

  /**
   * Check if CORS should be enabled
   */
  static isCorsEnabled(): boolean {
    return (
      this.isDevelopment() || this.parseBoolean(process.env.CORS_ENABLED, true)
    )
  }

  /**
   * Get CORS origins
   */
  static getCorsOrigins(): string[] {
    const origins = this.getOptional('CORS_ORIGIN', 'http://localhost:3000')
    return this.parseStringArray(origins)
  }

  /**
   * Get port number with validation
   */
  static getPort(defaultPort = 3000): number {
    const port = this.parseNumber(process.env.PORT, defaultPort)
    if (port < 1 || port > 65535) {
      throw new Error(
        `Invalid port number: ${port}. Must be between 1 and 65535.`
      )
    }
    return port
  }

  /**
   * Get JWT secret with validation
   */
  static getJWTSecret(): string {
    const secret = this.getRequired('JWT_SECRET')
    if (secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long')
    }
    return secret
  }
}
