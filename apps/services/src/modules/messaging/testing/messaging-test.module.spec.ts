import { Test, TestingModule } from '@nestjs/testing'
import { MessagingTestModule } from './messaging-test.module'
import { MessagingTestController } from './messaging-test.controller'
import { MessagingService } from '../messaging.service'
import { MessagingHealthService } from '../health/messaging-health.service'

describe('MessagingTestModule', () => {
  let module: TestingModule

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
    module = await Test.createTestingModule({
      imports: [MessagingTestModule],
    })
      .overrideProvider(MessagingService)
      .useValue(mockMessagingService)
      .overrideProvider(MessagingHealthService)
      .useValue(mockHealthService)
      .compile()

    jest.clearAllMocks()
  })

  afterEach(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(module).toBeDefined()
  })

  it('should provide MessagingTestController', () => {
    const controller = module.get<MessagingTestController>(
      MessagingTestController
    )
    expect(controller).toBeDefined()
  })

  it('should provide MessagingService', () => {
    const service = module.get<MessagingService>(MessagingService)
    expect(service).toBeDefined()
  })

  it('should provide MessagingHealthService', () => {
    const healthService = module.get<MessagingHealthService>(
      MessagingHealthService
    )
    expect(healthService).toBeDefined()
  })

  it('should have correct module metadata', () => {
    const moduleMetadata = MessagingTestModule
    expect(moduleMetadata.decorators).toBeDefined()

    // Check that it's a NestJS module
    const isNgModule = moduleMetadata.decorators?.some(
      decorator => decorator.constructor.name === 'Module'
    )
    expect(isNgModule).toBe(true)
  })
})
