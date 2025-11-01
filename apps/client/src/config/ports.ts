/**
 * Frontend Port Configuration
 *
 * This file provides centralized port configuration for the frontend service.
 * It imports shared utilities and exports frontend-specific port settings.
 */

import { PortConfiguration, ServiceType } from '@noteum/utils'
import { STANDARD_PORTS } from '@noteum/utils'

/**
 * Frontend port configuration
 */
export const FRONTEND_PORT_CONFIG: PortConfiguration =
  STANDARD_PORTS[ServiceType.FRONTEND]

/**
 * Frontend environment variable names
 */
export const FRONTEND_ENV_VARS = {
  PORT: 'FRONTEND_PORT',
  API_URL: 'VITE_API_URL',
  APP_NAME: 'VITE_APP_NAME',
  ENABLE_DEBUG: 'VITE_ENABLE_DEBUG',
  DEFAULT_THEME: 'VITE_DEFAULT_THEME',
} as const

/**
 * Get frontend port from environment or use default
 */
export const getFrontendPort = (): number => {
  const envPort = process.env[FRONTEND_ENV_VARS.PORT]
  return envPort ? parseInt(envPort, 10) : FRONTEND_PORT_CONFIG.externalPort
}

/**
 * Get API URL from environment or construct it
 */
export const getApiUrl = (): string => {
  const envUrl = process.env[FRONTEND_ENV_VARS.API_URL]
  if (envUrl) {
    return envUrl
  }

  const backendPort = process.env.BACKEND_PORT || '9168'
  return `http://localhost:${backendPort}`
}

/**
 * Validate frontend port configuration
 */
export const validateFrontendPortConfig = (): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} => {
  const errors: string[] = []
  const warnings: string[] = []

  const port = getFrontendPort()

  // Validate port range
  if (port < 1024 || port > 65535) {
    errors.push(`Frontend port ${port} is outside valid range (1024-65535)`)
  }

  // Validate reserved ports
  if (port < 2048) {
    warnings.push(`Frontend port ${port} is in the privileged range (<2048)`)
  }

  // Check for common port conflicts
  const conflictPorts = [3000, 3001, 8080, 4200, 8000, 9000]
  if (conflictPorts.includes(port)) {
    warnings.push(
      `Frontend port ${port} is commonly used by other development tools`
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
