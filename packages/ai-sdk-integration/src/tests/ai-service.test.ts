import { AIService } from '../ai-service'
import { AIProviderRegistry } from '../providers/provider-registry'
import { AIConfigManager } from '../config/ai-config-manager'
import {
    AIProvider,
    IAIProvider,
    AIRequest,
    AIResponse,
    AIStreamChunk,
    AIProviderConfig,
} from '../types'

// Mock environment variables
const mockEnv = {
    AI_DEFAULT_PROVIDER: 'openai',
    OPENAI_API_KEY: 'test-openai-key',
    OPENAI_MODELS: 'gpt-3.5-turbo',
    OPENAI_DEFAULT_MODEL: 'gpt-3.5-turbo',
    ANTHROPIC_API_KEY: 'test-anthropic-key',
    ANTHROPIC_MODELS: 'claude-3-haiku-20240307',
    ANTHROPIC_DEFAULT_MODEL: 'claude-3-haiku-20240307',
    AI_COST_ENABLED: 'false',
    AI_CACHE_ENABLED: 'false',
}

class MockProvider implements IAIProvider {
    name = AIProvider.OPENAI
    config: AIProviderConfig = {
        apiKey: 'test-key',
        models: ['gpt-3.5-turbo'],
        defaultModel: 'gpt-3.5-turbo',
    }

    async initialize(): Promise<void> { }
    async isHealthy(): Promise<boolean> {
        return true
    }

    async generateText(request: AIRequest): Promise<AIResponse> {
        return {
            content: 'Mock response content',
            usage: {
                inputTokens: 10,
                outputTokens: 5,
                totalTokens: 15,
            },
            model: 'gpt-3.5-turbo',
            provider: this.name,
        }
    }

    async generateStream(
        request: AIRequest
    ): Promise<ReadableStream<AIStreamChunk>> {
        return new ReadableStream({
            start(controller) {
                controller.enqueue({
                    content: 'Mock',
                    isComplete: false,
                })
                controller.enqueue({
                    content: ' stream',
                    isComplete: false,
                })
                controller.enqueue({
                    isComplete: true,
                    usage: {
                        inputTokens: 10,
                        outputTokens: 5,
                        totalTokens: 15,
                    },
                })
                controller.close()
            },
        })
    }

    async estimateCost(request: AIRequest): Promise<number> {
        return 0.001
    }
}

describe('AIService', () => {
    let aiService: AIService
    let originalEnv: NodeJS.ProcessEnv

    beforeEach(async () => {
        // Store original environment
        originalEnv = { ...process.env }
        Object.assign(process.env, mockEnv)

            // Reset singletons
            ; (AIConfigManager as any).instance = null
            ; (AIProviderRegistry as any).instance = null
            ; (AIService as any).instance = null

        // Register mock provider
        const registry = AIProviderRegistry.getInstance()
        const mockProvider = new MockProvider()
        registry.registerProvider(mockProvider)

        aiService = AIService.getInstance()
        // Initialize (loads config)
        await aiService.initialize()
    })

    afterEach(() => {
        if (aiService) {
            aiService.dispose()
        }
        process.env = originalEnv
            ; (AIConfigManager as any).instance = null
            ; (AIProviderRegistry as any).instance = null
            ; (AIService as any).instance = null
    })

    it('should generate text successfully', async () => {
        const request: AIRequest = {
            messages: [{ role: 'user', content: 'Hello' }],
        }

        const response = await aiService.generateText(request)

        expect(response.content).toBe('Mock response content')
        expect(response.provider).toBe(AIProvider.OPENAI)
    })

    it('should validate request messages', async () => {
        const request: AIRequest = {
            messages: [],
        }

        await expect(aiService.generateText(request)).rejects.toThrow(
            'Request must contain at least one message'
        )
    })

    it('should require a user message', async () => {
        const request: AIRequest = {
            messages: [{ role: 'system', content: 'You are a bot' }],
        }

        await expect(aiService.generateText(request)).rejects.toThrow(
            'Request must contain at least one user message'
        )
    })

    it('should generate stream successfully', async () => {
        const request: AIRequest = {
            messages: [{ role: 'user', content: 'Hello' }],
        }

        const stream = await aiService.generateStream(request)
        const reader = stream.getReader()
        const chunks: AIStreamChunk[] = []

        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            chunks.push(value)
        }

        expect(chunks.length).toBeGreaterThan(0)
        expect(chunks[0].content).toBe('Mock')
        expect(chunks.some(c => c.isComplete)).toBe(true)
    })
})
