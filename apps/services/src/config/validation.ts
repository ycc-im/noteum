import { plainToClass, Transform } from 'class-transformer'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  validateSync,
} from 'class-validator'

enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.DEVELOPMENT

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number = 3000

  @IsString()
  @IsOptional()
  API_PREFIX: string = 'api/v1'

  @IsString()
  @IsOptional()
  DATABASE_URL: string =
    'postgresql://postgres:password@localhost:5432/noteum?schema=public'

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  DATABASE_SSL: boolean = false

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  DATABASE_MAX_CONNECTIONS: number = 20

  @IsString()
  @IsOptional()
  REDIS_URL: string = 'redis://localhost:6379'

  @IsString()
  @IsOptional()
  JWT_SECRET: string = 'your-super-secret-jwt-key'

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '7d'

  @IsString()
  @IsOptional()
  YJS_HOST: string = 'localhost'

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  YJS_PORT: number = 3001

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  UPLOAD_MAX_SIZE: number = 10485760

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  UPLOAD_ALLOWED_TYPES: string[] = ['image/jpeg', 'image/png', 'image/gif']

  @IsEnum(LogLevel)
  @IsOptional()
  LOG_LEVEL: LogLevel = LogLevel.INFO

  @IsString()
  @IsOptional()
  LOG_FORMAT: string = 'json'

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  CORS_ORIGIN: string[] = ['http://localhost:3000']

  @IsString()
  @IsOptional()
  OPENAI_API_KEY?: string
}

export function validateConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    console.error('Configuration validation error: ', errors)
    throw new Error(errors.toString())
  }

  return validatedConfig
}
