/**
 * Backend Port Configuration
 *
 * This file provides centralized port configuration for the backend service.
 * It imports shared utilities and exports backend-specific port settings.
 */

import { PortConfiguration, ServiceType } from '@noteum/utils'
import { STANDARD_PORTS } from '@noteum/utils'

/**
 * Backend port configuration
 */
export const BACKEND_PORT_CONFIG: PortConfiguration = STANDARD_PORTS[ServiceType.BACKEND]

/**
 * Database port configurations
 */
export const DATABASE_PORT_CONFIG = {
  postgresql: STANDARD_PORTS[ServiceType.POSTGRESQL],
  redis: STANDARD_PORTS[ServiceType.REDIS],
  pgAdmin: STANDARD_PORTS[ServiceType.PGADMIN],
} as const

/**
 * Backend environment variable names
 */
export const BACKEND_ENV_VARS = {
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  API_PREFIX: 'API_PREFIX',

  // Database
  DATABASE_URL: 'DATABASE_URL',
  DATABASE_SSL: 'DATABASE_SSL',
  DATABASE_MAX_CONNECTIONS: 'DATABASE_MAX_CONNECTIONS',
  DATABASE_TIMEOUT: 'DATABASE_TIMEOUT',

  // Redis
  REDIS_URL: 'REDIS_URL',
  REDIS_MAX_RETRIES: 'REDIS_MAX_RETRIES',
  REDIS_RETRY_DELAY: 'REDIS_RETRY_DELAY',

  // WebSocket
  YJS_HOST: 'YJS_HOST',
  YJS_PORT: 'YJS_PORT',
  WS_MAX_CONNECTIONS: 'WS_MAX_CONNECTIONS',

  // CORS
  CORS_ORIGIN: 'CORS_ORIGIN',
} as const

/**
 * Get backend port from environment or use default
 */
export const getBackendPort = (): number => {
  const envPort = process.env[BACKEND_ENV_VARS.PORT]
  return envPort ? parseInt(envPort, 10) : BACKEND_PORT_CONFIG.externalPort
}

/**
 * Get API prefix from environment or use default
 */
export const getApiPrefix = (): string => {
  return process.env[BACKEND_ENV_VARS.API_PREFIX] || 'api/v1'
}

/**
 * Get CORS origin from environment or construct it
 */
export const getCorsOrigin = (): string | string[] => {
  const corsOrigin = process.env[BACKEND_ENV_VARS.CORS_ORIGIN]
  if (corsOrigin) {
    return corsOrigin.split(',').map(origin => origin.trim())
  }

  const frontendPort = process.env.FRONTEND_PORT || '9158'
  return [`http://localhost:${frontendPort}`]
}

/**
 * Get database port configurations
 */
export const getDatabasePorts = () => {
  const databaseUrl = process.env[BACKEND_ENV_VARS.DATABASE_URL] || ''
  const redisUrl = process.env[BACKEND_ENV_VARS.REDIS_URL] || ''

  // Extract ports from URLs
  const postgresPort = extractPortFromUrl(databaseUrl) || DATABASE_PORT_CONFIG.postgresql.externalPort
  const redisPort = extractPortFromUrl(redisUrl) || DATABASE_PORT_CONFIG.redis.externalPort
  const pgAdminPort = DATABASE_PORT_CONFIG.pgAdmin.externalPort

  return {
    postgresql: postgresPort,
    redis: redisPort,
    pgAdmin: pgAdminPort,
  }
}

/**
 * Get WebSocket configuration
 */
export const getWebSocketConfig = () => {
  const host = process.env[BACKEND_ENV_VARS.YJS_HOST] || 'localhost'
  const port = process.env[BACKEND_ENV_VARS.YJS_PORT] || '3001'
  const maxConnections = parseInt(process.env[BACKEND_ENV_VARS.WS_MAX_CONNECTIONS] || '1000', 10)

  return {
    host,
    port: parseInt(port, 10),
    maxConnections,
  }
}

/**
 * Extract port number from URL
 */
function extractPortFromUrl(url: string): number | null {
  const match = url.match(/:(\d+)/)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Validate backend port configuration
 */
export const validateBackendPortConfig = (): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} => {
  const errors: string[] = []
  const warnings: string[] = []

  const backendPort = getBackendPort()
  const databasePorts = getDatabasePorts()

  // Validate backend port range
  if (backendPort < 1024 || backendPort > 65535) {
    errors.push(`Backend port ${backendPort} is outside valid range (1024-65535)`)
  }

  // Validate database port ranges
  Object.entries(databasePorts).forEach(([service, port]) => {
    if (port < 1024 || port > 65535) {
      errors.push(`${service} port ${port} is outside valid range (1024-65535)`)
    }
  })

  // Check for port conflicts
  const allPorts = [backendPort, ...Object.values(databasePorts)]
  const portCounts = allPorts.reduce((acc, port) => {
    acc[port] = (acc[port] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  Object.entries(portCounts).forEach(([port, count]) => {
    if (Number(count) > 1) {
      errors.push(`Port ${port} is used by multiple services`)
    }
  })

  // Validate reserved ports
  if (backendPort < 2048) {
    warnings.push(`Backend port ${backendPort} is in the privileged range (<2048)`)
  }

  // Check for common port conflicts
  const conflictPorts = [3000, 3001, 8080, 4200, 8000, 9000, 5432, 6379]
  if (conflictPorts.includes(backendPort)) {
    warnings.push(`Backend port ${backendPort} is commonly used by other services`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}