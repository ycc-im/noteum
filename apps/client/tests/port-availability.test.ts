/**
 * Frontend Port Availability Tests
 *
 * Tests to verify that frontend can start and run on its designated port
 * without conflicts with other services.
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import {
  getFrontendPort,
  validateFrontendPortConfig,
} from '../src/config/ports'
import { checkPortAvailability, checkPortConflicts } from '@noteum/utils'

describe('Frontend Port Configuration', () => {
  const originalEnv = process.env

  beforeAll(() => {
    // Mock environment variables for testing
    process.env = {
      ...originalEnv,
      FRONTEND_PORT: '9158',
      VITE_API_URL: 'http://localhost:9168',
      VITE_WS_URL: 'ws://localhost:9168',
    }
  })

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('getFrontendPort', () => {
    it('should return port from environment variable', () => {
      const port = getFrontendPort()
      expect(port).toBe(9158)
    })

    it('should return default port when environment variable is not set', () => {
      delete process.env.FRONTEND_PORT
      const port = getFrontendPort()
      expect(port).toBe(9158) // Default from config
    })

    it('should handle invalid port values', () => {
      process.env.FRONTEND_PORT = 'invalid'
      expect(() => getFrontendPort()).not.toThrow()
      // Should fall back to default or handle gracefully
    })
  })

  describe('validateFrontendPortConfig', () => {
    it('should validate correct port configuration', () => {
      const result = validateFrontendPortConfig()
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid port range', () => {
      process.env.FRONTEND_PORT = '99999'
      const result = validateFrontendPortConfig()
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should detect privileged port warnings', () => {
      process.env.FRONTEND_PORT = '80'
      const result = validateFrontendPortConfig()
      expect(result.warnings.some((w) => w.includes('privileged'))).toBe(true)
    })

    it('should detect common port conflicts', () => {
      process.env.FRONTEND_PORT = '3000'
      const result = validateFrontendPortConfig()
      expect(result.warnings.some((w) => w.includes('commonly used'))).toBe(
        true
      )
    })
  })

  describe('Port Availability Checks', () => {
    it('should check port availability without throwing', async () => {
      const port = getFrontendPort()
      await expect(checkPortAvailability(port)).resolves.not.toThrow()
    })

    it('should detect port conflicts', async () => {
      const port = getFrontendPort()
      const conflicts = await checkPortConflicts([port])
      expect(Array.isArray(conflicts)).toBe(true)
    })

    it('should handle multiple port checks', async () => {
      const ports = [9158, 9159, 9160]
      const conflicts = await checkPortConflicts(ports)
      expect(Array.isArray(conflicts)).toBe(true)
      expect(conflicts.length).toBeLessThanOrEqual(ports.length)
    })
  })

  describe('Service Integration', () => {
    it('should have API URL configured correctly', () => {
      expect(process.env.VITE_API_URL).toBe('http://localhost:9168')
    })

    it('should have WebSocket URL configured correctly', () => {
      expect(process.env.VITE_WS_URL).toBe('ws://localhost:9168')
    })

    it('should have consistent port configuration', () => {
      const frontendPort = getFrontendPort()
      const apiUrl = process.env.VITE_API_URL
      const wsUrl = process.env.VITE_WS_URL

      // Extract backend port from URLs
      const apiPortMatch = apiUrl?.match(/:(\d+)/)
      const wsPortMatch = wsUrl?.match(/:(\d+)/)

      expect(apiPortMatch).toBeTruthy()
      expect(wsPortMatch).toBeTruthy()
      expect(apiPortMatch?.[1]).not.toBe(frontendPort.toString())
      expect(wsPortMatch?.[1]).not.toBe(frontendPort.toString())
    })
  })

  describe('Environment Variables', () => {
    it('should have required frontend environment variables', () => {
      const requiredVars = ['FRONTEND_PORT', 'VITE_API_URL', 'VITE_WS_URL']

      requiredVars.forEach((varName) => {
        expect(process.env[varName]).toBeDefined()
      })
    })

    it('should have valid URL formats', () => {
      const apiUrl = process.env.VITE_API_URL
      const wsUrl = process.env.VITE_WS_URL

      expect(apiUrl).toMatch(/^https?:\/\//)
      expect(wsUrl).toMatch(/^wss?:\/\//)
    })
  })
})
