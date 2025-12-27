import { AIRequest, AIProvider, AIConfigError } from '../types'
import { AIConfigManager } from '../config/ai-config-manager'

interface CostRecord {
  timestamp: number
  provider: AIProvider
  model: string
  tokens: number
  cost: number
  userId?: string
}

export interface DailyUsage {
  date: string // YYYY-MM-DD
  totalCost: number
  totalTokens: number
  requestCount: number
  userUsage: Record<string, { cost: number; requests: number }>
}

export class AICostTracker {
  private static instance: AICostTracker
  private configManager: AIConfigManager
  private dailyUsage = new Map<string, DailyUsage>()
  private userRequestCounts = new Map<string, number>()

  private constructor() {
    this.configManager = AIConfigManager.getInstance()
  }

  static getInstance(): AICostTracker {
    if (!AICostTracker.instance) {
      AICostTracker.instance = new AICostTracker()
    }
    return AICostTracker.instance
  }

  async estimateCost(
    request: AIRequest,
    provider: AIProvider,
    model: string
  ): Promise<number> {
    const config = this.configManager.getConfig()

    if (!config.cost.enabled) {
      return 0
    }

    const costPerToken = config.cost.costPerToken[model]
    if (!costPerToken) {
      console.warn(
        `No cost configured for model ${model}, using default estimation`
      )
      return this.estimateTokensCost(request) * 0.001 // Default fallback
    }

    return (this.estimateTokensCost(request) * costPerToken) / 1000000 // Cost per 1M tokens
  }

  recordCost(
    provider: AIProvider,
    model: string,
    tokens: number,
    userId?: string
  ): number {
    const config = this.configManager.getConfig()

    if (!config.cost.enabled) {
      return 0
    }

    const costPerToken = config.cost.costPerToken[model] || 0.001 // Default fallback
    const cost = (tokens * costPerToken) / 1000000

    const today = new Date().toISOString().split('T')[0]
    const record: CostRecord = {
      timestamp: Date.now(),
      provider,
      model,
      tokens,
      cost,
      userId,
    }

    // Update daily usage
    let dailyUsage = this.dailyUsage.get(today)
    if (!dailyUsage) {
      dailyUsage = {
        date: today,
        totalCost: 0,
        totalTokens: 0,
        requestCount: 0,
        userUsage: {},
      }
      this.dailyUsage.set(today, dailyUsage)
    }

    dailyUsage.totalCost += cost
    dailyUsage.totalTokens += tokens
    dailyUsage.requestCount += 1

    if (userId) {
      if (!dailyUsage.userUsage[userId]) {
        dailyUsage.userUsage[userId] = { cost: 0, requests: 0 }
      }
      dailyUsage.userUsage[userId].cost += cost
      dailyUsage.userUsage[userId].requests += 1

      // Update user request count for rate limiting
      const currentCount = this.userRequestCounts.get(userId) || 0
      this.userRequestCounts.set(userId, currentCount + 1)
    }

    return cost
  }

  checkDailyLimit(): boolean {
    const config = this.configManager.getConfig()

    if (!config.cost.enabled || !config.cost.maxDailyCost) {
      return true
    }

    const today = new Date().toISOString().split('T')[0]
    const dailyUsage = this.dailyUsage.get(today)

    if (!dailyUsage) {
      return true
    }

    return dailyUsage.totalCost < config.cost.maxDailyCost
  }

  checkUserLimit(userId: string): boolean {
    const config = this.configManager.getConfig()

    if (!config.cost.enabled || !config.cost.maxRequestsPerUser) {
      return true
    }

    const today = new Date().toISOString().split('T')[0]
    const dailyUsage = this.dailyUsage.get(today)

    if (!dailyUsage || !dailyUsage.userUsage[userId]) {
      return true
    }

    return (
      dailyUsage.userUsage[userId].requests < config.cost.maxRequestsPerUser
    )
  }

  getDailyUsage(date?: string): DailyUsage | null {
    const targetDate = date || new Date().toISOString().split('T')[0]
    return this.dailyUsage.get(targetDate) || null
  }

  getUserUsage(
    userId: string,
    date?: string
  ): { cost: number; requests: number } | null {
    const targetDate = date || new Date().toISOString().split('T')[0]
    const dailyUsage = this.dailyUsage.get(targetDate)

    if (!dailyUsage || !dailyUsage.userUsage[userId]) {
      return null
    }

    return dailyUsage.userUsage[userId]
  }

  getUsageSummary(days: number = 7): {
    totalCost: number
    totalTokens: number
    totalRequests: number
    dailyBreakdown: DailyUsage[]
  } {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days + 1)

    let totalCost = 0
    let totalTokens = 0
    let totalRequests = 0
    const dailyBreakdown: DailyUsage[] = []

    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toISOString().split('T')[0]
      const usage = this.dailyUsage.get(dateStr)

      if (usage) {
        totalCost += usage.totalCost
        totalTokens += usage.totalTokens
        totalRequests += usage.requestCount
        dailyBreakdown.push(usage)
      }
    }

    return {
      totalCost,
      totalTokens,
      totalRequests,
      dailyBreakdown,
    }
  }

  // Clean up old data (older than 30 days)
  cleanup(): void {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 30)
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0]

    for (const [date] of this.dailyUsage) {
      if (date < cutoffDateStr) {
        this.dailyUsage.delete(date)
      }
    }
  }

  private estimateTokensCost(request: AIRequest): number {
    // Rough estimation: ~4 characters per token
    const totalChars = request.messages.reduce(
      (sum, msg) => sum + msg.content.length,
      0
    )
    return Math.ceil(totalChars / 4)
  }

  // Reset daily counters (useful for testing)
  reset(): void {
    this.dailyUsage.clear()
    this.userRequestCounts.clear()
  }
}
