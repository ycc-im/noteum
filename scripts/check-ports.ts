#!/usr/bin/env node

/**
 * Port availability checker for Noteum development environment
 * Detects port conflicts and suggests resolutions
 */

import { createServer } from 'net'
import { exec } from 'child_process'
import { promisify } from 'util'
import {
  STANDARD_PORTS,
  validatePort,
  isDevelopmentPort,
} from '../packages/utils/src/port-config'

const execAsync = promisify(exec)

interface PortCheckResult {
  port: number
  isAvailable: boolean
  occupiedBy?: string
  processId?: number
  conflictResolution?: string
}

interface PortCheckSummary {
  results: PortCheckResult[]
  conflicts: PortCheckResult[]
  available: PortCheckResult[]
  timestamp: Date
}

/**
 * Check if a specific port is available
 */
async function checkPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer()

    server.listen(port, () => {
      server.once('close', () => {
        resolve(true)
      })
      server.close()
    })

    server.on('error', () => {
      resolve(false)
    })
  })
}

/**
 * Get process information using a port
 */
async function getPortProcess(port: number): Promise<string | null> {
  try {
    const platform = process.platform

    if (platform === 'darwin') {
      // macOS
      const { stdout } = await execAsync(`lsof -ti:${port} | head -1`)
      const pid = stdout.trim()
      if (pid) {
        const { stdout: cmdOutput } = await execAsync(`ps -p ${pid} -o comm=`)
        return `${cmdOutput.trim()} (PID: ${pid})`
      }
    } else if (platform === 'linux') {
      // Linux
      const { stdout } = await execAsync(`netstat -tlnp | grep :${port}`)
      const match = stdout.match(/(\d+)\/(.+)$/)
      if (match) {
        return `${match[2]} (PID: ${match[1]})`
      }
    } else if (platform === 'win32') {
      // Windows
      const { stdout } = await execAsync(`netstat -ano | findstr :${port}`)
      const match = stdout.match(/\s+(\d+)$/)
      if (match) {
        const pid = match[1]
        const { stdout: cmdOutput } = await execAsync(
          `tasklist /FI "PID eq ${pid}" /FO CSV | findstr /V "Image Name"`
        )
        return cmdOutput.replace(/"/g, '').trim()
      }
    }

    return null
  } catch (error) {
    return null
  }
}

/**
 * Suggest resolution for port conflict
 */
function suggestResolution(port: number, process?: string): string {
  const suggestions = []

  if (isDevelopmentPort(port)) {
    const alternativePort = port + 10
    suggestions.push(`Use alternative port ${alternativePort}`)
    suggestions.push("Stop the conflicting process if it's not needed")
  }

  if (process) {
    suggestions.push(`Kill process: ${process}`)
  }

  suggestions.push('Wait for the port to be released naturally')

  return suggestions.join(' | ')
}

/**
 * Check a single port
 */
async function checkPort(port: number): Promise<PortCheckResult> {
  const isAvailable = await checkPortAvailable(port)
  const validation = validatePort(port)

  if (isAvailable && validation.isValid) {
    return {
      port,
      isAvailable: true,
      conflictResolution: 'Port is available for use',
    }
  }

  const processInfo = await getPortProcess(port)
  const conflictResolution = suggestResolution(port, processInfo || undefined)

  return {
    port,
    isAvailable: false,
    occupiedBy: processInfo || 'Unknown process',
    conflictResolution,
  }
}

/**
 * Check all standard Noteum ports
 */
async function checkAllPorts(): Promise<PortCheckSummary> {
  const ports = Object.values(STANDARD_PORTS).map(
    (config) => config.externalPort
  )
  const results: PortCheckResult[] = []

  console.log('🔍 Checking Noteum port availability...')
  console.log('═'.repeat(50))

  for (const port of ports) {
    const result = await checkPort(port)
    results.push(result)

    const status = result.isAvailable ? '✅' : '❌'
    const service = Object.values(STANDARD_PORTS).find(
      (config) => config.externalPort === port
    )
    const serviceName = service ? service.service : 'Unknown'

    console.log(
      `${status} Port ${port} (${serviceName}): ${result.isAvailable ? 'Available' : 'Occupied'}`
    )

    if (!result.isAvailable) {
      console.log(`   └─ ${result.occupiedBy}`)
      console.log(`   └─ Resolution: ${result.conflictResolution}`)
    }
  }

  const conflicts = results.filter((r) => !r.isAvailable)
  const available = results.filter((r) => r.isAvailable)

  console.log('═'.repeat(50))
  console.log(
    `📊 Summary: ${available.length} available, ${conflicts.length} conflicts`
  )

  if (conflicts.length > 0) {
    console.log('\n⚠️  Port conflicts detected:')
    conflicts.forEach((conflict) => {
      console.log(`   • Port ${conflict.port}: ${conflict.occupiedBy}`)
    })
    console.log('\n💡 To resolve conflicts:')
    console.log('   1. Stop conflicting processes if not needed')
    console.log('   2. Use alternative ports in your .env.local')
    console.log('   3. Wait for ports to be released naturally')
  } else {
    console.log(
      '🎉 All ports are available! You can start the development environment.'
    )
  }

  return {
    results,
    conflicts,
    available,
    timestamp: new Date(),
  }
}

/**
 * Check specific ports provided as arguments
 */
async function checkSpecificPorts(portNumbers: number[]): Promise<void> {
  console.log('🔍 Checking specific ports...')
  console.log('═'.repeat(50))

  for (const port of portNumbers) {
    const result = await checkPort(port)
    const status = result.isAvailable ? '✅' : '❌'
    console.log(
      `${status} Port ${port}: ${result.isAvailable ? 'Available' : 'Occupied'}`
    )

    if (!result.isAvailable) {
      console.log(`   └─ ${result.occupiedBy}`)
      console.log(`   └─ Resolution: ${result.conflictResolution}`)
    }
  }
}

/**
 * Watch ports for changes (continuous monitoring)
 */
async function watchPorts(intervalMs: number = 5000): Promise<void> {
  console.log(`👁️  Watching ports (checking every ${intervalMs}ms)...`)
  console.log('Press Ctrl+C to stop')
  console.log('═'.repeat(50))

  let lastConflicts: number[] = []

  const check = async () => {
    const summary = await checkAllPorts()
    const currentConflicts = summary.conflicts.map((c) => c.port)

    // Detect changes
    const newConflicts = currentConflicts.filter(
      (p) => !lastConflicts.includes(p)
    )
    const resolvedConflicts = lastConflicts.filter(
      (p) => !currentConflicts.includes(p)
    )

    if (newConflicts.length > 0) {
      console.log(`\n⚠️  New conflicts detected: ${newConflicts.join(', ')}`)
    }

    if (resolvedConflicts.length > 0) {
      console.log(`\n✅ Ports resolved: ${resolvedConflicts.join(', ')}`)
    }

    lastConflicts = currentConflicts
  }

  // Initial check
  await check()

  // Set up interval
  const interval = setInterval(check, intervalMs)

  // Handle cleanup
  process.on('SIGINT', () => {
    clearInterval(interval)
    console.log('\n👋 Stopped port monitoring')
    process.exit(0)
  })
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: check-ports.ts [options] [ports...]

Options:
  --help, -h     Show this help message
  --watch, -w    Watch ports continuously (default: 5s interval)
  --interval N   Set watch interval in milliseconds (default: 5000)

Examples:
  check-ports.ts                # Check all Noteum standard ports
  check-ports.ts 9158 9168      # Check specific ports
  check-ports.ts --watch        # Watch ports continuously
  check-ports.ts --interval 2000 # Watch with 2s interval
    `)
    return
  }

  const watchIndex = args.findIndex((arg) => arg === '--watch' || arg === '-w')
  const intervalIndex = args.findIndex((arg) => arg === '--interval')

  if (watchIndex !== -1) {
    const intervalMs =
      intervalIndex !== -1 ? parseInt(args[intervalIndex + 1]) || 5000 : 5000
    await watchPorts(intervalMs)
    return
  }

  // Extract port numbers from arguments
  const portNumbers = args
    .filter((arg) => !arg.startsWith('--'))
    .map((arg) => parseInt(arg))
    .filter((num) => !isNaN(num) && num > 0 && num <= 65535)

  if (portNumbers.length > 0) {
    await checkSpecificPorts(portNumbers)
  } else {
    await checkAllPorts()
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Error checking ports:', error.message)
    process.exit(1)
  })
}

export { checkPort, checkAllPorts, checkSpecificPorts, watchPorts }
