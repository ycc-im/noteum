import { generateText, streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import {
  IAIProvider,
  AIProvider,
  AIRequest,
  AIResponse,
  AIStreamChunk,
  AIProviderConfig,
  AIProviderError,
  AIError,
} from '../types'
import { AIConfigManager } from '../config/ai-config-manager'

export class AnthropicProvider implements IAIProvider {
  readonly name = AIProvider.ANTHROPIC
  readonly config: AIProviderConfig

  constructor(config?: AIProviderConfig) {
    const configManager = AIConfigManager.getInstance()
    this.config =
      config || configManager.getProviderConfig(AIProvider.ANTHROPIC)
  }

  async initialize(): Promise<void> {
    try {
      await this.isHealthy()
    } catch (error) {
      throw new AIError(
        `Anthropic provider initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        AIProvider.ANTHROPIC,
        'INITIALIZATION_FAILED'
      )
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      // Simple health check - try a minimal request
      await generateText({
        model: anthropic(this.config.defaultModel),
        messages: [{ role: 'user', content: 'Hi' }],
        maxRetries: 0,
      })
      return true
    } catch (error) {
      console.error('Anthropic health check failed:', error)
      return false
    }
  }

  async generateText(request: AIRequest): Promise<AIResponse> {
    try {
      const model = request.model || this.config.defaultModel

      const result = await generateText({
        model: anthropic(model),
        messages: request.messages.map((msg) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        })),
        temperature: request.temperature ?? this.config.temperature,
        maxRetries: 2,
      })

      return {
        content: result.text,
        usage: result.usage
          ? {
              inputTokens: result.usage.inputTokens || 0,
              outputTokens: result.usage.outputTokens || 0,
              totalTokens: result.usage.totalTokens || 0,
            }
          : undefined,
        model: model,
        provider: this.name,
      }
    } catch (error) {
      throw new AIProviderError(
        `Anthropic text generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.name,
        error instanceof Error ? error : new Error('Unknown error'),
        'TEXT_GENERATION_FAILED',
        this.extractStatusCode(error)
      )
    }
  }

  async generateStream(
    request: AIRequest
  ): Promise<ReadableStream<AIStreamChunk>> {
    try {
      const model = request.model || this.config.defaultModel

      const result = await streamText({
        model: anthropic(model),
        messages: request.messages.map((msg) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        })),
        temperature: request.temperature ?? this.config.temperature,
        maxRetries: 2,
      })

      return new ReadableStream<AIStreamChunk>({
        async start(controller) {
          try {
            let fullContent = ''

            for await (const chunk of result.textStream) {
              fullContent += chunk

              controller.enqueue({
                delta: chunk,
                content: fullContent,
                isComplete: false,
              })
            }

            // Get final usage information
            const usage = await result.usage
            controller.enqueue({
              content: fullContent,
              isComplete: true,
              usage: usage
                ? {
                    inputTokens: usage.inputTokens || 0,
                    outputTokens: usage.outputTokens || 0,
                    totalTokens: usage.totalTokens || 0,
                  }
                : undefined,
            })

            controller.close()
          } catch (error) {
            controller.error(error)
          }
        },
      })
    } catch (error) {
      throw new AIProviderError(
        `Anthropic stream generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.name,
        error instanceof Error ? error : new Error('Unknown error'),
        'STREAM_GENERATION_FAILED',
        this.extractStatusCode(error)
      )
    }
  }

  async estimateCost(request: AIRequest): Promise<number> {
    const model = request.model || this.config.defaultModel

    // Rough estimation based on character count
    const totalChars = request.messages.reduce(
      (sum, msg) => sum + msg.content.length,
      0
    )
    const estimatedTokens = Math.ceil(totalChars / 4)

    // Default costs per 1M tokens (these should be configured properly)
    const costsPerMillion: Record<string, number> = {
      'claude-3-haiku-20240307': 0.00025,
      'claude-3-sonnet-20240229': 0.003,
      'claude-3-opus-20240229': 0.015,
    }

    const costPerMillion = costsPerMillion[model] || 0.00025
    return (estimatedTokens * costPerMillion) / 1000000
  }

  dispose(): void {
    // Anthropic client doesn't require explicit disposal
  }

  private extractStatusCode(error: any): number | undefined {
    // Extract status code from Anthropic errors
    if (error.status) {
      return error.status
    }

    if (error.cause?.status) {
      return error.cause.status
    }

    // Common Anthropic error status codes
    if (error.message?.includes('401')) return 401
    if (error.message?.includes('429')) return 429
    if (error.message?.includes('500')) return 500
    if (error.message?.includes('400')) return 400

    return undefined
  }
}
