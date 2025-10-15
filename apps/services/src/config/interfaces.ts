export interface AppConfig {
  name: string
  version: string
  environment: string
  port: number
  apiPrefix: string
}

export interface DatabaseConfig {
  url: string
  ssl: boolean
  maxConnections: number
  connectionTimeout: number
}

export interface RedisConfig {
  url: string
  host?: string
  port?: number
  password?: string
  maxRetriesPerRequest: number
  retryDelayOnFailover: number
}

export interface JWTConfig {
  secret: string
  expiresIn: string
  refreshExpiresIn: string
}

export interface WebSocketConfig {
  host: string
  port: number
  maxConnections: number
}

export interface UploadConfig {
  maxSize: number
  allowedTypes: string[]
  destination: string
}

export interface LoggerConfig {
  level: string
  format: string
  maxSize: string
  maxFiles: string
}

export interface CorsConfig {
  origin: string[]
  credentials: boolean
}

export interface SecurityConfig {
  rateLimit: {
    windowMs: number
    max: number
  }
}

export interface AIConfig {
  openaiApiKey?: string
  embeddingModel: string
  maxTokens: number
}

export interface EnvironmentConfig {
  app: AppConfig
  database: DatabaseConfig
  redis: RedisConfig
  jwt: JWTConfig
  websocket: WebSocketConfig
  upload: UploadConfig
  logger: LoggerConfig
  cors: CorsConfig
  security: SecurityConfig
  ai: AIConfig
}

// Redis connection options interface
export interface RedisConnectionOptions {
  host: string
  port: number
  password?: string
  db?: number
  retryDelayOnFailover?: number
  maxRetriesPerRequest?: number
  lazyConnect?: boolean
  keepAlive?: number
}

// Database connection options interface
export interface DatabaseConnectionOptions {
  url: string
  ssl?: boolean
  maxConnections?: number
  connectionTimeout?: number
}

// JWT payload interface
export interface JWTPayload {
  sub: string
  email: string
  role: string
  iat?: number
  exp?: number
}

// Session info interface
export interface SessionInfo {
  id: string
  userId: string
  deviceInfo?: any
  ipAddress?: string
  userAgent?: string
  isActive: boolean
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}