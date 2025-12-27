import { AIRequest, AIResponse, AIStreamChunk, AIProvider } from '../types'
import { AIConfigManager } from '../config/ai-config-manager'

interface CacheEntry {
  request: AIRequest
  response: AIResponse
  timestamp: number
  provider: AIProvider
  model: string
}

interface StreamCacheEntry {
  request: AIRequest
  chunks: AIStreamChunk[]
  timestamp: number
  provider: AIProvider
  model: string
}

export class AICache {
  private static instance: AICache
  private configManager: AIConfigManager
  private cache = new Map<string, CacheEntry>()
  private streamCache = new Map<string, StreamCacheEntry>()
  private cleanupTimer: NodeJS.Timeout | null = null

  private constructor() {
    this.configManager = AIConfigManager.getInstance()
    this.startCleanupTimer()
  }

  static getInstance(): AICache {
    if (!AICache.instance) {
      AICache.instance = new AICache()
    }
    return AICache.instance
  }

  async get(
    request: AIRequest,
    provider: AIProvider,
    model: string
  ): Promise<AIResponse | null> {
    const config = this.configManager.getConfig()

    if (!config.cache.enabled) {
      return null
    }

    const key = this.generateKey(request, provider, model)
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if entry is expired
    const now = Date.now()
    if (now - entry.timestamp > config.cache.ttl * 1000) {
      this.cache.delete(key)
      return null
    }

    return entry.response
  }

  async getStream(
    request: AIRequest,
    provider: AIProvider,
    model: string
  ): Promise<AIStreamChunk[] | null> {
    const config = this.configManager.getConfig()

    if (!config.cache.enabled) {
      return null
    }

    const key = this.generateKey(request, provider, model)
    const entry = this.streamCache.get(key)

    if (!entry) {
      return null
    }

    // Check if entry is expired
    const now = Date.now()
    if (now - entry.timestamp > config.cache.ttl * 1000) {
      this.streamCache.delete(key)
      return null
    }

    return entry.chunks
  }

  set(
    request: AIRequest,
    response: AIResponse,
    provider: AIProvider,
    model: string
  ): void {
    const config = this.configManager.getConfig()

    if (!config.cache.enabled) {
      return
    }

    const key = this.generateKey(request, provider, model)
    const entry: CacheEntry = {
      request: { ...request }, // Deep copy to avoid mutations
      response: { ...response },
      timestamp: Date.now(),
      provider,
      model,
    }

    this.cache.set(key, entry)
    this.enforceMaxSize()
  }

  setStream(
    request: AIRequest,
    chunks: AIStreamChunk[],
    provider: AIProvider,
    model: string
  ): void {
    const config = this.configManager.getConfig()

    if (!config.cache.enabled) {
      return
    }

    const key = this.generateKey(request, provider, model)
    const entry: StreamCacheEntry = {
      request: { ...request }, // Deep copy to avoid mutations
      chunks: [...chunks], // Deep copy to avoid mutations
      timestamp: Date.now(),
      provider,
      model,
    }

    this.streamCache.set(key, entry)
    this.enforceMaxSize()
  }

  invalidate(request: AIRequest, provider: AIProvider, model: string): void {
    const key = this.generateKey(request, provider, model)
    this.cache.delete(key)
    this.streamCache.delete(key)
  }

  invalidateProvider(provider: AIProvider): void {
    for (const [key, entry] of this.cache) {
      if (entry.provider === provider) {
        this.cache.delete(key)
      }
    }

    for (const [key, entry] of this.streamCache) {
      if (entry.provider === provider) {
        this.streamCache.delete(key)
      }
    }
  }

  clear(): void {
    this.cache.clear()
    this.streamCache.clear()
  }

  getStats(): {
    size: number
    streamSize: number
    hitRate: number
    memoryUsage: number
  } {
    const config = this.configManager.getConfig()

    return {
      size: this.cache.size,
      streamSize: this.streamCache.size,
      hitRate: 0, // TODO: Implement hit rate tracking
      memoryUsage: this.estimateMemoryUsage(),
    }
  }

  dispose(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
    this.clear()
  }

  private generateKey(
    request: AIRequest,
    provider: AIProvider,
    model: string
  ): string {
    // Create a deterministic key from the request
    const keyData = {
      provider,
      model,
      messages: request.messages,
      temperature: request.temperature,
      maxTokens: request.maxTokens,
    }

    return Buffer.from(JSON.stringify(keyData)).toString('base64')
  }

  private enforceMaxSize(): void {
    const config = this.configManager.getConfig()
    const maxSize = config.cache.maxSize

    // Remove oldest entries if cache is too large
    while (this.cache.size > maxSize) {
      const oldestKey = this.findOldestEntry(this.cache)
      if (oldestKey) {
        this.cache.delete(oldestKey)
      } else {
        break
      }
    }

    while (this.streamCache.size > maxSize) {
      const oldestKey = this.findOldestStreamEntry()
      if (oldestKey) {
        this.streamCache.delete(oldestKey)
      } else {
        break
      }
    }
  }

  private findOldestEntry(cache: Map<string, CacheEntry>): string | null {
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, entry] of cache) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    return oldestKey
  }

  private findOldestStreamEntry(): string | null {
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, entry] of this.streamCache) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    return oldestKey
  }

  private estimateMemoryUsage(): number {
    // Rough estimation in bytes
    let size = 0

    for (const [key, entry] of this.cache) {
      size += key.length * 2 // UTF-16 characters
      size += JSON.stringify(entry).length * 2
    }

    for (const [key, entry] of this.streamCache) {
      size += key.length * 2
      size += JSON.stringify(entry).length * 2
    }

    return size
  }

  private startCleanupTimer(): void {
    // Clean up expired entries every hour
    this.cleanupTimer = setInterval(
      () => {
        this.cleanup()
      },
      60 * 60 * 1000
    )
  }

  private cleanup(): void {
    const config = this.configManager.getConfig()
    const now = Date.now()
    const cutoffTime = now - config.cache.ttl * 1000

    // Clean expired entries from regular cache
    for (const [key, entry] of this.cache) {
      if (entry.timestamp < cutoffTime) {
        this.cache.delete(key)
      }
    }

    // Clean expired entries from stream cache
    for (const [key, entry] of this.streamCache) {
      if (entry.timestamp < cutoffTime) {
        this.streamCache.delete(key)
      }
    }
  }
}
