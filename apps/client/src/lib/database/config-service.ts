import { getDatabase, handleDatabaseError } from './index'
import type { ConfigTable } from './types'

export interface AppConfig {
  apiBaseUrl: string
  [key: string]: any
}

export interface ConfigService {
  getConfig(key: string): Promise<any>
  setConfig(key: string, value: any, description?: string): Promise<void>
  getAllConfigs(): Promise<Record<string, any>>
  updateConfigs(configs: Record<string, any>): Promise<void>
  getApiBaseUrl(): Promise<string>
  setApiBaseUrl(url: string): Promise<void>
  clearAllData(): Promise<void>
}

class ConfigServiceImpl implements ConfigService {
  private async getConfigTable() {
    const db = await getDatabase()
    return db.config
  }

  async getConfig(key: string): Promise<any> {
    try {
      const table = await this.getConfigTable()
      const config = await table.where('key').equals(key).first()
      return config?.value
    } catch (error) {
      console.error(`Failed to get config "${key}":`, error)
      throw handleDatabaseError(error)
    }
  }

  async setConfig(
    key: string,
    value: any,
    description?: string
  ): Promise<void> {
    try {
      const table = await this.getConfigTable()
      const now = new Date()

      // 确定值的类型
      const type =
        typeof value === 'object' && value !== null
          ? 'object'
          : (typeof value as 'string' | 'number' | 'boolean' | 'object')

      const existingConfig = await table.where('key').equals(key).first()

      if (existingConfig) {
        // 更新现有配置
        await table.update(existingConfig.id!, {
          value,
          type,
          description,
          updatedAt: now,
        })
      } else {
        // 创建新配置
        await table.add({
          key,
          value,
          type,
          description,
          createdAt: now,
          updatedAt: now,
        })
      }
    } catch (error) {
      console.error(`Failed to set config "${key}":`, error)
      throw handleDatabaseError(error)
    }
  }

  async getAllConfigs(): Promise<Record<string, any>> {
    try {
      const table = await this.getConfigTable()
      const configs = await table.toArray()

      return configs.reduce(
        (acc, config) => {
          acc[config.key] = config.value
          return acc
        },
        {} as Record<string, any>
      )
    } catch (error) {
      console.error('Failed to get all configs:', error)
      throw handleDatabaseError(error)
    }
  }

  async updateConfigs(configs: Record<string, any>): Promise<void> {
    try {
      const table = await this.getConfigTable()
      const now = new Date()

      // 批量更新配置
      for (const [key, value] of Object.entries(configs)) {
        const type =
          typeof value === 'object' && value !== null
            ? 'object'
            : (typeof value as 'string' | 'number' | 'boolean' | 'object')
        const existingConfig = await table.where('key').equals(key).first()

        if (existingConfig) {
          await table.update(existingConfig.id!, {
            value,
            type,
            updatedAt: now,
          })
        } else {
          await table.add({
            key,
            value,
            type,
            createdAt: now,
            updatedAt: now,
          })
        }
      }
    } catch (error) {
      console.error('Failed to update configs:', error)
      throw handleDatabaseError(error)
    }
  }

  async getApiBaseUrl(): Promise<string> {
    const url = await this.getConfig('apiBaseUrl')
    return url || 'http://localhost:9168' // 默认值
  }

  async setApiBaseUrl(url: string): Promise<void> {
    await this.setConfig('apiBaseUrl', url, 'API服务器基础地址')
  }

  // 清空所有数据
  async clearAllData(): Promise<void> {
    try {
      const db = await getDatabase()

      // 清空所有表
      await db.auth.clear()
      await db.cache.clear()
      await db.config.clear()

      console.log('All IndexedDB data cleared successfully')
    } catch (error) {
      console.error('Failed to clear all data:', error)
      throw handleDatabaseError(error)
    }
  }

  // 初始化默认配置
  async initializeDefaults(): Promise<void> {
    const defaults: AppConfig = {
      apiBaseUrl: 'http://localhost:9168',
    }

    for (const [key, value] of Object.entries(defaults)) {
      const existing = await this.getConfig(key)
      if (existing === undefined) {
        await this.setConfig(key, value)
      }
    }
  }
}

// 导出单例实例
export const configService = new ConfigServiceImpl()

// 初始化默认配置（仅在客户端）
if (typeof window !== 'undefined') {
  configService.initializeDefaults().catch(console.error)
}
