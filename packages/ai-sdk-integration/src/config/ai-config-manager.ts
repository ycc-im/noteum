import { z } from 'zod'
import {
  AIConfig,
  AIProvider,
  AIProviderConfig,
  AICostConfig,
  AICacheConfig,
  AIConfigSchema,
  AIConfigError,
} from '../types'

export class AIConfigManager {
  private static instance: AIConfigManager
  private config: AIConfig | null = null

  private constructor() {}

  static getInstance(): AIConfigManager {
    if (!AIConfigManager.instance) {
      AIConfigManager.instance = new AIConfigManager()
    }
    return AIConfigManager.instance
  }

  loadConfig(): AIConfig {
    if (this.config) {
      return this.config
    }

    try {
      // Load from environment variables
      const config = this.loadFromEnvironment()

      // Validate configuration
      const validatedConfig = AIConfigSchema.parse(config)

      this.config = validatedConfig
      return this.config
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AIConfigError(
          `Invalid AI configuration: ${error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`
        )
      }
      throw new AIConfigError(
        `Failed to load AI configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  getConfig(): AIConfig {
    if (!this.config) {
      return this.loadConfig()
    }
    return this.config
  }

  updateConfig(updates: Partial<AIConfig>): void {
    if (!this.config) {
      this.loadConfig()
    }

    try {
      const mergedConfig = { ...this.config!, ...updates }
      const validatedConfig = AIConfigSchema.parse(mergedConfig)
      this.config = validatedConfig
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AIConfigError(
          `Invalid AI configuration update: ${error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`
        )
      }
      throw new AIConfigError(
        `Failed to update AI configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  getProviderConfig(provider: AIProvider): AIProviderConfig {
    const config = this.getConfig()
    const providerConfig = config.providers[provider]

    if (!providerConfig) {
      throw new AIConfigError(`Provider ${provider} not configured`)
    }

    return providerConfig
  }

  private loadFromEnvironment(): AIConfig {
    // Default provider
    const defaultProvider = (process.env.AI_DEFAULT_PROVIDER ||
      'openai') as AIProvider

    // OpenAI configuration
    const openaiConfig: AIProviderConfig = {
      apiKey: process.env.OPENAI_API_KEY || '',
      baseURL: process.env.OPENAI_BASE_URL,
      models: (process.env.OPENAI_MODELS || 'gpt-3.5-turbo,gpt-4')
        .split(',')
        .map((m) => m.trim()),
      defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'gpt-3.5-turbo',
      maxTokens: process.env.OPENAI_MAX_TOKENS
        ? parseInt(process.env.OPENAI_MAX_TOKENS)
        : undefined,
      temperature: process.env.OPENAI_TEMPERATURE
        ? parseFloat(process.env.OPENAI_TEMPERATURE)
        : undefined,
    }

    // Anthropic configuration
    const anthropicConfig: AIProviderConfig = {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      baseURL: process.env.ANTHROPIC_BASE_URL,
      models: (
        process.env.ANTHROPIC_MODELS ||
        'claude-3-haiku-20240307,claude-3-sonnet-20240229'
      )
        .split(',')
        .map((m) => m.trim()),
      defaultModel:
        process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-haiku-20240307',
      maxTokens: process.env.ANTHROPIC_MAX_TOKENS
        ? parseInt(process.env.ANTHROPIC_MAX_TOKENS)
        : undefined,
      temperature: process.env.ANTHROPIC_TEMPERATURE
        ? parseFloat(process.env.ANTHROPIC_TEMPERATURE)
        : undefined,
    }

    // Cost configuration
    const costConfig: AICostConfig = {
      enabled: process.env.AI_COST_ENABLED === 'true',
      maxDailyCost: process.env.AI_MAX_DAILY_COST
        ? parseFloat(process.env.AI_MAX_DAILY_COST)
        : undefined,
      maxRequestsPerUser: process.env.AI_MAX_REQUESTS_PER_USER
        ? parseInt(process.env.AI_MAX_REQUESTS_PER_USER)
        : undefined,
      costPerToken: {
        // Default costs (per 1M tokens)
        'gpt-3.5-turbo': 0.002,
        'gpt-4': 0.03,
        'claude-3-haiku-20240307': 0.00025,
        'claude-3-sonnet-20240229': 0.003,
        ...(process.env.AI_COST_PER_TOKEN
          ? JSON.parse(process.env.AI_COST_PER_TOKEN)
          : {}),
      },
    }

    // Cache configuration
    const cacheConfig: AICacheConfig = {
      enabled: process.env.AI_CACHE_ENABLED !== 'false', // Default to true
      ttl: process.env.AI_CACHE_TTL ? parseInt(process.env.AI_CACHE_TTL) : 3600, // 1 hour default
      maxSize: process.env.AI_CACHE_MAX_SIZE
        ? parseInt(process.env.AI_CACHE_MAX_SIZE)
        : 1000,
    }

    return {
      defaultProvider,
      providers: {
        [AIProvider.OPENAI]: openaiConfig,
        [AIProvider.ANTHROPIC]: anthropicConfig,
      },
      cost: costConfig,
      cache: cacheConfig,
      fallbackProvider: process.env.AI_FALLBACK_PROVIDER as AIProvider,
    }
  }

  validateProviderConfig(provider: AIProvider, config: AIProviderConfig): void {
    if (!config.apiKey) {
      throw new AIConfigError(
        `API key is required for provider ${provider}`,
        `${provider}.apiKey`
      )
    }

    if (!config.models || config.models.length === 0) {
      throw new AIConfigError(
        `At least one model is required for provider ${provider}`,
        `${provider}.models`
      )
    }

    if (!config.defaultModel) {
      throw new AIConfigError(
        `Default model is required for provider ${provider}`,
        `${provider}.defaultModel`
      )
    }

    if (!config.models.includes(config.defaultModel)) {
      throw new AIConfigError(
        `Default model ${config.defaultModel} must be included in models list for provider ${provider}`,
        `${provider}.defaultModel`
      )
    }
  }
}
