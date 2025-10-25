import { Test, TestingModule } from '@nestjs/testing'
import { MessagingTestController } from './messaging-test.controller'
import { MessagingService } from '../messaging.service'
import { MessagingHealthService } from '../health/messaging-health.service'

describe('MessagingTestController', () => {
  let controller: MessagingTestController
  let messagingService: MessagingService
  let healthService: MessagingHealthService

  const mockMessagingService = {
    publish: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    getAdapters: jest.fn(),
    getAdapterStats: jest.fn(),
  }

  const mockHealthService = {
    getHealthReport: jest.fn(),
    checkAdapterHealth: jest.fn(),
    testConnection: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagingTestController],
      providers: [
        {
          provide: MessagingService,
          useValue: mockMessagingService,
        },
        {
          provide: MessagingHealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile()

    controller = module.get<MessagingTestController>(MessagingTestController)
    messagingService = module.get<MessagingService>(MessagingService)
    healthService = module.get<MessagingHealthService>(MessagingHealthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getHealthStatus', () => {
    it('should return health status', async () => {
      const mockHealthReport = {
        status: 'healthy',
        timestamp: new Date(),
        adapters: {},
        summary: { total: 0, healthy: 0, unhealthy: 0, degraded: 0 },
      }

      mockHealthService.getHealthReport.mockResolvedValue(mockHealthReport)

      const result = await controller.getHealthStatus()

      expect(result).toEqual(mockHealthReport)
      expect(healthService.getHealthReport).toHaveBeenCalled()
    })
  })

  describe('runQuickTest', () => {
    it('should run quick test', async () => {
      const mockResult = {
        success: true,
        testType: 'quick',
        results: [],
        summary: { total: 0, passed: 0, failed: 0 },
      }

      jest
        .spyOn(controller as any, 'runBasicConnectivityTest')
        .mockResolvedValue(mockResult)

      const result = await controller.runQuickTest()

      expect(result).toEqual(mockResult)
      expect(result.success).toBe(true)
      expect(result.testType).toBe('quick')
    })
  })

  describe('runLoadTest', () => {
    it('should run load test with valid parameters', async () => {
      const loadTestDto = {
        messageCount: 10,
        concurrency: 2,
        adapterType: 'redis-stream' as const,
      }

      const mockResult = {
        success: true,
        testType: 'load',
        parameters: loadTestDto,
        results: [],
        summary: { total: 10, passed: 10, failed: 0 },
      }

      jest
        .spyOn(controller as any, 'runLoadTestInternal')
        .mockResolvedValue(mockResult)

      const result = await controller.runLoadTest(loadTestDto)

      expect(result).toEqual(mockResult)
      expect(result.success).toBe(true)
      expect(result.testType).toBe('load')
    })

    it('should validate message count limits', async () => {
      const loadTestDto = {
        messageCount: 2000, // Exceeds maximum
        concurrency: 2,
        adapterType: 'redis-stream' as const,
      }

      await expect(controller.runLoadTest(loadTestDto)).rejects.toThrow()
    })
  })

  describe('runScenario', () => {
    it('should run basic publish scenario', async () => {
      const scenarioDto = {
        scenario: 'basic-publish',
        adapterType: 'redis-stream' as const,
        parameters: { messageCount: 5 },
      }

      const mockResult = {
        success: true,
        scenario: 'basic-publish',
        results: [],
        summary: { total: 5, passed: 5, failed: 0 },
      }

      jest
        .spyOn(controller as any, 'runBasicPublishScenario')
        .mockResolvedValue(mockResult)

      const result = await controller.runScenario(scenarioDto)

      expect(result).toEqual(mockResult)
      expect(result.success).toBe(true)
      expect(result.scenario).toBe('basic-publish')
    })
  })

  describe('getSystemMetrics', () => {
    it('should return system metrics', async () => {
      const mockMetrics = {
        timestamp: new Date(),
        adapters: {},
        system: {
          uptime: 100,
          memoryUsage: { used: 50, total: 100 },
          cpuUsage: 25,
        },
      }

      jest
        .spyOn(controller as any, 'collectSystemMetrics')
        .mockResolvedValue(mockMetrics)

      const result = await controller.getSystemMetrics()

      expect(result).toEqual(mockMetrics)
      expect(result.timestamp).toBeInstanceOf(Date)
    })
  })

  describe('getSupportedAdapters', () => {
    it('should return supported adapters', () => {
      mockMessagingService.getAdapters.mockReturnValue([
        {
          name: 'redis-stream',
          type: 'redis-stream',
          features: { publish: true, subscribe: true, consumerGroups: true },
        },
        {
          name: 'kafka',
          type: 'kafka',
          features: { publish: true, subscribe: true, consumerGroups: true },
        },
      ])

      const result = controller.getSupportedAdapters()

      expect(result).toHaveLength(2)
      expect(result[0].type).toBe('redis-stream')
      expect(result[0].features).toEqual({
        publish: true,
        subscribe: true,
        consumerGroups: true,
      })
    })
  })

  describe('getRecentResults', () => {
    it('should return recent test results', () => {
      const controllerInstance = controller as any
      controllerInstance.recentResults = [
        {
          id: '1',
          timestamp: new Date(),
          testType: 'quick',
          success: true,
        },
        {
          id: '2',
          timestamp: new Date(),
          testType: 'load',
          success: false,
        },
      ]

      const result = controller.getRecentResults()

      expect(result).toHaveLength(2)
      expect(result[0].testType).toBe('quick')
      expect(result[1].testType).toBe('load')
    })
  })

  describe('clearResults', () => {
    it('should clear recent results', () => {
      const controllerInstance = controller as any
      controllerInstance.recentResults = [{ id: '1' }]

      controllerInstance.clearResults()

      expect(controllerInstance.recentResults).toHaveLength(0)
    })
  })
})
