/**
 * Port configuration validation utilities
 * Provides comprehensive validation for port assignments and configurations
 */

import {
  PortConfiguration,
  ServiceType,
  ValidationResult,
  STANDARD_PORTS,
  validatePort,
  isDevelopmentPort,
  getServiceByPort
} from './port-config'

export interface PortConflict {
  port: number
  services: string[]
  severity: 'error' | 'warning'
  message: string
}

export interface ConfigurationValidationResult extends ValidationResult {
  conflicts: PortConflict[]
  suggestions: string[]
  warnings: string[]
}

/**
 * Validate a single port configuration
 */
export function validatePortConfiguration(config: PortConfiguration): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Basic port validation
  const portValidation = validatePort(config.externalPort)
  errors.push(...portValidation.errors)
  warnings.push(...portValidation.warnings)

  // Validate service type
  if (!Object.values(ServiceType).includes(config.service)) {
    errors.push(`Invalid service type: ${config.service}`)
  }

  // Validate protocol
  if (!['tcp', 'udp'].includes(config.protocol)) {
    errors.push(`Invalid protocol: ${config.protocol}. Must be 'tcp' or 'udp'`)
  }

  // Check if port matches standard configuration
  const standardConfig = STANDARD_PORTS[config.service]
  if (standardConfig && standardConfig.externalPort !== config.externalPort) {
    warnings.push(`Port ${config.externalPort} differs from standard ${standardConfig.externalPort} for ${config.service}`)
  }

  // Validate environment
  if (!['development', 'production', 'test'].includes(config.environment)) {
    errors.push(`Invalid environment: ${config.environment}`)
  }

  // Check if internal port is reasonable for the service
  if (config.service === ServiceType.FRONTEND && config.internalPort < 3000) {
    warnings.push(`Internal port ${config.internalPort} may be too low for frontend service`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Detect port conflicts in a configuration list
 */
export function detectPortConflicts(configs: PortConfiguration[]): PortConflict[] {
  const conflicts: PortConflict[] = []
  const portMap = new Map<number, PortConfiguration[]>()

  // Group configurations by external port
  configs.forEach(config => {
    if (!portMap.has(config.externalPort)) {
      portMap.set(config.externalPort, [])
    }
    portMap.get(config.externalPort)!.push(config)
  })

  // Check for conflicts
  portMap.forEach((serviceConfigs, port) => {
    if (serviceConfigs.length > 1) {
      conflicts.push({
        port,
        services: serviceConfigs.map(config => config.service),
        severity: 'error',
        message: `Port ${port} is assigned to multiple services: ${serviceConfigs.map(s => s.service).join(', ')}`
      })
    }
  })

  // Check for conflicts with standard ports
  configs.forEach(config => {
    const standardConfig = STANDARD_PORTS[config.service]
    if (standardConfig) {
      Object.values(STANDARD_PORTS).forEach(otherStandard => {
        if (otherStandard.service !== config.service &&
            config.externalPort === otherStandard.externalPort) {
          conflicts.push({
            port: config.externalPort,
            services: [config.service, otherStandard.service],
            severity: 'warning',
            message: `Port ${config.externalPort} conflicts with standard port for ${otherStandard.service}`
          })
        }
      })
    }
  })

  return conflicts
}

/**
 * Validate complete port configuration
 */
export function validateCompleteConfiguration(configs: PortConfiguration[]): ConfigurationValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const suggestions: string[] = []
  const allConflicts = detectPortConflicts(configs)

  // Validate each configuration
  configs.forEach((config, index) => {
    const validation = validatePortConfiguration(config)
    if (!validation.isValid) {
      errors.push(`Configuration ${index + 1} (${config.service}): ${validation.errors.join(', ')}`)
    }
    warnings.push(...validation.warnings.map(w => `Configuration ${index + 1} (${config.service}): ${w}`))
  })

  // Check for missing required services
  const requiredServices = [ServiceType.FRONTEND, ServiceType.BACKEND, ServiceType.DATABASE, ServiceType.CACHE]
  const configuredServices = configs.map(c => c.service)

  requiredServices.forEach(service => {
    if (!configuredServices.includes(service)) {
      warnings.push(`Missing configuration for required service: ${service}`)
    }
  })

  // Add conflict errors
  allConflicts.forEach(conflict => {
    if (conflict.severity === 'error') {
      errors.push(conflict.message)
    } else {
      warnings.push(conflict.message)
    }
  })

  // Generate suggestions
  if (allConflicts.length > 0) {
    suggestions.push('Resolve port conflicts by using different external ports')
  }

  const errorPorts = allConflicts.filter(c => c.severity === 'error').map(c => c.port)
  if (errorPorts.length > 0) {
    suggestions.push(`Consider using alternative ports for: ${errorPorts.join(', ')}`)
  }

  // Check for port range consistency
  const devPorts = configs.filter(c => c.environment === 'development')
  const nonDevPorts = devPorts.filter(c => !isDevelopmentPort(c.externalPort))

  if (nonDevPorts.length > 0) {
    warnings.push(`Some development services use ports outside development range: ${nonDevPorts.map(c => `${c.service}(${c.externalPort})`).join(', ')}`)
    suggestions.push('Consider using ports in the 9150-9199 range for development services')
  }

  return {
    isValid: errors.length === 0 && allConflicts.filter(c => c.severity === 'error').length === 0,
    errors,
    warnings,
    conflicts: allConflicts,
    suggestions
  }
}

/**
 * Get suggested port for a service if current port is unavailable
 */
export function suggestAlternativePort(service: ServiceType, currentPort: number, occupiedPorts: number[]): number {
  const standardConfig = STANDARD_PORTS[service]
  let suggestedPort = standardConfig?.externalPort || currentPort

  // If current port is occupied, find next available port in development range
  if (occupiedPorts.includes(suggestedPort)) {
    suggestedPort = Math.max(9150, suggestedPort + 1)

    while (occupiedPorts.includes(suggestedPort) && suggestedPort < 9199) {
      suggestedPort++
    }

    // If we've exhausted the development range, try other ranges
    if (suggestedPort >= 9199) {
      suggestedPort = 10000
      while (occupiedPorts.includes(suggestedPort) && suggestedPort < 65535) {
        suggestedPort++
      }
    }
  }

  return suggestedPort <= 65535 ? suggestedPort : currentPort
}

/**
 * Validate port assignments for Docker Compose
 */
export function validateDockerPorts(configs: PortConfiguration[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  configs.forEach(config => {
    // Check if external port is in privileged range
    if (config.externalPort < 1024) {
      warnings.push(`Docker port ${config.externalPort} is in privileged range and may require elevated privileges`)
    }

    // Check for potential Docker port conflicts
    const commonDockerPorts = [80, 443, 8080, 8443, 3000, 5000, 8000, 9000]
    if (commonDockerPorts.includes(config.externalPort)) {
      warnings.push(`Docker port ${config.externalPort} is commonly used by other Docker services`)
    }

    // Validate internal port is accessible from within container
    if (config.internalPort < 1 || config.internalPort > 65535) {
      errors.push(`Internal port ${config.internalPort} is outside valid range for ${config.service}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Check if configuration follows best practices
 */
export function checkBestPractices(configs: PortConfiguration[]): { issues: string[], recommendations: string[] } {
  const issues: string[] = []
  const recommendations: string[] = []

  // Check for consistent port numbering
  const servicePorts = new Map<ServiceType, number>()
  configs.forEach(config => {
    servicePorts.set(config.service, config.externalPort)
  })

  // Check if ports follow logical sequence
  const portNumbers = Array.from(servicePorts.values()).sort((a, b) => a - b)
  for (let i = 1; i < portNumbers.length; i++) {
    if (portNumbers[i] - portNumbers[i-1] > 100) {
      recommendations.push('Consider using more closely spaced port numbers for better organization')
      break
    }
  }

  // Check for environment-specific recommendations
  const devConfigs = configs.filter(c => c.environment === 'development')
  if (devConfigs.length > 0) {
    const hasDevRange = devConfigs.every(c => isDevelopmentPort(c.externalPort))
    if (!hasDevRange) {
      recommendations.push('Use development port range (9150-9199) for development environment')
    }
  }

  // Check for documentation
  if (configs.some(c => !c.description || c.description.trim() === '')) {
    issues.push('All port configurations should have descriptions for documentation')
  }

  return { issues, recommendations }
}