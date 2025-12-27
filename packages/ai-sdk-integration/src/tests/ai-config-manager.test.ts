import { AIConfigManager } from '../config/ai-config-manager'
import { AIProvider, AIConfigError } from '../types'

// Mock environment variables
const mockEnv = {
  AI_DEFAULT_PROVIDER: 'openai',
  OPENAI_API_KEY: 'test-openai-key',
  OPENAI_MODELS: 'gpt-3.5-turbo,gpt-4',
  OPENAI_DEFAULT_MODEL: 'gpt-3.5-turbo',
  ANTHROPIC_API_KEY: 'test-anthropic-key',
  ANTHROPIC_MODELS: 'claude-3-haiku-20240307,claude-3-sonnet-20240229',
  ANTHROPIC_DEFAULT_MODEL: 'claude-3-haiku-20240307',
  AI_COST_ENABLED: 'true',
  AI_CACHE_ENABLED: 'true',
  AI_CACHE_TTL: '3600',
  AI_CACHE_MAX_SIZE: '1000',
}

describe('AIConfigManager', () => {
  let configManager: AIConfigManager
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    // Store original environment
    originalEnv = { ...process.env }

    // Set mock environment
    Object.assign(process.env, mockEnv)

    // Reset singleton
    ;(AIConfigManager as any).instance = null
    configManager = AIConfigManager.getInstance()
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv

    // Reset singleton
    ;(AIConfigManager as any).instance = null
  })

  describe('loadConfig', () => {
    it('should load configuration from environment variables', () => {
      const config = configManager.loadConfig()

      expect(config.defaultProvider).toBe(AIProvider.OPENAI)
      expect(config.providers[AIProvider.OPENAI].apiKey).toBe('test-openai-key')
      expect(config.providers[AIProvider.OPENAI].models).toContain(
        'gpt-3.5-turbo'
      )
      expect(config.providers[AIProvider.OPENAI].defaultModel).toBe(
        'gpt-3.5-turbo'
      )

      expect(config.providers[AIProvider.ANTHROPIC].apiKey).toBe(
        'test-anthropic-key'
      )
      expect(config.providers[AIProvider.ANTHROPIC].models).toContain(
        'claude-3-haiku-20240307'
      )
      expect(config.providers[AIProvider.ANTHROPIC].defaultModel).toBe(
        'claude-3-haiku-20240307'
      )

      expect(config.cost.enabled).toBe(true)
      expect(config.cache.enabled).toBe(true)
      expect(config.cache.ttl).toBe(3600)
      expect(config.cache.maxSize).toBe(1000)
    })

    it('should throw error when required API key is missing', () => {
      delete process.env.OPENAI_API_KEY

      expect(() => {
        configManager.loadConfig()
      }).toThrow(AIConfigError)
    })

    it('should use default values when optional environment variables are missing', () => {
      delete process.env.AI_DEFAULT_PROVIDER
      delete process.env.AI_CACHE_TTL

      const config = configManager.loadConfig()

      expect(config.defaultProvider).toBe('openai')
      expect(config.cache.ttl).toBe(3600) // Default value
    })
  })

  describe('getConfig', () => {
    it('should return cached config on subsequent calls', () => {
      const config1 = configManager.getConfig()
      const config2 = configManager.getConfig()

      expect(config1).toBe(config2)
    })
  })

  describe('updateConfig', () => {
    it('should update configuration with valid data', () => {
      const initialConfig = configManager.getConfig()

      configManager.updateConfig({
        defaultProvider: AIProvider.ANTHROPIC,
      })

      const updatedConfig = configManager.getConfig()
      expect(updatedConfig.defaultProvider).toBe(AIProvider.ANTHROPIC)
      expect(updatedConfig.providers).toEqual(initialConfig.providers) // Other parts unchanged
    })

    it('should throw error for invalid configuration updates', () => {
      expect(() => {
        configManager.updateConfig({
          defaultProvider: 'invalid-provider' as AIProvider,
        })
      }).toThrow(AIConfigError)
    })
  })

  describe('getProviderConfig', () => {
    it('should return provider configuration', () => {
      const openaiConfig = configManager.getProviderConfig(AIProvider.OPENAI)

      expect(openaiConfig.apiKey).toBe('test-openai-key')
      expect(openaiConfig.models).toContain('gpt-3.5-turbo')
    })

    it('should throw error for non-existent provider', () => {
      expect(() => {
        configManager.getProviderConfig('non-existent' as AIProvider)
      }).toThrow(AIConfigError)
    })
  })

  describe('validateProviderConfig', () => {
    it('should pass validation for valid provider config', () => {
      expect(() => {
        configManager.validateProviderConfig(AIProvider.OPENAI, {
          apiKey: 'test-key',
          models: ['gpt-3.5-turbo'],
          defaultModel: 'gpt-3.5-turbo',
        })
      }).not.toThrow()
    })

    it('should throw error for missing API key', () => {
      expect(() => {
        configManager.validateProviderConfig(AIProvider.OPENAI, {
          apiKey: '',
          models: ['gpt-3.5-turbo'],
          defaultModel: 'gpt-3.5-turbo',
        })
      }).toThrow(AIConfigError)
    })

    it('should throw error when default model is not in models list', () => {
      expect(() => {
        configManager.validateProviderConfig(AIProvider.OPENAI, {
          apiKey: 'test-key',
          models: ['gpt-4'],
          defaultModel: 'gpt-3.5-turbo',
        })
      }).toThrow(AIConfigError)
    })
  })
})
