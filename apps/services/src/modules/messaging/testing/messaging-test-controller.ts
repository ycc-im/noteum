import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { MessagingService } from '../messaging.service'
import { MessagingErrorHandler } from '../error/messaging-error-handler'
import { MessagingHealthService } from '../health/messaging-health.service'
import { MessageConfigManager } from '../config/message-config-manager'

@Controller('messaging-test')
export class MessagingTestController {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly errorHandler: MessagingErrorHandler,
    private readonly healthService: MessagingHealthService,
    private readonly configManager: MessageConfigManager
  ) {}

  @Get('health')
  async getHealth() {
    return this.healthService.performHealthCheck()
  }

  @Get('metrics')
  async getMetrics() {
    return {
      health: this.healthService.getHealthMetrics(),
      performance: this.healthService.getPerformanceMetrics(),
      history: this.healthService.getPerformanceHistory(),
      errors: this.errorHandler.getErrorStatistics(),
    }
  }

  @Post('produce/:topic')
  async produceMessage(
    @Param('topic') topic: string,
    @Body() message: { payload: any; headers?: Record<string, any> }
  ) {
    const startTime = Date.now()
    try {
      const messageId = await this.messagingService.produce(topic, {
        payload: message.payload,
        headers: message.headers || {},
      })

      this.healthService.recordMessageProduced(Date.now() - startTime)

      return {
        success: true,
        messageId,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      this.healthService.recordError()
      this.errorHandler.trackError(error as Error, 'produce', topic)

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      }
    }
  }

  @Post('simulate-load')
  async simulateLoad(
    @Body()
    config: {
      topic: string
      messageCount: number
      messageSize?: number
      concurrency?: number
    }
  ) {
    const results = []
    const { topic, messageCount, messageSize = 100, concurrency = 1 } = config

    const createMessage = () => ({
      payload: {
        data: 'x'.repeat(messageSize),
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9),
      },
      headers: {
        testRun: Date.now(),
        size: messageSize,
      },
    })

    const batches = Math.ceil(messageCount / concurrency)

    for (let batch = 0; batch < batches; batch++) {
      const batchPromises = []
      const batchSize = Math.min(
        concurrency,
        messageCount - batch * concurrency
      )

      for (let i = 0; i < batchSize; i++) {
        const promise = this.messagingService.produce(topic, createMessage())
        batchPromises.push(promise)
      }

      try {
        const batchResults = await Promise.allSettled(batchPromises)
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push({
              batch,
              index,
              success: true,
              messageId: result.value,
            })
          } else {
            results.push({
              batch,
              index,
              success: false,
              error: result.reason,
            })
          }
        })
      } catch (error) {
        console.error('Batch failed:', error)
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.length - successCount

    return {
      total: messageCount,
      success: successCount,
      failures: failureCount,
      successRate: (successCount / messageCount) * 100,
      results,
      timestamp: new Date().toISOString(),
    }
  }

  @Post('test-scenarios')
  async runTestScenarios(@Body() scenarios: string[]) {
    const availableScenarios = [
      'basic-produce-consume',
      'error-recovery',
      'circuit-breaker',
      'performance-benchmark',
      'load-testing',
    ]

    const selectedScenarios = scenarios.filter(s =>
      availableScenarios.includes(s)
    )
    const results = []

    for (const scenario of selectedScenarios) {
      results.push(await this.runScenario(scenario))
    }

    return { scenarios: results }
  }

  @Get('adapter-info')
  async getAdapterInfo() {
    try {
      return this.messagingService.getAdapterFeatures()
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error),
        connected: false,
      }
    }
  }

  @Get('configuration')
  async getConfiguration() {
    return {
      current: this.configManager.getConfiguration(),
      templates: {
        redis: this.configManager.getRedisConfigTemplate(),
        kafka: this.configManager.getKafkaConfigTemplate(),
        production: this.configManager.getProductionConfigTemplate(),
        development: this.configManager.getDevelopmentConfigTemplate(),
      },
    }
  }

  @Post('trigger-error')
  async triggerError(
    @Body()
    config: {
      type: 'connection' | 'serialization' | 'timeout' | 'unknown'
      operation?: string
      topic?: string
    }
  ) {
    const error = new Error(`Test error: ${config.type}`)

    if (config.type === 'connection') {
      error.message = 'Connection refused'
    } else if (config.type === 'serialization') {
      error.message = 'JSON serialization failed'
    } else if (config.type === 'timeout') {
      error.message = 'Operation timeout'
    }

    this.errorHandler.trackError(
      error,
      (config.operation as any) || 'produce',
      config.topic || 'test-topic'
    )

    return {
      error: error.message,
      tracked: true,
      timestamp: new Date().toISOString(),
    }
  }

  @Get('test-report')
  async generateTestReport() {
    const health = await this.healthService.performHealthCheck()
    const metrics = this.healthService.getHealthMetrics()
    const errors = this.errorHandler.getErrorStatistics()
    const errorReport = this.errorHandler.generateErrorReport()
    const adapterInfo = this.getAdapterInfo()

    return {
      summary: {
        status: health.status,
        uptime: metrics.uptime,
        totalMessages: metrics.totalMessages,
        errorRate: metrics.errorRate,
        adapterType: (await adapterInfo).type || 'unknown',
      },
      health,
      metrics,
      errors,
      errorReport,
      adapterInfo: await adapterInfo,
      recommendations: [
        ...health.recommendations,
        ...errorReport.recommendations,
      ],
      generatedAt: new Date().toISOString(),
    }
  }

  private async runScenario(scenario: string): Promise<any> {
    const startTime = Date.now()

    switch (scenario) {
      case 'basic-produce-consume':
        return await this.testBasicProduceConsume()
      case 'error-recovery':
        return await this.testErrorRecovery()
      case 'circuit-breaker':
        return await this.testCircuitBreaker()
      case 'performance-benchmark':
        return await this.testPerformanceBenchmark()
      case 'load-testing':
        return await this.testLoadTesting()
      default:
        return { error: 'Unknown scenario', scenario }
    }
  }

  private async testBasicProduceConsume() {
    const topic = `test-basic-${Date.now()}`
    const message = {
      payload: { test: 'basic-produce-consume', timestamp: Date.now() },
    }

    try {
      const messageId = await this.messagingService.produce(topic, message)
      return {
        scenario: 'basic-produce-consume',
        success: true,
        messageId,
        topic,
        duration: Date.now() - Date.now(),
      }
    } catch (error) {
      return {
        scenario: 'basic-produce-consume',
        success: false,
        error: error instanceof Error ? error.message : String(error),
        topic,
      }
    }
  }

  private async testErrorRecovery() {
    const topic = `test-recovery-${Date.now()}`

    // Trigger multiple errors to test recovery
    for (let i = 0; i < 3; i++) {
      try {
        await this.messagingService.produce(topic, {
          payload: { test: 'error-recovery', attempt: i + 1 },
        })
      } catch (error) {
        // Expected errors
      }
    }

    const recovered = await this.errorHandler.attemptRecovery(
      this.messagingService.getAdapter()
    )

    return {
      scenario: 'error-recovery',
      success: recovered,
      recovered,
      topic,
    }
  }

  private async testCircuitBreaker() {
    const topic = `test-circuit-${Date.now()}`

    // Trigger multiple failures to open circuit
    for (let i = 0; i < 6; i++) {
      this.errorHandler.trackError(
        new Error(`Circuit test error ${i + 1}`),
        'produce',
        topic
      )
    }

    const isCircuitOpen = this.errorHandler.isCircuitOpen(`produce:${topic}`)

    return {
      scenario: 'circuit-breaker',
      success: isCircuitOpen,
      circuitOpen: isCircuitOpen,
      topic,
    }
  }

  private async testPerformanceBenchmark() {
    const topic = `test-perf-${Date.now()}`
    const messageCount = 100
    const results = []

    for (let i = 0; i < messageCount; i++) {
      const start = Date.now()
      try {
        await this.messagingService.produce(topic, {
          payload: { test: 'performance', index: i },
        })
        results.push({ success: true, duration: Date.now() - start })
      } catch (error) {
        results.push({ success: false, duration: Date.now() - start })
      }
    }

    const successCount = results.filter(r => r.success).length
    const avgDuration =
      results.reduce((sum, r) => sum + r.duration, 0) / results.length

    return {
      scenario: 'performance-benchmark',
      success: successCount === messageCount,
      totalMessages: messageCount,
      successCount,
      averageDuration: avgDuration,
      throughput: (successCount / (Date.now() - Date.now())) * 1000,
      topic,
    }
  }

  private async testLoadTesting() {
    return await this.simulateLoad({
      topic: `test-load-${Date.now()}`,
      messageCount: 50,
      messageSize: 1000,
      concurrency: 5,
    })
  }
}
