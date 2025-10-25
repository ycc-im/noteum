/**
 * YJS Types Cleanup Test - TDD Task 6
 *
 * 此测试验证YJS相关类型定义是否已从代码库中移除
 * 按照TDD方法，此测试首先会失败（因为YJS类型仍存在）
 * 然后我们清理YJS类型使测试通过
 */

import { describe, it, expect } from 'vitest'

describe('YJS Types Cleanup', () => {
  describe('Type Definitions', () => {
    it('should not have YJS types in global type files', () => {
      // 测试：全局类型文件中不应该有YJS类型
      const fs = require('fs')
      const path = require('path')

      // 检查src/types/index.ts
      const typesIndexPath = path.join(__dirname, '../types/index.ts')
      if (fs.existsSync(typesIndexPath)) {
        const typesContent = fs.readFileSync(typesIndexPath, 'utf-8')
        expect(typesContent).not.toContain('yjs')
        expect(typesContent).not.toContain('Y.')
        expect(typesContent).not.toContain('Doc')
        expect(typesContent).not.toContain('Map as YMap')
        expect(typesContent).not.toContain('Array as YArray')
        expect(typesContent).not.toContain('Text as YText')
      }
    })

    it('should not have YJS imports in source files', () => {
      // 测试：源文件中不应该有YJS导入
      const { execSync } = require('child_process')

      try {
        // 搜索所有YJS导入，排除测试目录
        const grepResult = execSync(
          'grep -r "from.*yjs" src/ --include="*.ts" --include="*.tsx" --exclude-dir=tests || echo "no matches"',
          {
            encoding: 'utf-8',
            cwd: process.cwd(),
          }
        )

        expect(grepResult.trim()).toBe('no matches')
      } catch (error) {
        // 如果grep找到匹配，测试失败
        expect(false).toBe(true)
      }
    })

    it('should not have YJS type references', () => {
      // 测试：不应该有YJS类型引用
      const { execSync } = require('child_process')

      try {
        // 搜索YJS类型引用，排除测试目录
        const grepResult = execSync(
          'grep -r "YDoc\\|YMap\\|YArray\\|YText\\|Yjs" src/ --include="*.ts" --include="*.tsx" --exclude-dir=tests || echo "no matches"',
          {
            encoding: 'utf-8',
            cwd: process.cwd(),
          }
        )

        expect(grepResult.trim()).toBe('no matches')
      } catch (error) {
        // 如果grep找到匹配，测试失败
        expect(false).toBe(true)
      }
    })
  })

  describe('Interface Definitions', () => {
    it('should not have YJS interfaces in store interfaces', () => {
      // 测试：store接口中不应该有YJS接口
      const fs = require('fs')
      const path = require('path')

      // 检查所有store文件
      const storesDir = path.join(__dirname, '../stores')
      if (fs.existsSync(storesDir)) {
        const storeFiles = fs
          .readdirSync(storesDir)
          .filter((file) => file.endsWith('.ts'))

        storeFiles.forEach((file) => {
          const filePath = path.join(storesDir, file)
          const content = fs.readFileSync(filePath, 'utf-8')

          // 检查YJS相关接口
          expect(content).not.toContain('Y.')
          expect(content).not.toMatch(/interface.*Y[A-Z]/)
          expect(content).not.toMatch(/type.*Y[A-Z]/)
        })
      }
    })

    it('should not have collaboration types', () => {
      // 测试：不应该有协作相关类型 (仅检查类型定义相关的关键词)
      const { execSync } = require('child_process')

      try {
        // 搜索协作相关类型，排除正常使用场景
        const grepResult = execSync(
          'grep -r "collaboration.*:\\|collaborative.*:\\|interface.*collaboration\\|type.*collaboration" src/types/ --include="*.ts" || echo "no matches"',
          {
            encoding: 'utf-8',
            cwd: process.cwd(),
          }
        )

        expect(grepResult.trim()).toBe('no matches')
      } catch (error) {
        // 如果grep找到匹配，测试失败
        expect(false).toBe(true)
      }
    })
  })

  describe('Configuration Files', () => {
    it('should not have YJS in tsconfig paths', () => {
      // 测试：tsconfig中不应该有YJS路径配置
      const fs = require('fs')
      const path = require('path')

      const tsconfigPath = path.join(__dirname, '../../tsconfig.json')
      if (fs.existsSync(tsconfigPath)) {
        const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf-8')
        expect(tsconfigContent).not.toContain('yjs')
      }
    })

    it('should not have YJS in vite configuration', () => {
      // 测试：vite配置中不应该有YJS配置
      const fs = require('fs')
      const path = require('path')

      const viteConfigPath = path.join(__dirname, '../../vite.config.ts')
      if (fs.existsSync(viteConfigPath)) {
        const viteConfigContent = fs.readFileSync(viteConfigPath, 'utf-8')
        expect(viteConfigContent).not.toContain('yjs')
      }
    })
  })

  describe('Package Dependencies', () => {
    it('should not have YJS devDependencies', () => {
      // 测试：package.json中不应该有YJS开发依赖
      const fs = require('fs')
      const path = require('path')

      const packageJsonPath = path.join(__dirname, '../../package.json')
      const packageContent = JSON.parse(
        fs.readFileSync(packageJsonPath, 'utf-8')
      )

      const devDeps = packageContent.devDependencies || {}
      const yjsDeps = Object.keys(devDeps).filter(
        (dep) => dep.includes('yjs') || dep.includes('hocuspocus')
      )

      expect(yjsDeps).toHaveLength(0)
    })
  })
})
