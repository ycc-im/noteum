#!/usr/bin/env node

/**
 * Port Validation Script
 *
 * This script validates that all port configurations are correct
 * and no conflicts exist between services.
 */

import { checkPortConflicts, ServiceType, STANDARD_PORTS } from '../packages/utils/src/port-config'
import { validateBackendPortConfig } from '../apps/services/src/config/ports'
import { validateFrontendPortConfig } from '../apps/client/src/config/ports'

const PORTS = [
  STANDARD_PORTS[ServiceType.FRONTEND].externalPort,
  STANDARD_PORTS[ServiceType.BACKEND].externalPort,
  STANDARD_PORTS[ServiceType.DATABASE].externalPort,
  STANDARD_PORTS[ServiceType.CACHE].externalPort,
  STANDARD_PORTS[ServiceType.ADMIN].externalPort,
]

async function validatePorts() {
  console.log('🔍 Validating port configurations...\n')

  let hasErrors = false
  let hasWarnings = false

  // Validate frontend configuration
  console.log('📱 Frontend Port Configuration:')
  const frontendValidation = validateFrontendPortConfig()

  if (frontendValidation.isValid) {
    console.log('✅ Frontend port configuration is valid')
  } else {
    console.log('❌ Frontend port configuration has errors:')
    frontendValidation.errors.forEach(error => console.log(`   - ${error}`))
    hasErrors = true
  }

  if (frontendValidation.warnings.length > 0) {
    console.log('⚠️  Frontend port configuration warnings:')
    frontendValidation.warnings.forEach(warning => console.log(`   - ${warning}`))
    hasWarnings = true
  }

  // Validate backend configuration
  console.log('\n🔧 Backend Port Configuration:')
  const backendValidation = validateBackendPortConfig()

  if (backendValidation.isValid) {
    console.log('✅ Backend port configuration is valid')
  } else {
    console.log('❌ Backend port configuration has errors:')
    backendValidation.errors.forEach(error => console.log(`   - ${error}`))
    hasErrors = true
  }

  if (backendValidation.warnings.length > 0) {
    console.log('⚠️  Backend port configuration warnings:')
    backendValidation.warnings.forEach(warning => console.log(`   - ${warning}`))
    hasWarnings = true
  }

  // Check for port conflicts
  console.log('\n🔍 Checking for port conflicts...')
  const conflicts = await checkPortConflicts(PORTS)

  if (conflicts.length === 0) {
    console.log('✅ No port conflicts detected')
  } else {
    console.log('❌ Port conflicts detected:')
    conflicts.forEach(conflict => {
      console.log(`   - Port ${conflict.port}: ${conflict.description}`)
      if (conflict.process) {
        console.log(`     Process: ${conflict.process.name} (PID: ${conflict.process.pid})`)
      }
    })
    hasErrors = true
  }

  // Display port summary
  console.log('\n📊 Port Configuration Summary:')
  Object.entries(STANDARD_PORTS).forEach(([serviceType, config]) => {
    const status = conflicts.some(c => c.port === config.externalPort) ? '❌' : '✅'
    console.log(`   ${status} ${serviceType}: ${config.externalPort} (${config.description})`)
  })

  // Final result
  console.log('\n' + '='.repeat(50))

  if (hasErrors) {
    console.log('❌ Port validation failed!')
    console.log('Please resolve the errors above before starting the development environment.')
    process.exit(1)
  } else if (hasWarnings) {
    console.log('⚠️  Port validation completed with warnings.')
    console.log('You can proceed, but consider addressing the warnings.')
    process.exit(0)
  } else {
    console.log('✅ All port configurations are valid!')
    console.log('Development environment is ready to start.')
    process.exit(0)
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  validatePorts().catch(error => {
    console.error('❌ Unexpected error during port validation:', error)
    process.exit(1)
  })
}