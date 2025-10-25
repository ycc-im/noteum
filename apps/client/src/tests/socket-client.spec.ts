/**
 * Socket.io Client Test - TDD Task 2
 *
 * 此测试验证Socket.io客户端依赖是否可用
 * 按照TDD方法，此测试首先会失败（因为Socket.io客户端依赖不存在）
 * 然后我们添加依赖使测试通过
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Socket.io Client Availability', () => {
  describe('Package Dependencies', () => {
    it('should have socket.io-client dependency', () => {
      // 测试：package.json中应该有socket.io-client依赖
      const packageJsonPath = join(__dirname, '../../package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      expect(packageJson.dependencies).toHaveProperty('socket.io-client')
    })

    it('should have valid socket.io-client version', () => {
      // 测试：socket.io-client版本应该存在且有效
      const packageJsonPath = join(__dirname, '../../package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      const version = packageJson.dependencies['socket.io-client']
      expect(version).toBeDefined()
      expect(typeof version).toBe('string')
      expect(version.length).toBeGreaterThan(0)
    })
  })

  describe('Import Verification', () => {
    it('should be able to import socket.io-client', async () => {
      // 测试：应该能够导入socket.io-client
      const { io } = await import('socket.io-client')
      expect(io).toBeDefined()
      expect(typeof io).toBe('function')
    })

    it('should have socket.io-client types available', async () => {
      // 测试：TypeScript类型应该可用
      const { io } = await import('socket.io-client')
      // 这里我们主要验证导入不会失败，TypeScript类型检查在编译时进行
      expect(io).toBeDefined()
    })
  })

  describe('Basic Functionality', () => {
    it('should be able to create socket instance', async () => {
      // 测试：应该能够创建socket实例（不连接）
      const { io } = await import('socket.io-client')
      const socket = io('http://localhost:9168', {
        autoConnect: false,
        timeout: 1000,
      })
      expect(socket).toBeDefined()
      expect(typeof socket.on).toBe('function')
      expect(typeof socket.emit).toBe('function')
      expect(typeof socket.connect).toBe('function')
      expect(typeof socket.disconnect).toBe('function')
    })

    it('should have proper socket configuration', async () => {
      // 测试：socket实例应该有正确的配置
      const { io } = await import('socket.io-client')
      const socket = io('http://localhost:9168', {
        autoConnect: false,
        timeout: 1000,
      })
      expect(socket.io).toBeDefined()
      expect(socket.io.uri).toBe('http://localhost:9168')
      expect(socket.io.opts).toBeDefined()
      expect(socket.io.opts.autoConnect).toBe(false)
    })
  })
})
