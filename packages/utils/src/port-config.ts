/**
 * Port configuration utilities for Noteum development environment
 * Defines standard port mappings and validation rules
 */

export enum ServiceType {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  CACHE = 'cache',
  ADMIN = 'admin',
}

export interface PortConfiguration {
  service: ServiceType
  internalPort: number
  externalPort: number
  protocol: 'tcp' | 'udp'
  description: string
  environment: 'development' | 'production' | 'test'
}

export interface PortRange {
  min: number
  max: number
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Standard port configuration for Noteum services
 */
export const STANDARD_PORTS: Record<ServiceType, PortConfiguration> = {
  [ServiceType.FRONTEND]: {
    service: ServiceType.FRONTEND,
    internalPort: 5173,
    externalPort: 9158,
    protocol: 'tcp',
    description: 'Vite development server',
    environment: 'development',
  },
  [ServiceType.BACKEND]: {
    service: ServiceType.BACKEND,
    internalPort: 3000,
    externalPort: 9168,
    protocol: 'tcp',
    description: 'NestJS API server',
    environment: 'development',
  },
  [ServiceType.DATABASE]: {
    service: ServiceType.DATABASE,
    internalPort: 5432,
    externalPort: 9198,
    protocol: 'tcp',
    description: 'PostgreSQL database',
    environment: 'development',
  },
  [ServiceType.CACHE]: {
    service: ServiceType.CACHE,
    internalPort: 6379,
    externalPort: 9178,
    protocol: 'tcp',
    description: 'Redis cache',
    environment: 'development',
  },
  [ServiceType.ADMIN]: {
    service: ServiceType.ADMIN,
    internalPort: 80,
    externalPort: 9188,
    protocol: 'tcp',
    description: 'PgAdmin database management',
    environment: 'development',
  },
}

/**
 * Development port range (9150-9199)
 */
export const DEVELOPMENT_PORT_RANGE: PortRange = {
  min: 9150,
  max: 9199,
}

/**
 * Reserved ports that should not be used
 */
export const RESERVED_PORTS = [
  3000, // Common development server
  3001, // Alternative development server
  5000, // Common alternative port
  8000, // Common development port
  8080, // Common web server port
  9000, // Common development port
  5432, // Default PostgreSQL
  6379, // Default Redis
  27017, // Default MongoDB
  3306, // Default MySQL
  22, // SSH
  80, // HTTP
  443, // HTTPS
  3389, // RDP
  5900, // VNC
]

/**
 * Get port configuration for a service
 */
export function getPortConfig(service: ServiceType): PortConfiguration {
  return STANDARD_PORTS[service]
}

/**
 * Get all standard port configurations
 */
export function getAllPortConfigs(): PortConfiguration[] {
  return Object.values(STANDARD_PORTS)
}

/**
 * Check if a port is in the development range
 */
export function isDevelopmentPort(port: number): boolean {
  return (
    port >= DEVELOPMENT_PORT_RANGE.min && port <= DEVELOPMENT_PORT_RANGE.max
  )
}

/**
 * Check if a port is reserved
 */
export function isReservedPort(port: number): boolean {
  return RESERVED_PORTS.includes(port)
}

/**
 * Validate port number
 */
export function validatePort(port: number): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check port range
  if (port < 1 || port > 65535) {
    errors.push(`Port ${port} is outside valid range (1-65535)`)
  }

  // Check system ports
  if (port < 1024) {
    warnings.push(
      `Port ${port} is a system port (< 1024) and may require elevated privileges`
    )
  }

  // Check if reserved
  if (isReservedPort(port)) {
    warnings.push(
      `Port ${port} is commonly used by other services and may cause conflicts`
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Get service type by external port
 */
export function getServiceByPort(port: number): ServiceType | null {
  const config = Object.values(STANDARD_PORTS).find(
    (config) => config.externalPort === port
  )
  return config ? config.service : null
}

/**
 * Format port configuration for display
 */
export function formatPortConfig(config: PortConfiguration): string {
  return `${config.service}: ${config.externalPort} (internal: ${config.internalPort})`
}
