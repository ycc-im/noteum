/**
 * Dependencies Test - TDD Task 1
 *
 * 此测试验证YJS依赖是否已从package.json中移除
 * 按照TDD方法，此测试首先会失败（因为YJS依赖仍存在）
 * 然后我们移除依赖使测试通过
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('YJS Dependencies Removal', () => {
  const packageJsonPath = join(__dirname, '../../package.json')
  let packageJson: any

  beforeAll(() => {
    // 读取package.json文件
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8')
    packageJson = JSON.parse(packageJsonContent)
  })

  describe('Package Dependencies', () => {
    it('should not have yjs dependency', () => {
      // 测试：package.json中不应该有yjs依赖
      expect(packageJson.dependencies).not.toHaveProperty('yjs')
    })

    it('should not have y-websocket dependency', () => {
      // 测试：package.json中不应该有y-websocket依赖
      expect(packageJson.dependencies).not.toHaveProperty('y-websocket')
    })

    it('should not have @hocuspocus/provider dependency', () => {
      // 测试：package.json中不应该有@hocuspocus/provider依赖
      expect(packageJson.dependencies).not.toHaveProperty(
        '@hocuspocus/provider'
      )
    })
  })

  describe('Dev Dependencies', () => {
    it('should not have yjs in devDependencies', () => {
      // 测试：devDependencies中也不应该有yjs
      expect(packageJson.devDependencies).not.toHaveProperty('yjs')
    })

    it('should not have y-websocket in devDependencies', () => {
      // 测试：devDependencies中也不应该有y-websocket
      expect(packageJson.devDependencies).not.toHaveProperty('y-websocket')
    })

    it('should not have @hocuspocus/provider in devDependencies', () => {
      // 测试：devDependencies中也不应该有@hocuspocus/provider
      expect(packageJson.devDependencies).not.toHaveProperty(
        '@hocuspocus/provider'
      )
    })
  })

  describe('Node Modules Check', () => {
    it('should not have yjs in node_modules', () => {
      // 测试：检查node_modules中是否还存在yjs
      const yjsPath = join(__dirname, '../../node_modules/yjs')
      expect(() => {
        require('fs').accessSync(yjsPath)
      }).toThrow()
    })

    it('should not have y-websocket in node_modules', () => {
      // 测试：检查node_modules中是否还存在y-websocket
      const ywsPath = join(__dirname, '../../node_modules/y-websocket')
      expect(() => {
        require('fs').accessSync(ywsPath)
      }).toThrow()
    })

    it('should not have @hocuspocus/provider in node_modules', () => {
      // 测试：检查node_modules中是否还存在@hocuspocus/provider
      const providerPath = join(
        __dirname,
        '../../node_modules/@hocuspocus/provider'
      )
      expect(() => {
        require('fs').accessSync(providerPath)
      }).toThrow()
    })
  })
})
