import { generateText, streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
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

export class OpenAIProvider implements IAIProvider {
  readonly name = AIProvider.OPENAI
  readonly config: AIProviderConfig

  constructor(config?: AIProviderConfig) {
    const configManager = AIConfigManager.getInstance()
    this.config = config || configManager.getProviderConfig(AIProvider.OPENAI)
  }

  async initialize(): Promise<void> {
    try {
      await this.isHealthy()
    } catch (error) {
      throw new AIError(
        `OpenAI provider initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        AIProvider.OPENAI,
        'INITIALIZATION_FAILED'
      )
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      // Simple health check - try a minimal request
      await generateText({
        model: openai(this.config.defaultModel),
        messages: [{ role: 'user', content: 'Hi' }],
        maxRetries: 0,
      })
      return true
    } catch (error) {
      console.error('OpenAI health check failed:', error)
      return false
    }
  }

  async generateText(request: AIRequest): Promise<AIResponse> {
    try {
      const model = request.model || this.config.defaultModel

      const result = await generateText({
        model: openai(model),
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
        `OpenAI text generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
        model: openai(model),
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
        `OpenAI stream generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
      'gpt-3.5-turbo': 0.002,
      'gpt-4': 0.03,
      'gpt-4-turbo': 0.01,
    }

    const costPerMillion = costsPerMillion[model] || 0.002
    return (estimatedTokens * costPerMillion) / 1000000
  }

  dispose(): void {
    // OpenAI client doesn't require explicit disposal
  }

  private extractStatusCode(error: any): number | undefined {
    // Extract status code from OpenAI errors
    if (error.status) {
      return error.status
    }

    if (error.cause?.status) {
      return error.cause.status
    }

    // Common OpenAI error status codes
    if (error.message?.includes('401')) return 401
    if (error.message?.includes('429')) return 429
    if (error.message?.includes('500')) return 500

    return undefined
  }
}
