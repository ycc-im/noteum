import { Test, TestingModule } from '@nestjs/testing'
import { Injectable } from '@nestjs/common'
import { MessagingModule } from '../messaging.module'
import { MessagingService } from '../messaging.service'
import { RedisStreamAdapter } from '../adapters/redis-stream-adapter'
import { KafkaAdapter } from '../adapters/kafka-adapter'
import { MessageSerializer } from '../utils/message-serializer'
import { MessageAdapter } from '../types'

describe('MessagingModule', () => {
  let module: TestingModule
  let messagingService: MessagingService

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  afterEach(async () => {
    if (module) {
      await module.close()
    }
  })

  describe('Module Configuration', () => {
    it('should be able to create the module with default configuration', async () => {
      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot({ adapter: 'redis' })],
      }).compile()

      expect(module).toBeDefined()
      messagingService = module.get<MessagingService>(MessagingService)
      expect(messagingService).toBeDefined()
    })

    it('should be able to create the module with Redis configuration', async () => {
      const redisConfig = {
        adapter: 'redis' as const,
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }

      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot(redisConfig)],
      }).compile()

      expect(module).toBeDefined()
      messagingService = module.get<MessagingService>(MessagingService)
      expect(messagingService).toBeDefined()
    })

    it('should be able to create the module with Kafka configuration', async () => {
      const kafkaConfig = {
        adapter: 'kafka' as const,
        kafka: {
          clientId: 'test-client',
          brokers: ['localhost:9092'],
        },
      }

      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot(kafkaConfig)],
      }).compile()

      expect(module).toBeDefined()
      messagingService = module.get<MessagingService>(MessagingService)
      expect(messagingService).toBeDefined()
    })

    it('should throw error with invalid adapter configuration', async () => {
      const invalidConfig = {
        adapter: 'invalid' as any,
      }

      await expect(
        Test.createTestingModule({
          imports: [MessagingModule.forRoot(invalidConfig)],
        }).compile()
      ).rejects.toThrow('Unsupported message adapter')
    })

    it('should provide all required services', async () => {
      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot({ adapter: 'redis' })],
      }).compile()

      // Check that all required providers are available
      expect(module.get(MessagingService)).toBeDefined()
      expect(module.get(MessageSerializer)).toBeDefined()
    })
  })

  describe('Module Initialization', () => {
    it('should initialize Redis adapter when configured', async () => {
      const redisConfig = {
        adapter: 'redis' as const,
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }

      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot(redisConfig)],
      }).compile()

      messagingService = module.get<MessagingService>(MessagingService)

      // The module should have created a Redis adapter
      const adapter = messagingService.getAdapter()
      expect(adapter).toBeInstanceOf(RedisStreamAdapter)
    })

    it('should initialize Kafka adapter when configured', async () => {
      const kafkaConfig = {
        adapter: 'kafka' as const,
        kafka: {
          clientId: 'test-client',
          brokers: ['localhost:9092'],
        },
      }

      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot(kafkaConfig)],
      }).compile()

      messagingService = module.get<MessagingService>(MessagingService)

      // The module should have created a Kafka adapter
      const adapter = messagingService.getAdapter()
      expect(adapter).toBeInstanceOf(KafkaAdapter)
    })

    it('should handle module lifecycle hooks correctly', async () => {
      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot({ adapter: 'redis' })],
      }).compile()

      messagingService = module.get<MessagingService>(MessagingService)

      // Simulate module initialization
      await module.init()

      // Simulate module shutdown
      await module.close()

      // Should not throw any errors
      expect(true).toBe(true)
    })
  })

  describe('Custom Providers', () => {
    it('should allow custom adapter provider', async () => {
      const customAdapter = {
        connect: jest.fn(),
        disconnect: jest.fn(),
        produce: jest.fn(),
        consume: jest.fn(),
        createTopic: jest.fn(),
        deleteTopic: jest.fn(),
        healthCheck: jest.fn(),
      }

      const customConfig = {
        adapter: 'custom' as const,
        custom: {
          provider: customAdapter,
        },
      }

      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot(customConfig)],
      }).compile()

      messagingService = module.get<MessagingService>(MessagingService)
      const adapter = messagingService.getAdapter()
      expect(adapter).toBe(customAdapter)
    })

    it('should allow custom configuration options', async () => {
      const configWithOptions = {
        adapter: 'redis' as const,
        redis: {
          host: 'localhost',
          port: 6379,
        },
        options: {
          enableHealthCheck: true,
          healthCheckInterval: 30000,
          reconnectAttempts: 5,
          reconnectDelay: 5000,
        },
      }

      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot(configWithOptions)],
      }).compile()

      expect(module).toBeDefined()
      messagingService = module.get<MessagingService>(MessagingService)
      expect(messagingService).toBeDefined()
    })
  })

  describe('Dynamic Module Registration', () => {
    it('should support multiple module configurations', async () => {
      const redisModule = MessagingModule.forRoot({
        adapter: 'redis',
        redis: { host: 'localhost', port: 6379 },
      })

      const kafkaModule = MessagingModule.forRoot({
        adapter: 'kafka',
        kafka: { clientId: 'test', brokers: ['localhost:9092'] },
      })

      expect(redisModule).toBeDefined()
      expect(kafkaModule).toBeDefined()
      expect(redisModule.module).toBe('MessagingModule')
      expect(kafkaModule.module).toBe('MessagingModule')
    })

    it('should preserve module metadata across configurations', async () => {
      const module1 = MessagingModule.forRoot({ adapter: 'redis' })
      const module2 = MessagingModule.forRoot({ adapter: 'kafka' })

      expect(module1.module).toBe(module2.module)
      expect(module1.providers).toBeDefined()
      expect(module2.providers).toBeDefined()
    })
  })

  describe('Service Integration', () => {
    it('should inject messaging service into other services', async () => {
      // Create a test service that uses MessagingService
      @Injectable()
      class TestService {
        constructor(public messagingService: MessagingService) {}

        async sendMessage(topic: string, message: any) {
          return this.messagingService.produce(topic, message)
        }

        async subscribeToMessages(topic: string, handler: any) {
          return this.messagingService.consume(topic, handler)
        }
      }

      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot({ adapter: 'redis' })],
        providers: [TestService],
      }).compile()

      const testService = module.get<TestService>(TestService)
      expect(testService).toBeDefined()
      expect(testService.messagingService).toBeDefined()
    })

    it('should handle service dependencies correctly', async () => {
      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot({ adapter: 'redis' })],
      }).compile()

      // Get all the services to check dependency injection
      const messagingService = module.get<MessagingService>(MessagingService)
      const messageSerializer = module.get<MessageSerializer>(MessageSerializer)

      expect(messagingService).toBeDefined()
      expect(messageSerializer).toBeDefined()
    })
  })

  describe('Module Configuration Validation', () => {
    it('should validate required configuration fields', async () => {
      const configs = [
        { adapter: 'redis' }, // Missing redis config
        { adapter: 'kafka' }, // Missing kafka config
      ]

      for (const config of configs) {
        await expect(
          Test.createTestingModule({
            imports: [MessagingModule.forRoot(config as any)],
          }).compile()
        ).rejects.toThrow()
      }
    })

    it('should validate configuration types', async () => {
      const invalidConfigs = [
        { adapter: 'redis', redis: 'invalid' }, // Invalid redis config type
        { adapter: 'kafka', kafka: 'invalid' }, // Invalid kafka config type
        { adapter: 123 }, // Invalid adapter type
      ]

      for (const config of invalidConfigs) {
        await expect(
          Test.createTestingModule({
            imports: [MessagingModule.forRoot(config as any)],
          }).compile()
        ).rejects.toThrow()
      }
    })
  })

  describe('Module Export', () => {
    it('should export messaging service for external use', async () => {
      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot({ adapter: 'redis' })],
      }).compile()

      // Check that the service can be imported by other modules
      const exports =
        MessagingModule.forRoot({ adapter: 'redis' }).exports || []

      // The module should export the MessagingService
      expect(module.get(MessagingService)).toBeDefined()
    })

    it('should allow other modules to use messaging functionality', async () => {
      @Injectable()
      class ExternalService {
        constructor(public messagingService: MessagingService) {}

        async testMessaging() {
          // Should be able to use messaging service
          return this.messagingService.healthCheck()
        }
      }

      module = await Test.createTestingModule({
        imports: [MessagingModule.forRoot({ adapter: 'redis' })],
        providers: [ExternalService],
      }).compile()

      const externalService = module.get<ExternalService>(ExternalService)
      expect(externalService).toBeDefined()
      expect(externalService.messagingService).toBeDefined()
    })
  })
})
