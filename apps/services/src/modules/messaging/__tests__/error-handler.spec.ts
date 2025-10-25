import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { MessagingErrorHandler } from '../error/messaging-error-handler'
import { MessagingService } from '../messaging.service'
import { MessageAdapter } from '../types'

// Mock Logger
jest.mock('@nestjs/common', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
    debug: jest.fn(),
  })),
  Injectable: jest.fn(),
}))

describe('MessagingErrorHandler', () => {
  let errorHandler: MessagingErrorHandler
  let messagingService: MessagingService
  let module: TestingModule
  let mockAdapter: jest.Mocked<MessageAdapter>

  beforeEach(async () => {
    jest.clearAllMocks()

    mockAdapter = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      produce: jest.fn(),
      consume: jest.fn(),
      createTopic: jest.fn(),
      deleteTopic: jest.fn(),
      healthCheck: jest.fn(),
    }

    module = await Test.createTestingModule({
      providers: [MessagingErrorHandler, MessagingService],
    }).compile()

    errorHandler = module.get<MessagingErrorHandler>(MessagingErrorHandler)
    messagingService = module.get<MessagingService>(MessagingService)

    // Mock the messaging service adapter
    jest.spyOn(messagingService, 'getAdapter').mockReturnValue(mockAdapter)
  })

  afterEach(async () => {
    if (module) {
      await module.close()
    }
    jest.clearAllMocks()
  })

  describe('Error Classification', () => {
    it('should classify connection errors', () => {
      const error = new Error('Connection refused')
      const classification = errorHandler.classifyError(error)

      expect(classification.type).toBe('CONNECTION')
      expect(classification.severity).toBe('HIGH')
      expect(classification.recoverable).toBe(true)
      expect(classification.retryable).toBe(true)
    })

    it('should classify timeout errors', () => {
      const error = new Error('Operation timeout')
      const classification = errorHandler.classifyError(error)

      expect(classification.type).toBe('TIMEOUT')
      expect(classification.severity).toBe('MEDIUM')
      expect(classification.recoverable).toBe(true)
      expect(classification.retryable).toBe(true)
    })

    it('should classify serialization errors', () => {
      const error = new Error('JSON serialization failed')
      const classification = errorHandler.classifyError(error)

      expect(classification.type).toBe('SERIALIZATION')
      expect(classification.severity).toBe('MEDIUM')
      expect(classification.recoverable).toBe(false)
      expect(classification.retryable).toBe(false)
    })

    it('should classify validation errors', () => {
      const error = new Error('Invalid message format')
      const classification = errorHandler.classifyError(error)

      expect(classification.type).toBe('VALIDATION')
      expect(classification.severity).toBe('MEDIUM')
      expect(classification.recoverable).toBe(false)
      expect(classification.retryable).toBe(false)
    })

    it('should classify unknown errors', () => {
      const error = new Error('Unknown error')
      const classification = errorHandler.classifyError(error)

      expect(classification.type).toBe('UNKNOWN')
      expect(classification.severity).toBe('HIGH')
      expect(classification.recoverable).toBe(true)
      expect(classification.retryable).toBe(true)
    })

    it('should classify network errors', () => {
      const error = new Error('ECONNREFUSED')
      const classification = errorHandler.classifyError(error)

      expect(classification.type).toBe('NETWORK')
      expect(classification.severity).toBe('HIGH')
      expect(classification.recoverable).toBe(true)
      expect(classification.retryable).toBe(true)
    })

    it('should classify authentication errors', () => {
      const error = new Error('Authentication failed')
      const classification = errorHandler.classifyError(error)

      expect(classification.type).toBe('AUTHENTICATION')
      expect(classification.severity).toBe('HIGH')
      expect(classification.recoverable).toBe(false)
      expect(classification.retryable).toBe(false)
    })
  })

  describe('Error Handling Strategies', () => {
    it('should retry connection errors with exponential backoff', async () => {
      const error = new Error('Connection refused')
      mockAdapter.produce.mockRejectedValueOnce(error)

      const result = await errorHandler.handleError(error, {
        operation: 'produce',
        topic: 'test-topic',
        message: { data: 'test' },
        attempt: 1,
      })

      expect(result.action).toBe('RETRY')
      expect(result.delay).toBeGreaterThan(0)
      expect(result.maxRetries).toBeGreaterThan(0)
    })

    it('should not retry validation errors', async () => {
      const error = new Error('Invalid message format')
      mockAdapter.produce.mockRejectedValueOnce(error)

      const result = await errorHandler.handleError(error, {
        operation: 'produce',
        topic: 'test-topic',
        message: { data: 'test' },
        attempt: 1,
      })

      expect(result.action).toBe('FAIL')
      expect(result.retryable).toBe(false)
    })

    it('should retry up to maximum attempts', async () => {
      const error = new Error('Temporary failure')
      mockAdapter.produce.mockRejectedValue(error)

      const result = await errorHandler.handleError(error, {
        operation: 'produce',
        topic: 'test-topic',
        message: { data: 'test' },
        attempt: 5,
        maxRetries: 3,
      })

      expect(result.action).toBe('FAIL')
      expect(result.exceededMaxRetries).toBe(true)
    })

    it('should use circuit breaker for repeated failures', async () => {
      const error = new Error('Consistent failure')
      mockAdapter.produce.mockRejectedValue(error)

      // Simulate multiple failures
      await errorHandler.handleError(error, {
        operation: 'produce',
        attempt: 1,
        maxRetries: 3,
      })
      await errorHandler.handleError(error, {
        operation: 'produce',
        attempt: 2,
        maxRetries: 3,
      })
      await errorHandler.handleError(error, {
        operation: 'produce',
        attempt: 3,
        maxRetries: 3,
      })

      const result = await errorHandler.handleError(error, {
        operation: 'produce',
        topic: 'test-topic',
        attempt: 4,
        maxRetries: 3,
      })

      expect(result.action).toBe('CIRCUIT_BREAK')
      expect(result.circuitBreakerTimeout).toBeGreaterThan(0)
    })
  })

  describe('Error Recovery', () => {
    it('should recover from temporary connection issues', async () => {
      const error = new Error('Connection lost')
      mockAdapter.connect.mockRejectedValueOnce(error)
      mockAdapter.connect.mockResolvedValueOnce(undefined)

      const recovered = await errorHandler.attemptRecovery(mockAdapter)

      expect(recovered).toBe(true)
      expect(mockAdapter.connect).toHaveBeenCalledTimes(2)
    })

    it('should fail recovery for permanent issues', async () => {
      const error = new Error('Invalid configuration')
      mockAdapter.connect.mockRejectedValue(error)

      const recovered = await errorHandler.attemptRecovery(mockAdapter)

      expect(recovered).toBe(false)
      expect(mockAdapter.connect).toHaveBeenCalledTimes(1)
    })

    it('should attempt adapter reconnection', async () => {
      mockAdapter.disconnect.mockResolvedValue(undefined)
      mockAdapter.connect.mockResolvedValueOnce(undefined)

      const reconnected = await errorHandler.reconnectAdapter(mockAdapter)

      expect(reconnected).toBe(true)
      expect(mockAdapter.disconnect).toHaveBeenCalled()
      expect(mockAdapter.connect).toHaveBeenCalled()
    })
  })

  describe('Error Monitoring', () => {
    it('should track error statistics', () => {
      const error = new Error('Test error')

      errorHandler.trackError(error, 'produce', 'test-topic')
      errorHandler.trackError(error, 'produce', 'test-topic')
      errorHandler.trackError(error, 'consume', 'another-topic')

      const stats = errorHandler.getErrorStatistics()

      expect(stats.totalErrors).toBe(3)
      expect(stats.errorsByOperation.produce).toBe(2)
      expect(stats.errorsByOperation.consume).toBe(1)
      expect(stats.errorsByTopic['test-topic']).toBe(2)
      expect(stats.errorsByTopic['another-topic']).toBe(1)
    })

    it('should track error trends', () => {
      const error = new Error('Test error')

      // Add errors over time
      errorHandler.trackError(error, 'produce', 'test-topic')
      errorHandler.trackError(error, 'produce', 'test-topic')

      const trends = errorHandler.getErrorTrends('1h')

      expect(trends).toBeDefined()
      expect(Array.isArray(trends)).toBe(true)
    })

    it('should generate error reports', () => {
      const error = new Error('Test error')
      errorHandler.trackError(error, 'produce', 'test-topic')

      const report = errorHandler.generateErrorReport()

      expect(report).toBeDefined()
      expect(report.summary).toBeDefined()
      expect(report.statistics).toBeDefined()
      expect(report.recommendations).toBeDefined()
      expect(report.timestamp).toBeDefined()
    })

    it('should detect error patterns', () => {
      // Simulate repeated errors
      const error = new Error('Connection timeout')
      for (let i = 0; i < 5; i++) {
        errorHandler.trackError(error, 'produce', 'test-topic')
      }

      const patterns = errorHandler.detectErrorPatterns()

      expect(patterns).toContain('REPEATED_CONNECTION_ERRORS')
      expect(patterns).toContain('HIGH_ERROR_RATE')
    })
  })

  describe('Dead Letter Queue', () => {
    it('should handle failed messages', async () => {
      const message = { data: 'test', id: 'msg-123' }
      const error = new Error('Processing failed')

      const dlqResult = await errorHandler.handleFailedMessage(message, error, {
        topic: 'test-topic',
        originalError: error,
        retryCount: 3,
      })

      expect(dlqResult).toBeDefined()
      expect(dlqResult.deadLettered).toBe(true)
      expect(dlqResult.errorMessage).toBe(error.message)
      expect(dlqResult.retryCount).toBe(3)
    })

    it('should configure dead letter queue settings', () => {
      const settings = errorHandler.getDLQSettings()

      expect(settings).toBeDefined()
      expect(settings.enabled).toBeDefined()
      expect(settings.maxRetries).toBeGreaterThan(0)
      expect(settings.retryDelay).toBeGreaterThan(0)
      expect(settings.dlqTopic).toBeDefined()
    })

    it('should respect DLQ size limits', async () => {
      // Mock DLQ is full
      errorHandler.setDLQSize(100)
      errorHandler.setDLQUsed(100)

      const message = { data: 'test', id: 'msg-123' }
      const error = new Error('Processing failed')

      const dlqResult = await errorHandler.handleFailedMessage(message, error, {
        topic: 'test-topic',
        originalError: error,
        retryCount: 3,
      })

      expect(dlqResult.deadLettered).toBe(false)
      expect(dlqResult.reason).toBe('DLQ_FULL')
    })
  })

  describe('Graceful Degradation', () => {
    it('should provide fallback behavior for failed operations', async () => {
      const fallbackHandler = jest.fn()
      errorHandler.setFallbackHandler('produce', fallbackHandler)

      const error = new Error('Primary adapter failed')
      mockAdapter.produce.mockRejectedValue(error)

      const message = { payload: 'test', headers: {} }
      const result = await errorHandler.executeWithFallback(
        'produce',
        ['test-topic', message],
        () => mockAdapter.produce('test-topic', message)
      )

      expect(result).toBeDefined()
      expect(fallbackHandler).toHaveBeenCalledWith('test-topic', message)
    })

    it('should implement circuit breaker pattern', async () => {
      // Simulate many failures
      for (let i = 0; i < 10; i++) {
        const error = new Error('Service unavailable')
        errorHandler.trackError(error, 'produce', 'test-topic')
      }

      const isCircuitOpen = errorHandler.isCircuitOpen('produce')

      expect(isCircuitOpen).toBe(true)

      const message = { payload: 'test', headers: {} }
      const result = await errorHandler.executeWithCircuitBreaker(
        'produce',
        ['test-topic', message],
        () => mockAdapter.produce('test-topic', message)
      )

      expect(
        typeof result === 'object' && 'action' in result ? result.action : null
      ).toBe('CIRCUIT_BREAK')
    })

    it('should provide cached results during outages', async () => {
      const cacheKey = 'test-topic:test-message'
      const cachedResult = {
        data: 'cached-result',
        success: true,
        timestamp: Date.now(),
      }

      errorHandler.setCachedResult(cacheKey, cachedResult)

      mockAdapter.produce.mockRejectedValue(new Error('Service unavailable'))

      const message = { payload: 'test', headers: {} }
      const result = await errorHandler.executeWithCache(cacheKey, () =>
        mockAdapter.produce('test-topic', message)
      )

      expect(result).toEqual(cachedResult)
    })
  })

  describe('Health Impact Assessment', () => {
    it('should assess impact of errors on system health', () => {
      const errors = [
        { type: 'CONNECTION', timestamp: Date.now() },
        { type: 'TIMEOUT', timestamp: Date.now() + 1000 },
        { type: 'CONNECTION', timestamp: Date.now() + 2000 },
      ]

      for (const error of errors) {
        errorHandler.trackError(new Error(error.type), 'produce', 'test-topic')
      }

      const healthImpact = errorHandler.assessHealthImpact()

      expect(healthImpact).toBeDefined()
      expect(healthImpact.status).toBe('DEGRADED')
      expect(healthImpact.score).toBeLessThan(100)
      expect(healthImpact.affectedOperations).toContain('produce')
    })

    it('should recommend recovery actions', async () => {
      const error = new Error('High error rate detected')
      errorHandler.trackError(error, 'produce', 'test-topic')

      const recommendations = errorHandler.getRecoveryRecommendations()

      expect(recommendations).toBeDefined()
      expect(Array.isArray(recommendations)).toBe(true)
      expect(recommendations.length).toBeGreaterThan(0)
    })
  })

  describe('Error Logging and Alerts', () => {
    it('should log errors with appropriate context', () => {
      const error = new Error('Test error')
      const context = {
        operation: 'produce' as const,
        topic: 'test-topic',
        messageId: 'msg-123',
        attempt: 1,
      }

      errorHandler.logError(error, context)

      // Verify that Logger.error was called with proper context
      expect(Logger.error).toHaveBeenCalled()
    })

    it('should send alerts for critical errors', async () => {
      const alertHandler = jest.fn()
      errorHandler.setAlertHandler(alertHandler)

      const criticalError = new Error('Critical system failure')
      errorHandler.trackError(criticalError, 'produce', 'test-topic')

      await errorHandler.checkAndSendAlerts()

      expect(alertHandler).toHaveBeenCalled()
    })

    it('should aggregate similar errors to prevent alert fatigue', async () => {
      const alertHandler = jest.fn()
      errorHandler.setAlertHandler(alertHandler)

      // Generate multiple similar errors
      for (let i = 0; i < 10; i++) {
        errorHandler.trackError(
          new Error('Connection timeout'),
          'produce',
          'test-topic'
        )
      }

      // Should only send one alert for the batch
      await errorHandler.checkAndSendAlerts()

      expect(alertHandler).toHaveBeenCalledTimes(1)
    })
  })
})
