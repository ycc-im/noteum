// Environment Enum
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

// Log Levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

// User Roles
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

// Permission Types
export enum Permission {
  // Document permissions
  READ_DOCUMENT = 'READ_DOCUMENT',
  WRITE_DOCUMENT = 'WRITE_DOCUMENT',
  DELETE_DOCUMENT = 'DELETE_DOCUMENT',
  SHARE_DOCUMENT = 'SHARE_DOCUMENT',

  // System permissions
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_SYSTEM = 'MANAGE_SYSTEM',
}

// HTTP Status Codes
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

// Cache TTL Constants (in seconds)
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
  WEEK: 604800, // 7 days
} as const

// Pagination Defaults
export const Pagination = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const

// File Upload Constraints
export const UploadConstraints = {
  MAX_SIZE_IMAGES: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_DOCUMENTS: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const

// Rate Limiting
export const RateLimit = {
  DEFAULT_WINDOW_MS: 60 * 1000, // 1 minute
  DEFAULT_MAX_REQUESTS: 100,
  AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  AUTH_MAX_REQUESTS: 5, // For sensitive operations like login
} as const

// JWT Expiration Times
export const JWT_EXPIRATION = {
  ACCESS_TOKEN: '15m',
  REFRESH_TOKEN: '7d',
  SESSION_TOKEN: '30d',
} as const

// Database Connection Pool Settings
export const DatabasePool = {
  MIN: 2,
  MAX: 20,
  IDLE_TIMEOUT_MILLIS: 30000,
  CONNECTION_TIMEOUT_MILLIS: 2000,
} as const
