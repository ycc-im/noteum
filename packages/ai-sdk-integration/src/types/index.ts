import { z } from 'zod'

// Provider types
export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  UNKNOWN = 'unknown',
}

// Core request/response types
export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIRequest {
  messages: AIMessage[]
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  maxRetries?: number
}

export interface AIResponse {
  content: string
  usage?: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
  model: string
  provider: AIProvider
}

export interface AIStreamChunk {
  content?: string
  delta?: string
  isComplete: boolean
  usage?: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
}

// Configuration types
export interface AIProviderConfig {
  apiKey: string
  baseURL?: string
  models: string[]
  defaultModel: string
  maxTokens?: number
  temperature?: number
}

export interface AICostConfig {
  enabled: boolean
  maxDailyCost?: number
  maxRequestsPerUser?: number
  costPerToken: Record<string, number>
}

export interface AICacheConfig {
  enabled: boolean
  ttl: number // Time to live in seconds
  maxSize: number // Maximum number of cached responses
}

export interface AIConfig {
  defaultProvider: AIProvider
  providers: Partial<Record<AIProvider, AIProviderConfig>>
  cost: AICostConfig
  cache: AICacheConfig
  fallbackProvider?: AIProvider
}

// Provider interface
export interface IAIProvider {
  readonly name: AIProvider
  readonly config: AIProviderConfig

  initialize(): Promise<void>
  isHealthy(): Promise<boolean>

  generateText(request: AIRequest): Promise<AIResponse>
  generateStream(request: AIRequest): Promise<ReadableStream<AIStreamChunk>>

  // Cost estimation
  estimateCost(request: AIRequest): Promise<number>

  // Cleanup
  dispose?(): void
}

// Error types
export class AIError extends Error {
  constructor(
    message: string,
    public readonly provider: AIProvider,
    public readonly code?: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = 'AIError'
  }
}

export class AIProviderError extends AIError {
  constructor(
    message: string,
    provider: AIProvider,
    public readonly originalError: Error,
    code?: string,
    statusCode?: number
  ) {
    super(message, provider, code, statusCode)
    this.name = 'AIProviderError'
  }
}

export class AIConfigError extends Error {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message)
    this.name = 'AIConfigError'
  }
}

// Zod schemas for validation
export const AIMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
})

export const AIRequestSchema = z.object({
  messages: z.array(AIMessageSchema).min(1),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  stream: z.boolean().optional(),
})

export const AIProviderConfigSchema = z.object({
  apiKey: z.string().min(1),
  baseURL: z.string().url().optional(),
  models: z.array(z.string()).min(1),
  defaultModel: z.string(),
  maxTokens: z.number().positive().optional(),
  temperature: z.number().min(0).max(2).optional(),
})

export const AICostConfigSchema = z.object({
  enabled: z.boolean(),
  maxDailyCost: z.number().positive().optional(),
  maxRequestsPerUser: z.number().positive().optional(),
  costPerToken: z.record(z.number().positive()),
})

export const AICacheConfigSchema = z.object({
  enabled: z.boolean(),
  ttl: z.number().positive(),
  maxSize: z.number().positive(),
})

export const AIConfigSchema = z.object({
  defaultProvider: z.nativeEnum(AIProvider),
  providers: z.record(AIProviderConfigSchema),
  cost: AICostConfigSchema,
  cache: AICacheConfigSchema,
  fallbackProvider: z.nativeEnum(AIProvider).optional(),
})
