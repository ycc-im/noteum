import {
  IAIProvider,
  AIProvider,
  AIRequest,
  AIResponse,
  AIStreamChunk,
  AIError,
  AIProviderError,
} from '../types'
import { AIConfigManager } from '../config/ai-config-manager'

export class AIProviderRegistry {
  private static instance: AIProviderRegistry
  private providers = new Map<AIProvider, IAIProvider>()
  private configManager: AIConfigManager

  private constructor() {
    this.configManager = AIConfigManager.getInstance()
  }

  static getInstance(): AIProviderRegistry {
    if (!AIProviderRegistry.instance) {
      AIProviderRegistry.instance = new AIProviderRegistry()
    }
    return AIProviderRegistry.instance
  }

  registerProvider(provider: IAIProvider): void {
    this.providers.set(provider.name, provider)
  }

  getProvider(name?: AIProvider): IAIProvider {
    const config = this.configManager.getConfig()
    const providerName = name || config.defaultProvider

    const provider = this.providers.get(providerName)

    if (!provider) {
      throw new AIError(
        `Provider ${providerName} is not registered`,
        providerName,
        'PROVIDER_NOT_FOUND'
      )
    }

    return provider
  }

  async getHealthyProvider(
    preferredProvider?: AIProvider
  ): Promise<IAIProvider> {
    const config = this.configManager.getConfig()

    // Try preferred provider first
    if (preferredProvider) {
      const provider = this.providers.get(preferredProvider)
      if (provider && (await provider.isHealthy())) {
        return provider
      }
    }

    // Try default provider
    const defaultProvider = this.providers.get(config.defaultProvider)
    if (defaultProvider && (await defaultProvider.isHealthy())) {
      return defaultProvider
    }

    // Try fallback provider
    if (config.fallbackProvider) {
      const fallbackProvider = this.providers.get(config.fallbackProvider)
      if (fallbackProvider && (await fallbackProvider.isHealthy())) {
        return fallbackProvider
      }
    }

    // Try all registered providers
    for (const [name, provider] of this.providers) {
      if (await provider.isHealthy()) {
        return provider
      }
    }

    throw new AIError(
      'No healthy AI providers available',
      config.defaultProvider,
      'NO_HEALTHY_PROVIDERS'
    )
  }

  async generateText(
    request: AIRequest,
    providerName?: AIProvider
  ): Promise<AIResponse> {
    const provider = await this.getHealthyProvider(providerName)

    try {
      return await provider.generateText(request)
    } catch (error) {
      if (error instanceof AIProviderError) {
        // Try fallback provider if available
        const config = this.configManager.getConfig()
        if (
          config.fallbackProvider &&
          config.fallbackProvider !== provider.name
        ) {
          try {
            const fallbackProvider = this.getProvider(config.fallbackProvider)
            if (await fallbackProvider.isHealthy()) {
              return await fallbackProvider.generateText(request)
            }
          } catch (fallbackError) {
            // Log fallback error but throw original error
            console.error(
              `Fallback provider ${config.fallbackProvider} also failed:`,
              fallbackError
            )
          }
        }
      }
      throw error
    }
  }

  async generateStream(
    request: AIRequest,
    providerName?: AIProvider
  ): Promise<ReadableStream<AIStreamChunk>> {
    const provider = await this.getHealthyProvider(providerName)

    try {
      return await provider.generateStream(request)
    } catch (error) {
      if (error instanceof AIProviderError) {
        // Try fallback provider if available
        const config = this.configManager.getConfig()
        if (
          config.fallbackProvider &&
          config.fallbackProvider !== provider.name
        ) {
          try {
            const fallbackProvider = this.getProvider(config.fallbackProvider)
            if (await fallbackProvider.isHealthy()) {
              return await fallbackProvider.generateStream(request)
            }
          } catch (fallbackError) {
            // Log fallback error but throw original error
            console.error(
              `Fallback provider ${config.fallbackProvider} also failed:`,
              fallbackError
            )
          }
        }
      }
      throw error
    }
  }

  async estimateCost(
    request: AIRequest,
    providerName?: AIProvider
  ): Promise<number> {
    const provider = this.getProvider(providerName)
    return await provider.estimateCost(request)
  }

  getRegisteredProviders(): AIProvider[] {
    return Array.from(this.providers.keys())
  }

  async healthCheck(): Promise<Record<AIProvider, boolean>> {
    const health: Record<string, boolean> = {}

    for (const [name, provider] of this.providers) {
      try {
        health[name] = await provider.isHealthy()
      } catch (error) {
        health[name] = false
      }
    }

    return health as Record<AIProvider, boolean>
  }

  dispose(): void {
    for (const provider of this.providers.values()) {
      if (provider.dispose) {
        provider.dispose()
      }
    }
    this.providers.clear()
  }
}
