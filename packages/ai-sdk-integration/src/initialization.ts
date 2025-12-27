import { AIProviderRegistry } from './providers/provider-registry'
import { AIConfigManager } from './config/ai-config-manager'
import { OpenAIProvider } from './providers/openai.provider'
import { AnthropicProvider } from './providers/anthropic.provider'
import { AIService } from './ai-service'

export async function initializeAIProviders(): Promise<void> {
  const configManager = AIConfigManager.getInstance()
  const config = configManager.getConfig()
  const registry = AIProviderRegistry.getInstance()

  // Initialize OpenAI provider if configured
  if (config.providers.openai?.apiKey) {
    try {
      const openaiProvider = new OpenAIProvider(config.providers.openai)
      await openaiProvider.initialize()
      registry.registerProvider(openaiProvider)
      console.log('OpenAI provider initialized successfully')
    } catch (error) {
      console.error('Failed to initialize OpenAI provider:', error)
    }
  }

  // Initialize Anthropic provider if configured
  if (config.providers.anthropic?.apiKey) {
    try {
      const anthropicProvider = new AnthropicProvider(
        config.providers.anthropic
      )
      await anthropicProvider.initialize()
      registry.registerProvider(anthropicProvider)
      console.log('Anthropic provider initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Anthropic provider:', error)
    }
  }

  // Check if we have any healthy providers
  const health = await registry.healthCheck()
  const healthyProviders = Object.entries(health).filter(
    ([_, isHealthy]) => isHealthy
  )

  if (healthyProviders.length === 0) {
    throw new Error(
      'No healthy AI providers available. Please check your configuration.'
    )
  }

  console.log(
    `Initialized ${healthyProviders.length} healthy AI providers: ${healthyProviders.map(([name]) => name).join(', ')}`
  )
}

// Export a convenience function to initialize the entire AI service
export async function initializeAIService(): Promise<AIService> {
  await initializeAIProviders()

  const aiService = AIService.getInstance()
  await aiService.initialize()

  return aiService
}
