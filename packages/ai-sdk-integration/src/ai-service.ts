import {
  AIRequest,
  AIResponse,
  AIStreamChunk,
  AIProvider,
  AIError,
  AIProviderError,
} from './types'
import { AIConfigManager } from './config/ai-config-manager'
import { AIProviderRegistry } from './providers/provider-registry'
import { AICostTracker } from './utils/cost-tracker'
import { AICache } from './utils/cache'

export class AIService {
  private static instance: AIService
  private configManager: AIConfigManager
  private providerRegistry: AIProviderRegistry
  private costTracker: AICostTracker
  private cache: AICache
  private cleanupInterval: ReturnType<typeof setInterval> | null = null

  private constructor() {
    this.configManager = AIConfigManager.getInstance()
    this.providerRegistry = AIProviderRegistry.getInstance()
    this.costTracker = AICostTracker.getInstance()
    this.cache = AICache.getInstance()
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  async initialize(): Promise<void> {
    // Load configuration
    const config = this.configManager.loadConfig()

    // Initialize providers (they will register themselves)
    // This is handled by individual provider implementations

    // Start cleanup tasks
    this.startCleanupTasks()
  }

  async generateText(
    request: AIRequest,
    options: {
      provider?: AIProvider
      userId?: string
      useCache?: boolean
    } = {}
  ): Promise<AIResponse> {
    const { provider, userId, useCache = true } = options

    // Validate request
    this.validateRequest(request)

    // Check limits
    this.checkLimits(userId)

    const config = this.configManager.getConfig()
    const targetProvider = provider || config.defaultProvider
    const providerConfig = this.configManager.getProviderConfig(targetProvider)
    const model = request.model || providerConfig.defaultModel

    // Check cache first
    if (useCache) {
      const cachedResponse = await this.cache.get(
        request,
        targetProvider,
        model
      )
      if (cachedResponse) {
        return cachedResponse
      }
    }

    try {
      // Estimate cost before making request
      const estimatedCost = await this.costTracker.estimateCost(
        request,
        targetProvider,
        model
      )

      // Generate response
      const response = await this.providerRegistry.generateText(
        request,
        provider
      )

      // Record cost
      const actualCost = this.costTracker.recordCost(
        targetProvider,
        response.model,
        response.usage?.totalTokens || 0,
        userId
      )

      // Cache response
      if (useCache) {
        this.cache.set(request, response, targetProvider, response.model)
      }

      return response
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIError(
        `Failed to generate text: ${error instanceof Error ? error.message : 'Unknown error'}`,
        targetProvider,
        'GENERATION_FAILED'
      )
    }
  }

  async generateStream(
    request: AIRequest,
    options: {
      provider?: AIProvider
      userId?: string
      useCache?: boolean
    } = {}
  ): Promise<ReadableStream<AIStreamChunk>> {
    const { provider, userId, useCache = true } = options

    // Validate request
    this.validateRequest(request)

    // Check limits
    this.checkLimits(userId)

    const config = this.configManager.getConfig()
    const targetProvider = provider || config.defaultProvider
    const providerConfig = this.configManager.getProviderConfig(targetProvider)
    const model = request.model || providerConfig.defaultModel

    // Check cache first for streaming
    if (useCache) {
      const cachedChunks = await this.cache.getStream(
        request,
        targetProvider,
        model
      )
      if (cachedChunks) {
        return new ReadableStream({
          start(controller) {
            cachedChunks.forEach((chunk) => controller.enqueue(chunk))
            controller.close()
          },
        })
      }
    }

    try {
      const stream = await this.providerRegistry.generateStream(
        request,
        provider
      )

      // Create a transform stream to track costs and cache results
      // Create a transform stream to track costs and cache results
      const chunks: AIStreamChunk[] = []
      let totalTokens = 0

      const service = this

      const transformStream = new TransformStream<AIStreamChunk, AIStreamChunk>(
        {
          transform(chunk, controller) {
            chunks.push(chunk)

            if (chunk.usage?.totalTokens) {
              totalTokens = chunk.usage.totalTokens
            }

            controller.enqueue(chunk)
          },

          flush(controller) {
            // Record cost after stream completes
            if (totalTokens > 0) {
              service.costTracker.recordCost(
                targetProvider,
                model,
                totalTokens,
                userId
              )
            }

            // Cache stream if complete
            if (useCache && chunks.length > 0) {
              service.cache.setStream(request, chunks, targetProvider, model)
            }
          },
        }
      )

      return stream.pipeThrough(transformStream)
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIError(
        `Failed to generate stream: ${error instanceof Error ? error.message : 'Unknown error'}`,
        targetProvider,
        'STREAM_FAILED'
      )
    }
  }

  async estimateCost(
    request: AIRequest,
    provider?: AIProvider
  ): Promise<number> {
    const config = this.configManager.getConfig()
    const targetProvider = provider || config.defaultProvider
    const providerConfig = this.configManager.getProviderConfig(targetProvider)
    const model = request.model || providerConfig.defaultModel

    return await this.costTracker.estimateCost(request, targetProvider, model)
  }

  getUsageSummary(days: number = 7) {
    return this.costTracker.getUsageSummary(days)
  }

  getDailyUsage(date?: string) {
    return this.costTracker.getDailyUsage(date)
  }

  getUserUsage(userId: string, date?: string) {
    return this.costTracker.getUserUsage(userId, date)
  }

  getCacheStats() {
    return this.cache.getStats()
  }

  async getProviderHealth(): Promise<Record<AIProvider, boolean>> {
    return await this.providerRegistry.healthCheck()
  }

  getRegisteredProviders(): AIProvider[] {
    return this.providerRegistry.getRegisteredProviders()
  }

  updateConfig(updates: any): void {
    this.configManager.updateConfig(updates)
  }

  clearCache(): void {
    this.cache.clear()
  }

  dispose(): void {
    this.providerRegistry.dispose()
    this.cache.dispose()
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  private validateRequest(request: AIRequest): void {
    if (!request.messages || request.messages.length === 0) {
      throw new AIError(
        'Request must contain at least one message',
        AIProvider.UNKNOWN,
        'INVALID_REQUEST'
      )
    }

    if (!request.messages.some((msg) => msg.role === 'user')) {
      throw new AIError(
        'Request must contain at least one user message',
        AIProvider.UNKNOWN,
        'INVALID_REQUEST'
      )
    }
  }

  private checkLimits(userId?: string): void {
    // Check daily cost limit
    if (!this.costTracker.checkDailyLimit()) {
      throw new AIError(
        'Daily cost limit exceeded',
        AIProvider.UNKNOWN,
        'COST_LIMIT_EXCEEDED'
      )
    }

    // Check user-specific limits
    if (userId && !this.costTracker.checkUserLimit(userId)) {
      throw new AIError(
        'User request limit exceeded',
        AIProvider.UNKNOWN,
        'USER_LIMIT_EXCEEDED'
      )
    }
  }

  private startCleanupTasks(): void {
    // Clean up cost tracker data every hour
    this.cleanupInterval = setInterval(
      () => {
        this.costTracker.cleanup()
      },
      60 * 60 * 1000
    )
  }
}
