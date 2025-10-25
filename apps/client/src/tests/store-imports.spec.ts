/**
 * Store Imports Test - TDD Task 5
 *
 * 此测试验证YJS Store是否已从imports中移除
 * 按照TDD方法，此测试首先会失败（因为yjs-store仍存在于imports中）
 * 然后我们移除yjs-store使测试通过
 */

import { describe, it, expect } from 'vitest'

describe('YJS Store Removal', () => {
  describe('Store Index Exports', () => {
    it('should not import yjs-store from stores index', async () => {
      // 测试：stores/index.ts不应该导出yjs-store
      const storesIndex = await import('../stores/index')

      // 这些导出应该存在
      expect(storesIndex.useSocketStore).toBeDefined()
      expect(storesIndex.useAuthStore).toBeDefined()
      expect(storesIndex.useNotesStore).toBeDefined()
      expect(storesIndex.useAppStore).toBeDefined()

      // yjs-store导出应该不存在
      expect(storesIndex.useYjsStore).toBeUndefined()
      expect(storesIndex.YjsStore).toBeUndefined()
    })

    it('should not have yjs-store in store exports object', async () => {
      // 测试：导出对象中不应该包含yjs-store相关内容
      const storesIndex = await import('../stores/index')

      // 检查导出的键名
      const exportedKeys = Object.keys(storesIndex)
      const yjsRelatedKeys = exportedKeys.filter((key) =>
        key.toLowerCase().includes('yjs')
      )

      expect(yjsRelatedKeys).toHaveLength(0)
    })
  })

  describe('Direct Import Verification', () => {
    it('should verify yjs-store module is not accessible', async () => {
      // 测试：验证yjs-store模块无法访问
      const fs = require('fs')
      const path = require('path')
      const yjsStorePath = path.join(__dirname, '../stores/yjs-store.ts')

      // 文件不应该存在
      expect(fs.existsSync(yjsStorePath)).toBe(false)
    })
  })

  describe('File System Verification', () => {
    it('should not have yjs-store.ts file', () => {
      // 测试：yjs-store.ts文件应该不存在
      const fs = require('fs')
      const path = require('path')
      const yjsStorePath = path.join(__dirname, '../stores/yjs-store.ts')

      expect(() => {
        fs.accessSync(yjsStorePath)
      }).toThrow()
    })

    it('should not have yjs-store.d.ts file', () => {
      // 测试：yjs-store.d.ts类型文件应该不存在
      const fs = require('fs')
      const path = require('path')
      const yjsStoreTypesPath = path.join(__dirname, '../stores/yjs-store.d.ts')

      expect(() => {
        fs.accessSync(yjsStoreTypesPath)
      }).toThrow()
    })
  })
})
