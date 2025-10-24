import { Injectable, Logger } from '@nestjs/common'
import { MessagingService } from '../messaging.service'
import {
  MessagingErrorHandler,
  HealthImpact,
} from '../error/messaging-error-handler'

export interface HealthCheckResult {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY'
  timestamp: number
  adapter: {
    connected: boolean
    type: string
    features: string[]
    lastCheck: number
  }
  metrics: {
    messagesProduced: number
    messagesConsumed: number
    errorsCount: number
    uptime: number
    responseTime: number
  }
  issues: string[]
  recommendations: string[]
}

export interface HealthMetrics {
  totalMessages: number
  successfulMessages: number
  failedMessages: number
  averageResponseTime: number
  throughput: number
  errorRate: number
  uptime: number
  lastActivity: number
}

export interface PerformanceMetrics {
  cpu: number
  memory: number
  networkLatency: number
  queueDepth: number
  consumerLag: number
  timestamp: number
}

@Injectable()
export class MessagingHealthService {
  private readonly logger = new Logger(MessagingHealthService.name)
  private readonly startTime = Date.now()
  private healthCheckInterval: NodeJS.Timeout | null = null
  private metrics = {
    messagesProduced: 0,
    messagesConsumed: 0,
    errorsCount: 0,
    totalResponseTime: 0,
    responseCount: 0,
    lastActivity: Date.now(),
  }

  private performanceHistory: PerformanceMetrics[] = []
  private maxHistorySize = 100

  constructor(
    private readonly messagingService: MessagingService,
    private readonly errorHandler: MessagingErrorHandler
  ) {}

  /**
   * Start continuous health monitoring
   */
  startHealthMonitoring(intervalMs: number = 30000): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }

    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performHealthCheck()
      } catch (error) {
        this.logger.error('Health check failed:', error)
      }
    }, intervalMs)

    this.logger.log(`Health monitoring started with ${intervalMs}ms interval`)
  }

  /**
   * Stop health monitoring
   */
  stopHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
      this.logger.log('Health monitoring stopped')
    }
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now()
    const result: HealthCheckResult = {
      status: 'HEALTHY',
      timestamp: startTime,
      adapter: {
        connected: false,
        type: 'unknown',
        features: [],
        lastCheck: startTime,
      },
      metrics: {
        messagesProduced: this.metrics.messagesProduced,
        messagesConsumed: this.metrics.messagesConsumed,
        errorsCount: this.metrics.errorsCount,
        uptime: Date.now() - this.startTime,
        responseTime: this.calculateAverageResponseTime(),
      },
      issues: [],
      recommendations: [],
    }

    try {
      // Check adapter connectivity
      const isConnected = await this.messagingService.healthCheck()
      result.adapter.connected = isConnected

      if (!isConnected) {
        result.status = 'UNHEALTHY'
        result.issues.push('Adapter is not connected')
        result.recommendations.push(
          'Check adapter configuration and connectivity'
        )
      } else {
        // Get adapter features
        try {
          const features = this.messagingService.getAdapterFeatures()
          result.adapter.type = features.type
          result.adapter.features = features.features
        } catch (error) {
          result.issues.push('Failed to get adapter features')
        }
      }

      // Check error handler health impact
      const healthImpact = this.errorHandler.assessHealthImpact()
      if (healthImpact.status === 'CRITICAL') {
        result.status = 'UNHEALTHY'
      } else if (
        healthImpact.status === 'DEGRADED' &&
        result.status === 'HEALTHY'
      ) {
        result.status = 'DEGRADED'
      }

      // Add error-related issues
      result.issues.push(...healthImpact.issues)
      result.recommendations.push(
        ...this.errorHandler.getRecoveryRecommendations()
      )

      // Check performance metrics
      const performance = this.calculatePerformanceMetrics()
      if (performance.cpu > 80 || performance.memory > 80) {
        if (result.status === 'HEALTHY') result.status = 'DEGRADED'
        result.issues.push('High resource usage detected')
        result.recommendations.push('Monitor system resources')
      }

      // Check error rate
      const errorRate = this.calculateErrorRate()
      if (errorRate > 0.1) {
        // 10% error rate
        if (result.status === 'HEALTHY') result.status = 'DEGRADED'
        result.issues.push('High error rate detected')
      }

      // Update last activity
      if (
        this.metrics.messagesProduced > 0 ||
        this.metrics.messagesConsumed > 0
      ) {
        ;(result.metrics as any).lastActivity = this.metrics.lastActivity
      }
    } catch (error) {
      result.status = 'UNHEALTHY'
      result.issues.push(
        `Health check failed: ${error instanceof Error ? error.message : String(error)}`
      )
      result.recommendations.push('Investigate health check failures')
    }

    return result
  }

  /**
   * Get current health metrics
   */
  getHealthMetrics(): HealthMetrics {
    const totalMessages =
      this.metrics.messagesProduced + this.metrics.messagesConsumed
    const successfulMessages = totalMessages - this.metrics.errorsCount
    const errorRate =
      totalMessages > 0 ? this.metrics.errorsCount / totalMessages : 0

    return {
      totalMessages,
      successfulMessages,
      failedMessages: this.metrics.errorsCount,
      averageResponseTime: this.calculateAverageResponseTime(),
      throughput: this.calculateThroughput(),
      errorRate,
      uptime: Date.now() - this.startTime,
      lastActivity: this.metrics.lastActivity,
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return this.calculatePerformanceMetrics()
  }

  /**
   * Get performance history
   */
  getPerformanceHistory(): PerformanceMetrics[] {
    return [...this.performanceHistory]
  }

  /**
   * Record message production
   */
  recordMessageProduced(responseTime?: number): void {
    this.metrics.messagesProduced++
    this.metrics.lastActivity = Date.now()

    if (responseTime) {
      this.metrics.totalResponseTime += responseTime
      this.metrics.responseCount++
    }
  }

  /**
   * Record message consumption
   */
  recordMessageConsumed(responseTime?: number): void {
    this.metrics.messagesConsumed++
    this.metrics.lastActivity = Date.now()

    if (responseTime) {
      this.metrics.totalResponseTime += responseTime
      this.metrics.responseCount++
    }
  }

  /**
   * Record error
   */
  recordError(): void {
    this.metrics.errorsCount++
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      messagesProduced: 0,
      messagesConsumed: 0,
      errorsCount: 0,
      totalResponseTime: 0,
      responseCount: 0,
      lastActivity: Date.now(),
    }
    this.performanceHistory = []
  }

  /**
   * Get detailed health report
   */
  async getDetailedHealthReport(): Promise<{
    health: HealthCheckResult
    metrics: HealthMetrics
    performance: PerformanceMetrics
    errorStatistics: any
    recommendations: string[]
  }> {
    const [health, metrics, performance] = await Promise.all([
      this.performHealthCheck(),
      Promise.resolve(this.getHealthMetrics()),
      Promise.resolve(this.getPerformanceMetrics()),
    ])

    const errorStatistics = this.errorHandler.getErrorStatistics()
    const recommendations = [
      ...health.recommendations,
      ...this.generatePerformanceRecommendations(performance),
    ]

    return {
      health,
      metrics,
      performance,
      errorStatistics,
      recommendations,
    }
  }

  /**
   * Check if the service is ready to handle requests
   */
  async isReady(): Promise<boolean> {
    try {
      const health = await this.performHealthCheck()
      return health.status !== 'UNHEALTHY'
    } catch (error) {
      return false
    }
  }

  /**
   * Check if the service is alive
   */
  async isLive(): Promise<boolean> {
    return true // Service is alive if it can respond
  }

  private calculateAverageResponseTime(): number {
    if (this.metrics.responseCount === 0) return 0
    return this.metrics.totalResponseTime / this.metrics.responseCount
  }

  private calculateThroughput(): number {
    const uptimeMs = Date.now() - this.startTime
    const totalMessages =
      this.metrics.messagesProduced + this.metrics.messagesConsumed
    return (totalMessages / uptimeMs) * 1000 // Messages per second
  }

  private calculateErrorRate(): number {
    const totalMessages =
      this.metrics.messagesProduced + this.metrics.messagesConsumed
    if (totalMessages === 0) return 0
    return this.metrics.errorsCount / totalMessages
  }

  private calculatePerformanceMetrics(): PerformanceMetrics {
    const now = Date.now()
    const uptime = now - this.startTime

    // Simple CPU usage estimation (in real implementation, use actual metrics)
    const cpu = Math.min(
      100,
      (this.metrics.messagesProduced + this.metrics.messagesConsumed) / 100
    )

    // Simple memory usage estimation (in real implementation, use actual metrics)
    const memory = Math.min(
      100,
      (this.performanceHistory.length / this.maxHistorySize) * 100
    )

    // Network latency estimation
    const networkLatency = this.calculateAverageResponseTime()

    // Queue depth estimation (based on recent activity)
    const queueDepth = Math.max(
      0,
      this.metrics.messagesProduced - this.metrics.messagesConsumed
    )

    // Consumer lag estimation
    const consumerLag = Math.max(0, queueDepth * 0.1) // Simplified calculation

    const metrics: PerformanceMetrics = {
      cpu,
      memory,
      networkLatency,
      queueDepth,
      consumerLag,
      timestamp: now,
    }

    // Add to history
    this.performanceHistory.push(metrics)
    if (this.performanceHistory.length > this.maxHistorySize) {
      this.performanceHistory.shift()
    }

    return metrics
  }

  private generatePerformanceRecommendations(
    performance: PerformanceMetrics
  ): string[] {
    const recommendations: string[] = []

    if (performance.cpu > 80) {
      recommendations.push(
        'High CPU usage detected - consider scaling or optimizing'
      )
    }

    if (performance.memory > 80) {
      recommendations.push(
        'High memory usage detected - investigate memory leaks'
      )
    }

    if (performance.networkLatency > 1000) {
      recommendations.push('High network latency - check network connectivity')
    }

    if (performance.queueDepth > 1000) {
      recommendations.push('High queue depth - consider adding more consumers')
    }

    if (performance.consumerLag > 500) {
      recommendations.push('High consumer lag - optimize message processing')
    }

    return recommendations
  }
}
