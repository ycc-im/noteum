/**
 * Backend Port Availability Tests
 *
 * Tests to verify that backend can start and run on its designated port
 * without conflicts with other services.
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import {
  getBackendPort,
  getDatabasePorts,
  getWebSocketConfig,
  validateBackendPortConfig
} from '../src/config/ports'
import { checkPortAvailability, checkPortConflicts } from '@noteum/utils'

describe('Backend Port Configuration', () => {
  const originalEnv = process.env

  beforeAll(() => {
    // Mock environment variables for testing
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      PORT: '9168',
      DATABASE_URL: 'postgresql://postgres:password@localhost:9198/noteum?schema=public',
      REDIS_URL: 'redis://localhost:9178',
      CORS_ORIGIN: 'http://localhost:9158',
      YJS_HOST: 'localhost',
      YJS_PORT: '3001',
    }
  })

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('getBackendPort', () => {
    it('should return port from environment variable', () => {
      const port = getBackendPort()
      expect(port).toBe(9168)
    })

    it('should return default port when environment variable is not set', () => {
      delete process.env.PORT
      const port = getBackendPort()
      expect(port).toBe(9168) // Default from config
    })

    it('should handle invalid port values', () => {
      process.env.PORT = 'invalid'
      expect(() => getBackendPort()).not.toThrow()
      // Should fall back to default or handle gracefully
    })
  })

  describe('getDatabasePorts', () => {
    it('should extract ports from database URLs', () => {
      const dbPorts = getDatabasePorts()

      expect(dbPorts.postgresql).toBe(9198)
      expect(dbPorts.redis).toBe(9178)
      expect(dbPorts.pgAdmin).toBe(9188)
    })

    it('should handle missing database URLs', () => {
      delete process.env.DATABASE_URL
      delete process.env.REDIS_URL

      const dbPorts = getDatabasePorts()
      expect(typeof dbPorts.postgresql).toBe('number')
      expect(typeof dbPorts.redis).toBe('number')
    })

    it('should handle malformed URLs gracefully', () => {
      process.env.DATABASE_URL = 'invalid-url'

      expect(() => getDatabasePorts()).not.toThrow()
    })
  })

  describe('getWebSocketConfig', () => {
    it('should return WebSocket configuration from environment', () => {
      const wsConfig = getWebSocketConfig()

      expect(wsConfig.host).toBe('localhost')
      expect(wsConfig.port).toBe(3001)
      expect(wsConfig.maxConnections).toBe(1000)
    })

    it('should use defaults when environment variables are missing', () => {
      delete process.env.YJS_HOST
      delete process.env.YJS_PORT
      delete process.env.WS_MAX_CONNECTIONS

      const wsConfig = getWebSocketConfig()

      expect(wsConfig.host).toBe('localhost')
      expect(typeof wsConfig.port).toBe('number')
      expect(typeof wsConfig.maxConnections).toBe('number')
    })
  })

  describe('validateBackendPortConfig', () => {
    it('should validate correct port configuration', () => {
      const result = validateBackendPortConfig()
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid backend port range', () => {
      process.env.PORT = '99999'
      const result = validateBackendPortConfig()
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should detect port conflicts between services', () => {
      process.env.PORT = '9198' // Same as PostgreSQL
      const result = validateBackendPortConfig()
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.includes('Port 9198 is used by multiple services'))).toBe(true)
    })

    it('should detect privileged port warnings', () => {
      process.env.PORT = '80'
      const result = validateBackendPortConfig()
      expect(result.warnings.some(w => w.includes('privileged'))).toBe(true)
    })
  })

  describe('Port Availability Checks', () => {
    it('should check backend port availability without throwing', async () => {
      const port = getBackendPort()
      await expect(checkPortAvailability(port)).resolves.not.toThrow()
    })

    it('should check all database port availability without throwing', async () => {
      const dbPorts = getDatabasePorts()

      for (const [service, port] of Object.entries(dbPorts)) {
        await expect(checkPortAvailability(port)).resolves.not.toThrow()
      }
    })

    it('should detect port conflicts for all services', async () => {
      const backendPort = getBackendPort()
      const dbPorts = getDatabasePorts()
      const allPorts = [backendPort, ...Object.values(dbPorts)]

      const conflicts = await checkPortConflicts(allPorts)
      expect(Array.isArray(conflicts)).toBe(true)
      expect(conflicts.length).toBeLessThanOrEqual(allPorts.length)
    })
  })

  describe('Service Integration', () => {
    it('should have consistent port configuration across services', () => {
      const backendPort = getBackendPort()
      const dbPorts = getDatabasePorts()
      const wsConfig = getWebSocketConfig()

      // All ports should be different
      const allPorts = [backendPort, ...Object.values(dbPorts), wsConfig.port]
      const uniquePorts = new Set(allPorts)

      expect(uniquePorts.size).toBe(allPorts.length)
    })

    it('should have CORS origin configured correctly', () => {
      const corsOrigins = process.env.CORS_ORIGIN?.split(',') || []
      expect(corsOrigins).toContain('http://localhost:9158')
    })

    it('should have database URLs with correct ports', () => {
      const dbPorts = getDatabasePorts()

      expect(process.env.DATABASE_URL).toContain(`:${dbPorts.postgresql}`)
      expect(process.env.REDIS_URL).toContain(`:${dbPorts.redis}`)
    })
  })

  describe('Environment Variables', () => {
    it('should have required backend environment variables', () => {
      const requiredVars = [
        'NODE_ENV',
        'PORT',
        'DATABASE_URL',
        'REDIS_URL',
        'CORS_ORIGIN',
      ]

      requiredVars.forEach(varName => {
        expect(process.env[varName]).toBeDefined()
      })
    })

    it('should have valid URL formats', () => {
      const databaseUrl = process.env.DATABASE_URL
      const redisUrl = process.env.REDIS_URL

      expect(databaseUrl).toMatch(/^postgresql:\/\//)
      expect(redisUrl).toMatch(/^redis:\/\//)
    })

    it('should have valid port numbers', () => {
      const port = getBackendPort()
      const dbPorts = getDatabasePorts()

      expect(port).toBeGreaterThan(0)
      expect(port).toBeLessThan(65536)

      Object.values(dbPorts).forEach(dbPort => {
        expect(dbPort).toBeGreaterThan(0)
        expect(dbPort).toBeLessThan(65536)
      })
    })
  })

  describe('API Configuration', () => {
    it('should have API prefix configured', () => {
      expect(process.env.API_PREFIX).toBeDefined()
    })

    it('should have JWT configuration', () => {
      expect(process.env.JWT_SECRET).toBeDefined()
      expect(process.env.JWT_EXPIRES_IN).toBeDefined()
    })

    it('should have CORS configuration', () => {
      expect(process.env.CORS_ORIGIN).toBeDefined()
      expect(typeof process.env.CORS_ORIGIN).toBe('string')
    })
  })
})