/**
 * Environment variable validation schema for NestJS backend
 * Provides type-safe configuration validation
 */

import { plainToInstance, Transform } from 'class-transformer'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsIn,
  IsInt,
  Min,
  Max,
  validateSync,
} from 'class-validator'

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export class DatabaseConfig {
  @IsString()
  @Transform(({ value }) => value || process.env.DATABASE_URL)
  url!: string

  @IsString()
  @Transform(({ value }) => value || process.env.DATABASE_HOST || 'localhost')
  host!: string

  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(65535)
  @Transform(
    ({ value }) =>
      parseInt(value) || parseInt(process.env.DATABASE_PORT || '5432')
  )
  port!: number

  @IsString()
  @Transform(({ value }) => value || process.env.DATABASE_NAME || 'noteum_dev')
  name!: string

  @IsString()
  @Transform(({ value }) => value || process.env.DATABASE_USER || 'postgres')
  username!: string

  @IsString()
  @Transform(
    ({ value }) => value || process.env.DATABASE_PASSWORD || 'postgres'
  )
  password!: string

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  ssl?: boolean = false
}

export class RedisConfig {
  @IsString()
  @Transform(({ value }) => value || process.env.REDIS_URL)
  url!: string

  @IsString()
  @Transform(({ value }) => value || process.env.REDIS_HOST || 'localhost')
  host!: string

  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(65535)
  @Transform(
    ({ value }) => parseInt(value) || parseInt(process.env.REDIS_PORT || '6379')
  )
  port!: number

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || process.env.REDIS_PASSWORD || '')
  password?: string

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(15)
  @Transform(
    ({ value }) => parseInt(value) || parseInt(process.env.REDIS_DB || '0')
  )
  db?: number = 0
}

export class ServerConfig {
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(65535)
  @Transform(
    ({ value }) => parseInt(value) || parseInt(process.env.PORT || '9168')
  )
  port!: number

  @IsString()
  @IsIn([Environment.DEVELOPMENT, Environment.PRODUCTION, Environment.TEST])
  @Transform(
    ({ value }) => value || process.env.NODE_ENV || Environment.DEVELOPMENT
  )
  environment!: Environment

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || process.env.HOST || 'localhost')
  host?: string = 'localhost'

  @IsOptional()
  @IsString()
  @Transform(
    ({ value }) => value || process.env.FRONTEND_URL || 'http://localhost:9158'
  )
  frontendUrl?: string

  @IsOptional()
  @IsString()
  @Transform(
    ({ value }) => value || process.env.CORS_ORIGIN || 'http://localhost:9158'
  )
  corsOrigin?: string

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  enableCors?: boolean = true

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  enableHotReload?: boolean = true
}

export class SecurityConfig {
  @IsString()
  @Transform(({ value }) => value || process.env.JWT_SECRET)
  jwtSecret!: string

  @IsString()
  @Transform(({ value }) => value || process.env.JWT_EXPIRES_IN || '7d')
  jwtExpiresIn!: string

  @IsString()
  @Transform(({ value }) => value || process.env.JWT_REFRESH_SECRET)
  jwtRefreshSecret!: string

  @IsString()
  @Transform(
    ({ value }) => value || process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  )
  jwtRefreshExpiresIn!: string

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(10)
  @Max(20)
  @Transform(
    ({ value }) =>
      parseInt(value) || parseInt(process.env.BCRYPT_ROUNDS || '12')
  )
  bcryptRounds?: number = 12

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(30000)
  @Max(3600000)
  @Transform(
    ({ value }) =>
      parseInt(value) || parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000')
  )
  rateLimitWindowMs?: number = 900000

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Transform(
    ({ value }) =>
      parseInt(value) || parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  )
  rateLimitMaxRequests?: number = 100
}

export class LoggingConfig {
  @IsString()
  @IsIn(['error', 'warn', 'info', 'debug', 'verbose'])
  @Transform(({ value }) => value || process.env.LOG_LEVEL || 'info')
  level!: string

  @IsOptional()
  @IsString()
  @IsIn(['json', 'simple', 'combined'])
  @Transform(({ value }) => value || process.env.LOG_FORMAT || 'json')
  format?: string = 'json'

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  enableFileLogging?: boolean = true

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  enableConsoleLogging?: boolean = true
}

export class CacheConfig {
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(60)
  @Max(86400)
  @Transform(
    ({ value }) => parseInt(value) || parseInt(process.env.CACHE_TTL || '3600')
  )
  ttl?: number = 3600

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(10)
  @Max(10000)
  @Transform(
    ({ value }) =>
      parseInt(value) || parseInt(process.env.CACHE_MAX_SIZE || '1000')
  )
  maxSize?: number = 1000
}

export class PgAdminConfig {
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(65535)
  @Transform(
    ({ value }) =>
      parseInt(value) || parseInt(process.env.PGADMIN_PORT || '9188')
  )
  port?: number = 9188

  @IsOptional()
  @IsString()
  @Transform(
    ({ value }) =>
      value || process.env.PGADMIN_DEFAULT_EMAIL || 'admin@noteum.dev'
  )
  defaultEmail?: string

  @IsOptional()
  @IsString()
  @Transform(
    ({ value }) => value || process.env.PGADMIN_DEFAULT_PASSWORD || 'admin123'
  )
  defaultPassword?: string
}

export class AppConfig {
  @IsString()
  @Transform(
    ({ value }) => value || process.env.npm_package_name || 'noteum-services'
  )
  name!: string

  @IsString()
  @Transform(({ value }) => value || process.env.npm_package_version || '1.0.0')
  version!: string

  @IsString()
  @Transform(
    ({ value }) => value || process.env.COMPOSE_PROJECT_NAME || 'noteum'
  )
  composeProjectName!: string

  database!: DatabaseConfig
  redis!: RedisConfig
  server!: ServerConfig
  security!: SecurityConfig
  logging!: LoggingConfig
  cache!: CacheConfig

  @IsOptional()
  pgadmin?: PgAdminConfig

  // OpenAI Configuration
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || process.env.OPENAI_API_KEY)
  openaiApiKey?: string

  @IsOptional()
  @IsString()
  @Transform(
    ({ value }) => value || process.env.OPENAI_MODEL || 'text-embedding-ada-002'
  )
  openaiModel?: string

  // Vector Search Configuration
  @IsOptional()
  @IsNumber()
  @Transform(
    ({ value }) =>
      parseFloat(value) ||
      parseFloat(process.env.VECTOR_SIMILARITY_THRESHOLD || '0.7')
  )
  vectorSimilarityThreshold?: number

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(
    ({ value }) =>
      parseInt(value) || parseInt(process.env.VECTOR_SEARCH_LIMIT || '10')
  )
  vectorSearchLimit?: number

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Transform(
    ({ value }) =>
      parseInt(value) || parseInt(process.env.VECTOR_DIMENSION || '1536')
  )
  vectorDimension?: number

  // Monitoring Configuration
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  metricsEnabled?: boolean = true

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(65535)
  @Transform(
    ({ value }) =>
      parseInt(value) || parseInt(process.env.METRICS_PORT || '9464')
  )
  metricsPort?: number = 9464

  // Health Check Configuration
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  healthCheckEnabled?: boolean = true

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(5000)
  @Max(300000)
  @Transform(
    ({ value }) =>
      parseInt(value) || parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000')
  )
  healthCheckInterval?: number = 30000
}

export function validateConfig(config: Record<string, unknown>): AppConfig {
  const validatedConfig = plainToInstance(AppConfig, config, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  })

  const errors = validateSync(validatedConfig, {
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    const errorMessages = errors
      .map(error => {
        const constraints = Object.values(error.constraints || {})
        return `${error.property}: ${constraints.join(', ')}`
      })
      .join('; ')

    throw new Error(`Configuration validation failed: ${errorMessages}`)
  }

  return validatedConfig
}

export type ConfigValidationResult = {
  isValid: boolean
  config: AppConfig
  errors?: string[]
}

export function validateEnvironmentVariables(
  envVars: NodeJS.ProcessEnv
): ConfigValidationResult {
  try {
    const config = validateConfig(envVars)
    return {
      isValid: true,
      config,
    }
  } catch (error) {
    return {
      isValid: false,
      config: {} as AppConfig,
      errors:
        error instanceof Error ? [error.message] : ['Unknown validation error'],
    }
  }
}
