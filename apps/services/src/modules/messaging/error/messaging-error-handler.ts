import { Injectable, Logger } from '@nestjs/common'
import { MessageAdapter } from '../types'

export interface ErrorClassification {
  type:
    | 'CONNECTION'
    | 'TIMEOUT'
    | 'SERIALIZATION'
    | 'VALIDATION'
    | 'NETWORK'
    | 'AUTHENTICATION'
    | 'UNKNOWN'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  recoverable: boolean
  retryable: boolean
}

export interface ErrorContext {
  operation:
    | 'produce'
    | 'consume'
    | 'createTopic'
    | 'deleteTopic'
    | 'connect'
    | 'disconnect'
  topic?: string
  message?: any
  messageId?: string
  attempt: number
  maxRetries?: number
}

export interface ErrorHandlingResult {
  action: 'RETRY' | 'FAIL' | 'CIRCUIT_BREAK' | 'FALLBACK' | 'IGNORE'
  delay?: number
  maxRetries?: number
  retryable?: boolean
  exceededMaxRetries?: boolean
  circuitBreakerTimeout?: number
}

export interface ErrorStatistics {
  totalErrors: number
  errorsByType: Record<string, number>
  errorsByOperation: Record<string, number>
  errorsByTopic: Record<string, number>
  recentErrors: Array<{
    error: string
    type: string
    operation: string
    topic: string
    timestamp: number
  }>
}

export interface DeadLetterQueueResult {
  deadLettered: boolean
  errorMessage?: string
  retryCount?: number
  reason?: string
  timestamp?: number
}

export interface HealthImpact {
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL'
  score: number
  affectedOperations: string[]
  issues: string[]
}

export interface CachedResult {
  data: any
  success: boolean
  timestamp: number
  ttl?: number
}

@Injectable()
export class MessagingErrorHandler {
  private readonly logger = new Logger(MessagingErrorHandler.name)
  private readonly errorStatistics = new Map<string, number>()
  private readonly recentErrors: Array<any> = []
  private readonly circuitBreakers = new Map<
    string,
    { failures: number; lastFailure: number; isOpen: boolean }
  >()
  private readonly cachedResults = new Map<string, CachedResult>()
  private readonly dlqMessages: any[] = []

  private fallbackHandlers = new Map<string, Function>()
  private alertHandlers: Function[] = []
  private dlqSettings = {
    enabled: true,
    maxRetries: 3,
    retryDelay: 5000,
    dlqTopic: 'dead-letter-queue',
    maxSize: 1000,
  }

  private dlqUsed = 0

  /**
   * Classify an error based on its properties
   */
  classifyError(error: Error): ErrorClassification {
    const message = error.message.toLowerCase()

    // Connection errors
    if (
      message.includes('connection refused') ||
      message.includes('connect') ||
      message.includes('econnrefused')
    ) {
      return {
        type: 'CONNECTION',
        severity: 'HIGH',
        recoverable: true,
        retryable: true,
      }
    }

    // Network errors
    if (
      message.includes('network') ||
      message.includes('enetdown') ||
      message.includes('enotunreach')
    ) {
      return {
        type: 'NETWORK',
        severity: 'HIGH',
        recoverable: true,
        retryable: true,
      }
    }

    // Timeout errors
    if (message.includes('timeout') || message.includes('etimedout')) {
      return {
        type: 'TIMEOUT',
        severity: 'MEDIUM',
        recoverable: true,
        retryable: true,
      }
    }

    // Serialization errors
    if (
      message.includes('serialization') ||
      message.includes('json') ||
      message.includes('parse')
    ) {
      return {
        type: 'SERIALIZATION',
        severity: 'MEDIUM',
        recoverable: false,
        retryable: false,
      }
    }

    // Validation errors
    if (
      message.includes('validation') ||
      message.includes('invalid') ||
      message.includes('schema')
    ) {
      return {
        type: 'VALIDATION',
        severity: 'MEDIUM',
        recoverable: false,
        retryable: false,
      }
    }

    // Authentication errors
    if (
      message.includes('authentication') ||
      message.includes('unauthorized') ||
      message.includes('forbidden')
    ) {
      return {
        type: 'AUTHENTICATION',
        severity: 'HIGH',
        recoverable: false,
        retryable: false,
      }
    }

    // Unknown errors
    return {
      type: 'UNKNOWN',
      severity: 'HIGH',
      recoverable: true,
      retryable: true,
    }
  }

  /**
   * Handle an error with appropriate strategy
   */
  async handleError(
    error: Error,
    context: ErrorContext
  ): Promise<ErrorHandlingResult> {
    const classification = this.classifyError(error)
    this.trackError(error, context.operation, context.topic)

    // Check if max retries exceeded
    if (context.attempt >= (context.maxRetries || 3)) {
      return {
        action: 'FAIL',
        exceededMaxRetries: true,
      }
    }

    // Check circuit breaker
    const circuitBreakerKey = `${context.operation}:${context.topic || 'default'}`
    if (this.isCircuitOpen(circuitBreakerKey)) {
      return {
        action: 'CIRCUIT_BREAK',
        circuitBreakerTimeout: 60000, // 1 minute
      }
    }

    // Determine action based on error type
    if (!classification.retryable) {
      return {
        action: 'FAIL',
        retryable: false,
      }
    }

    // Calculate retry delay with exponential backoff
    const baseDelay = 1000
    const delay = baseDelay * Math.pow(2, context.attempt - 1)

    return {
      action: 'RETRY',
      delay,
      maxRetries: context.maxRetries || 3,
      retryable: true,
    }
  }

  /**
   * Track error for statistics and monitoring
   */
  trackError(error: Error, operation: string, topic?: string): void {
    const key = `${operation}:${topic || 'unknown'}`
    this.errorStatistics.set(key, (this.errorStatistics.get(key) || 0) + 1)

    // Track recent errors
    this.recentErrors.push({
      error: error.message,
      operation,
      topic: topic || 'unknown',
      timestamp: Date.now(),
    })

    // Keep only recent errors (last 100)
    if (this.recentErrors.length > 100) {
      this.recentErrors.shift()
    }

    // Update circuit breakers
    const circuitBreakerKey = `${operation}:${topic || 'default'}`
    this.updateCircuitBreaker(circuitBreakerKey)
  }

  /**
   * Get error statistics
   */
  getErrorStatistics(): ErrorStatistics {
    const stats: ErrorStatistics = {
      totalErrors: this.recentErrors.length,
      errorsByType: {},
      errorsByOperation: {},
      errorsByTopic: {},
      recentErrors: this.recentErrors.slice(-20), // Last 20 errors
    }

    // Process recent errors for statistics
    for (const error of this.recentErrors) {
      stats.errorsByOperation[error.operation] =
        (stats.errorsByOperation[error.operation] || 0) + 1
      stats.errorsByTopic[error.topic] =
        (stats.errorsByTopic[error.topic] || 0) + 1
    }

    return stats
  }

  /**
   * Get error trends over time
   */
  getErrorTrends(
    timeRange: string
  ): Array<{ timestamp: number; count: number }> {
    const now = Date.now()
    let rangeMs: number

    switch (timeRange) {
      case '1h':
        rangeMs = 60 * 60 * 1000
        break
      case '24h':
        rangeMs = 24 * 60 * 60 * 1000
        break
      case '7d':
        rangeMs = 7 * 24 * 60 * 60 * 1000
        break
      default:
        rangeMs = 60 * 60 * 1000 // Default to 1 hour
    }

    const filtered = this.recentErrors.filter(e => now - e.timestamp <= rangeMs)

    // Group by hour buckets
    const buckets = new Map<number, number>()
    for (const error of filtered) {
      const bucket =
        Math.floor(error.timestamp / (60 * 60 * 1000)) * (60 * 60 * 1000)
      buckets.set(bucket, (buckets.get(bucket) || 0) + 1)
    }

    return Array.from(buckets.entries())
      .map(([timestamp, count]) => ({ timestamp, count }))
      .sort((a, b) => a.timestamp - b.timestamp)
  }

  /**
   * Generate comprehensive error report
   */
  generateErrorReport(): {
    summary: any
    statistics: ErrorStatistics
    recommendations: string[]
    timestamp: number
  } {
    const stats = this.getErrorStatistics()
    const trends = this.getErrorTrends('1h')

    const summary = {
      totalErrors: stats.totalErrors,
      errorRate: this.calculateErrorRate(),
      mostCommonOperation: this.getMostCommonOperation(stats),
      mostCommonTopic: this.getMostCommonTopic(stats),
      healthStatus: this.assessHealthImpact().status,
    }

    const recommendations = this.getRecoveryRecommendations()

    return {
      summary,
      statistics: stats,
      recommendations,
      timestamp: Date.now(),
    }
  }

  /**
   * Detect error patterns
   */
  detectErrorPatterns(): string[] {
    const patterns: string[] = []
    const stats = this.getErrorStatistics()

    // High error rate
    if (stats.totalErrors > 50) {
      patterns.push('HIGH_ERROR_RATE')
    }

    // Repeated connection errors
    const connectionErrors = stats.recentErrors.filter(e =>
      e.error.toLowerCase().includes('connection')
    )
    if (connectionErrors.length > 10) {
      patterns.push('REPEATED_CONNECTION_ERRORS')
    }

    // Topic-specific issues
    for (const [topic, count] of Object.entries(stats.errorsByTopic)) {
      if (count > 20) {
        patterns.push(`TOPIC_SPECIFIC_ISSUES:${topic}`)
      }
    }

    return patterns
  }

  /**
   * Handle failed message with dead letter queue
   */
  async handleFailedMessage(
    message: any,
    error: Error,
    context: {
      topic: string
      originalError: Error
      retryCount: number
    }
  ): Promise<DeadLetterQueueResult> {
    if (!this.dlqSettings.enabled) {
      return {
        deadLettered: false,
        reason: 'DLQ_DISABLED',
      }
    }

    // Check DLQ size limit
    if (this.dlqUsed >= this.dlqSettings.maxSize) {
      return {
        deadLettered: false,
        reason: 'DLQ_FULL',
      }
    }

    // Add to DLQ
    const dlqMessage = {
      originalMessage: message,
      error: error.message,
      topic: context.topic,
      retryCount: context.retryCount,
      timestamp: Date.now(),
    }

    this.dlqMessages.push(dlqMessage)
    this.dlqUsed++

    this.logger.warn(`Message sent to DLQ: ${error.message}`)

    return {
      deadLettered: true,
      errorMessage: error.message,
      retryCount: context.retryCount,
      timestamp: Date.now(),
    }
  }

  /**
   * Get DLQ settings
   */
  getDLQSettings(): typeof this.dlqSettings {
    return { ...this.dlqSettings }
  }

  /**
   * Set DLQ size (for testing)
   */
  setDLQSize(size: number): void {
    this.dlqSettings.maxSize = size
  }

  /**
   * Set DLQ used count (for testing)
   */
  setDLQUsed(used: number): void {
    this.dlqUsed = used
  }

  /**
   * Attempt to recover from an error
   */
  async attemptRecovery(adapter: MessageAdapter): Promise<boolean> {
    try {
      // Try to disconnect and reconnect
      await adapter.disconnect()
      await this.sleep(1000) // Brief pause
      await adapter.connect()
      return true
    } catch (error) {
      this.logger.error('Recovery attempt failed:', error)
      return false
    }
  }

  /**
   * Reconnect adapter
   */
  async reconnectAdapter(adapter: MessageAdapter): Promise<boolean> {
    try {
      await adapter.disconnect()
      await adapter.connect()
      return true
    } catch (error) {
      this.logger.error('Reconnection failed:', error)
      return false
    }
  }

  /**
   * Set fallback handler for an operation
   */
  setFallbackHandler(operation: string, handler: Function): void {
    this.fallbackHandlers.set(operation, handler)
  }

  /**
   * Execute operation with fallback
   */
  async executeWithFallback<T>(
    operation: string,
    args: any[],
    primaryFn: () => Promise<T>
  ): Promise<T> {
    try {
      return await primaryFn()
    } catch (error) {
      const fallback = this.fallbackHandlers.get(operation)
      if (fallback) {
        this.logger.warn(`Using fallback for ${operation}`)
        return await fallback(...args)
      }
      throw error
    }
  }

  /**
   * Check if circuit is open for an operation
   */
  isCircuitOpen(key: string): boolean {
    const circuit = this.circuitBreakers.get(key)
    if (!circuit) return false

    if (circuit.isOpen) {
      // Check if circuit should close (after timeout)
      const timeout = 60000 // 1 minute
      if (Date.now() - circuit.lastFailure > timeout) {
        circuit.isOpen = false
        circuit.failures = 0
        return false
      }
      return true
    }

    return false
  }

  /**
   * Execute operation with circuit breaker
   */
  async executeWithCircuitBreaker<T>(
    operation: string,
    args: any[],
    fn: () => Promise<T>
  ): Promise<ErrorHandlingResult | T> {
    const key = `${operation}:${args[0] || 'default'}`

    if (this.isCircuitOpen(key)) {
      return {
        action: 'CIRCUIT_BREAK',
        circuitBreakerTimeout: 60000,
      }
    }

    try {
      const result = await fn()
      // Reset circuit on success
      const circuit = this.circuitBreakers.get(key)
      if (circuit) {
        circuit.failures = 0
        circuit.isOpen = false
      }
      return result
    } catch (error) {
      this.updateCircuitBreaker(key)
      throw error
    }
  }

  /**
   * Set cached result
   */
  setCachedResult(key: string, result: CachedResult): void {
    this.cachedResults.set(key, result)
  }

  /**
   * Execute operation with cache
   */
  async executeWithCache<T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T | CachedResult> {
    const cached = this.cachedResults.get(key)
    if (cached && cached.success) {
      // Check TTL
      const ttl = cached.ttl || 300000 // 5 minutes default
      if (Date.now() - cached.timestamp < ttl) {
        return cached
      }
    }

    try {
      const result = await fn()
      this.setCachedResult(key, {
        data: result,
        success: true,
        timestamp: Date.now(),
      })
      return result
    } catch (error) {
      // Don't cache failures
      throw error
    }
  }

  /**
   * Assess health impact based on errors
   */
  assessHealthImpact(): HealthImpact {
    const stats = this.getErrorStatistics()
    const patterns = this.detectErrorPatterns()

    let score = 100
    const issues: string[] = []
    const affectedOperations = Object.keys(stats.errorsByOperation)

    // Deduct points for errors
    score -= Math.min(stats.totalErrors * 2, 50)

    // Deduct points for critical patterns
    if (patterns.includes('HIGH_ERROR_RATE')) {
      score -= 20
      issues.push('High error rate detected')
    }

    if (patterns.includes('REPEATED_CONNECTION_ERRORS')) {
      score -= 30
      issues.push('Repeated connection errors')
    }

    let status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL'
    if (score >= 80) {
      status = 'HEALTHY'
    } else if (score >= 50) {
      status = 'DEGRADED'
    } else {
      status = 'CRITICAL'
    }

    return {
      status,
      score: Math.max(0, score),
      affectedOperations,
      issues,
    }
  }

  /**
   * Get recovery recommendations
   */
  getRecoveryRecommendations(): string[] {
    const recommendations: string[] = []
    const patterns = this.detectErrorPatterns()
    const stats = this.getErrorStatistics()

    if (patterns.includes('HIGH_ERROR_RATE')) {
      recommendations.push('Consider implementing rate limiting')
      recommendations.push('Review error patterns and fix root causes')
    }

    if (patterns.includes('REPEATED_CONNECTION_ERRORS')) {
      recommendations.push('Check network connectivity')
      recommendations.push('Verify broker configuration and availability')
    }

    // Check for specific topics with high error rates
    for (const [topic, count] of Object.entries(stats.errorsByTopic)) {
      if (count > 10) {
        recommendations.push(`Investigate issues with topic: ${topic}`)
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('System appears to be functioning normally')
    }

    return recommendations
  }

  /**
   * Log error with context
   */
  logError(error: Error, context: Partial<ErrorContext>): void {
    this.logger.error(`Error in ${context.operation}: ${error.message}`, {
      topic: context.topic,
      messageId: context.messageId,
      attempt: context.attempt,
      stack: error.stack,
    })
  }

  /**
   * Set alert handler
   */
  setAlertHandler(handler: Function): void {
    this.alertHandlers.push(handler)
  }

  /**
   * Check and send alerts for critical errors
   */
  async checkAndSendAlerts(): Promise<void> {
    const health = this.assessHealthImpact()

    if (health.status === 'CRITICAL') {
      const alert = {
        level: 'CRITICAL',
        message: 'Critical system health issues detected',
        health,
        timestamp: Date.now(),
      }

      for (const handler of this.alertHandlers) {
        try {
          await handler(alert)
        } catch (error) {
          this.logger.error('Alert handler failed:', error)
        }
      }
    }
  }

  private updateCircuitBreaker(key: string): void {
    const circuit = this.circuitBreakers.get(key) || {
      failures: 0,
      lastFailure: 0,
      isOpen: false,
    }

    circuit.failures++
    circuit.lastFailure = Date.now()

    // Open circuit after 5 failures
    if (circuit.failures >= 5) {
      circuit.isOpen = true
    }

    this.circuitBreakers.set(key, circuit)
  }

  private calculateErrorRate(): number {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const recentErrors = this.recentErrors.filter(e => e.timestamp > oneHourAgo)
    return recentErrors.length
  }

  private getMostCommonOperation(stats: ErrorStatistics): string {
    const entries = Object.entries(stats.errorsByOperation)
    return entries.length > 0
      ? entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      : 'none'
  }

  private getMostCommonTopic(stats: ErrorStatistics): string {
    const entries = Object.entries(stats.errorsByTopic)
    return entries.length > 0
      ? entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      : 'none'
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
