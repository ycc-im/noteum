import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) { }

  // App Configuration
  get app() {
    return {
      name: this.configService.get<string>('app.name'),
      version: this.configService.get<string>('app.version'),
      environment: this.configService.get<string>('app.environment'),
      port: this.configService.get<number>('app.port'),
      apiPrefix: this.configService.get<string>('app.apiPrefix'),
    }
  }

  // Database Configuration
  get database() {
    return {
      url: this.configService.get<string>('database.url'),
      ssl: this.configService.get<boolean>('database.ssl'),
      maxConnections: this.configService.get<number>('database.maxConnections'),
      connectionTimeout: this.configService.get<number>(
        'database.connectionTimeout'
      ),
    }
  }

  // Redis Configuration
  get redis() {
    return {
      url: this.configService.get<string>('redis.url'),
      maxRetriesPerRequest: this.configService.get<number>(
        'redis.maxRetriesPerRequest'
      ),
      retryDelayOnFailover: this.configService.get<number>(
        'redis.retryDelayOnFailover'
      ),
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
    }
  }

  // JWT Configuration
  get jwt() {
    return {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
      refreshExpiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    }
  }

  // WebSocket Configuration
  get websocket() {
    return {
      host: this.configService.get<string>('websocket.host'),
      port: this.configService.get<number>('websocket.port'),
      maxConnections: this.configService.get<number>(
        'websocket.maxConnections'
      ),
    }
  }

  // Upload Configuration
  get upload() {
    return {
      maxSize: this.configService.get<number>('upload.maxSize'),
      allowedTypes: this.configService.get<string[]>('upload.allowedTypes'),
      destination: this.configService.get<string>('upload.destination'),
    }
  }

  // Logger Configuration
  get logger() {
    return {
      level: this.configService.get<string>('logger.level'),
      format: this.configService.get<string>('logger.format'),
      maxSize: this.configService.get<string>('logger.maxSize'),
      maxFiles: this.configService.get<string>('logger.maxFiles'),
    }
  }

  // CORS Configuration
  get cors() {
    return {
      origin: this.configService.get<string[]>('cors.origin'),
      credentials: this.configService.get<boolean>('cors.credentials'),
    }
  }

  // Security Configuration
  get security() {
    return {
      rateLimit: {
        windowMs: this.configService.get<number>('security.rateLimit.windowMs'),
        max: this.configService.get<number>('security.rateLimit.max'),
      },
    }
  }

  // AI Configuration
  get ai() {
    return {
      openaiApiKey: this.configService.get<string>('ai.openaiApiKey'),
      embeddingModel: this.configService.get<string>('ai.embeddingModel'),
      maxTokens: this.configService.get<number>('ai.maxTokens'),
    }
  }

  // Environment check helpers
  get isDevelopment(): boolean {
    return this.app.environment === 'development'
  }

  get isProduction(): boolean {
    return this.app.environment === 'production'
  }

  get isTest(): boolean {
    return this.app.environment === 'test'
  }
}
