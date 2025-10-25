import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MessageConfigManager } from '../config/message-config-manager'
import { MessageTopic, MessageHandler } from '../messaging.module'
import { MessagingService } from '../messaging.service'

describe('MessageConfigManager', () => {
  let configManager: MessageConfigManager
  let configService: ConfigService
  let module: TestingModule

  beforeEach(async () => {
    jest.clearAllMocks()

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [],
        }),
      ],
      providers: [MessageConfigManager],
    }).compile()

    configManager = module.get<MessageConfigManager>(MessageConfigManager)
    configService = module.get<ConfigService>(ConfigService)
  })

  afterEach(async () => {
    if (module) {
      await module.close()
    }
  })

  describe('Configuration Loading', () => {
    it('should load default configuration', () => {
      const config = configManager.getConfiguration()

      expect(config).toBeDefined()
      expect(config.adapter).toBe('redis')
      expect(config.options).toBeDefined()
      expect(config.options?.enableHealthCheck).toBe(true)
      expect(config.options?.healthCheckInterval).toBe(30000)
    })

    it('should load configuration from environment variables', () => {
      // Mock environment variables
      process.env.MESSAGING_ADAPTER = 'kafka'
      process.env.MESSAGING_KAFKA_CLIENT_ID = 'test-client'
      process.env.MESSAGING_KAFKA_BROKERS = 'localhost:9092,localhost:9093'

      const config = configManager.getConfiguration()

      expect(config.adapter).toBe('kafka')
      expect(config.kafka).toBeDefined()
      expect(config.kafka?.clientId).toBe('test-client')
      expect(config.kafka?.brokers).toEqual([
        'localhost:9092',
        'localhost:9093',
      ])

      // Clean up
      delete process.env.MESSAGING_ADAPTER
      delete process.env.MESSAGING_KAFKA_CLIENT_ID
      delete process.env.MESSAGING_KAFKA_BROKERS
    })

    it('should load Redis configuration from environment variables', () => {
      process.env.MESSAGING_REDIS_HOST = 'redis.example.com'
      process.env.MESSAGING_REDIS_PORT = '6380'
      process.env.MESSAGING_REDIS_PASSWORD = 'secret123'

      const config = configManager.getConfiguration()

      expect(config.adapter).toBe('redis')
      expect(config.redis).toBeDefined()
      expect(config.redis?.host).toBe('redis.example.com')
      expect(config.redis?.port).toBe(6380)
      expect(config.redis?.password).toBe('secret123')

      // Clean up
      delete process.env.MESSAGING_REDIS_HOST
      delete process.env.MESSAGING_REDIS_PORT
      delete process.env.MESSAGING_REDIS_PASSWORD
    })

    it('should merge configuration from multiple sources', () => {
      // Set environment variables
      process.env.MESSAGING_ADAPTER = 'kafka'
      process.env.MESSAGING_KAFKA_CLIENT_ID = 'env-client'

      // Override with configuration object
      const customConfig = {
        kafka: {
          clientId: 'override-client',
          brokers: ['broker1:9092'],
        },
      }

      const config = configManager.getConfiguration(customConfig)

      expect(config.adapter).toBe('kafka')
      expect(config.kafka?.clientId).toBe('override-client') // Should use override
      expect(config.kafka?.brokers).toEqual(['broker1:9092']) // Should use override

      // Clean up
      delete process.env.MESSAGING_ADAPTER
      delete process.env.MESSAGING_KAFKA_CLIENT_ID
    })
  })

  describe('Configuration Validation', () => {
    it('should validate Redis configuration', () => {
      const validConfig = {
        adapter: 'redis' as const,
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }

      expect(() =>
        configManager.validateConfiguration(validConfig)
      ).not.toThrow()
    })

    it('should validate Kafka configuration', () => {
      const validConfig = {
        adapter: 'kafka' as const,
        kafka: {
          clientId: 'test-client',
          brokers: ['localhost:9092'],
        },
      }

      expect(() =>
        configManager.validateConfiguration(validConfig)
      ).not.toThrow()
    })

    it('should throw error for invalid adapter', () => {
      const invalidConfig = {
        adapter: 'invalid' as any,
      }

      expect(() => configManager.validateConfiguration(invalidConfig)).toThrow(
        'Unsupported message adapter'
      )
    })

    it('should throw error for missing required fields', () => {
      const invalidKafkaConfig = {
        adapter: 'kafka' as const,
        kafka: {
          clientId: 'test-client',
          brokers: [], // Empty array
        },
      }

      expect(() =>
        configManager.validateConfiguration(invalidKafkaConfig)
      ).toThrow()
    })

    it('should validate custom adapter configuration', () => {
      const customAdapter = {
        connect: jest.fn(),
        disconnect: jest.fn(),
        produce: jest.fn(),
        consume: jest.fn(),
        createTopic: jest.fn(),
        deleteTopic: jest.fn(),
        healthCheck: jest.fn(),
      }

      const validConfig = {
        adapter: 'custom' as const,
        custom: {
          provider: customAdapter,
        },
      }

      expect(() =>
        configManager.validateConfiguration(validConfig)
      ).not.toThrow()
    })
  })

  describe('Configuration Transformation', () => {
    it('should transform broker list string to array', () => {
      process.env.MESSAGING_KAFKA_BROKERS =
        'broker1:9092,broker2:9092,broker3:9092'

      const config = configManager.getConfiguration()

      expect(config.kafka?.brokers).toEqual([
        'broker1:9092',
        'broker2:9092',
        'broker3:9092',
      ])

      delete process.env.MESSAGING_KAFKA_BROKERS
    })

    it('should transform port number string to number', () => {
      process.env.MESSAGING_REDIS_PORT = '6380'
      process.env.MESSAGING_KAFKA_REQUEST_TIMEOUT = '5000'

      const config = configManager.getConfiguration()

      expect(config.redis?.port).toBe(6380)
      expect(config.kafka?.requestTimeout).toBe(5000)

      delete process.env.MESSAGING_REDIS_PORT
      delete process.env.MESSAGING_KAFKA_REQUEST_TIMEOUT
    })

    it('should transform boolean strings to boolean values', () => {
      process.env.MESSAGING_KAFKA_SSL = 'true'
      process.env.MESSAGING_OPTIONS_ENABLE_HEALTH_CHECK = 'false'

      const config = configManager.getConfiguration()

      expect(config.kafka?.ssl).toBe(true)
      expect(config.options?.enableHealthCheck).toBe(false)

      delete process.env.MESSAGING_KAFKA_SSL
      delete process.env.MESSAGING_OPTIONS_ENABLE_HEALTH_CHECK
    })
  })

  describe('Message Handler Discovery', () => {
    it('should discover message handlers in classes', () => {
      @MessageHandler()
      class TestService {
        @MessageTopic('test-topic')
        async handleTestMessage(message: any) {
          // Handler implementation
        }

        @MessageTopic('another-topic')
        async handleAnotherMessage(message: any) {
          // Handler implementation
        }

        notAHandler() {
          // Not a message handler
        }
      }

      const handlers = configManager.discoverMessageHandlers(TestService)

      expect(handlers).toHaveLength(2)
      expect(handlers[0].topic).toBe('test-topic')
      expect(handlers[0].methodName).toBe('handleTestMessage')
      expect(handlers[1].topic).toBe('another-topic')
      expect(handlers[1].methodName).toBe('handleAnotherMessage')
    })

    it('should discover message handlers with metadata', () => {
      @MessageHandler()
      class TestService {
        @MessageTopic('test-topic')
        async handleMessage(message: any) {
          return 'processed'
        }
      }

      const handlers = configManager.discoverMessageHandlers(TestService)

      expect(handlers[0]).toMatchObject({
        topic: 'test-topic',
        methodName: 'handleMessage',
        className: 'TestService',
      })
    })

    it('should return empty array for classes without handlers', () => {
      class PlainService {
        someMethod() {
          // No message handlers
        }
      }

      const handlers = configManager.discoverMessageHandlers(PlainService)

      expect(handlers).toHaveLength(0)
    })
  })

  describe('Configuration Templates', () => {
    it('should provide Redis configuration template', () => {
      const template = configManager.getRedisConfigTemplate()

      expect(template.adapter).toBe('redis')
      expect(template.redis).toBeDefined()
      expect(template.redis?.host).toBeDefined()
      expect(template.redis?.port).toBeDefined()
      expect(template.options).toBeDefined()
    })

    it('should provide Kafka configuration template', () => {
      const template = configManager.getKafkaConfigTemplate()

      expect(template.adapter).toBe('kafka')
      expect(template.kafka).toBeDefined()
      expect(template.kafka?.clientId).toBeDefined()
      expect(template.kafka?.brokers).toBeDefined()
      expect(template.options).toBeDefined()
    })

    it('should provide production configuration template', () => {
      const template = configManager.getProductionConfigTemplate()

      expect(template.options?.enableHealthCheck).toBe(true)
      expect(template.options?.healthCheckInterval).toBeGreaterThan(0)
      expect(template.options?.reconnectAttempts).toBeGreaterThan(0)
    })

    it('should provide development configuration template', () => {
      const template = configManager.getDevelopmentConfigTemplate()

      expect(template.options?.enableHealthCheck).toBe(true)
      expect(template.options?.reconnectAttempts).toBeLessThan(5) // Less retries in dev
    })
  })

  describe('Configuration Migration', () => {
    it('should migrate from old configuration format', () => {
      const oldConfig = {
        type: 'redis',
        connection: {
          host: 'localhost',
          port: 6379,
        },
      }

      const migratedConfig = configManager.migrateConfiguration(oldConfig)

      expect(migratedConfig.adapter).toBe('redis')
      expect(migratedConfig.redis).toEqual(oldConfig.connection)
    })

    it('should handle configuration version upgrades', () => {
      const v1Config = {
        version: 1,
        adapter: 'kafka',
        kafka: {
          clientId: 'old-client',
        },
      }

      const upgradedConfig = configManager.upgradeConfiguration(v1Config)

      expect(upgradedConfig.version).toBeGreaterThanOrEqual(2)
      expect(upgradedConfig.adapter).toBe('kafka')
      expect(upgradedConfig.kafka).toBeDefined()
    })
  })

  describe('Configuration Hot Reload', () => {
    it('should detect configuration changes', () => {
      const initialConfig = configManager.getConfiguration()
      const watchSpy = jest.spyOn(configManager as any, 'watchConfiguration')

      configManager.enableConfigurationWatch()

      expect(watchSpy).toHaveBeenCalled()
    })

    it('should reload configuration on changes', async () => {
      const reloadSpy = jest.spyOn(configManager as any, 'reloadConfiguration')

      // Simulate configuration change
      process.env.MESSAGING_ADAPTER = 'kafka'

      await configManager.reloadConfiguration()

      expect(reloadSpy).toHaveBeenCalled()
      const newConfig = configManager.getConfiguration()
      expect(newConfig.adapter).toBe('kafka')

      delete process.env.MESSAGING_ADAPTER
    })
  })

  describe('Configuration Export/Import', () => {
    it('should export configuration to JSON', () => {
      const config = configManager.getConfiguration()
      const exported = configManager.exportConfiguration()

      expect(exported).toBeDefined()
      expect(typeof exported).toBe('string')

      const parsed = JSON.parse(exported)
      expect(parsed.adapter).toBe(config.adapter)
    })

    it('should import configuration from JSON', () => {
      const configJson = JSON.stringify({
        adapter: 'redis',
        redis: {
          host: 'imported-host',
          port: 6380,
        },
      })

      configManager.importConfiguration(configJson)
      const config = configManager.getConfiguration()

      expect(config.redis?.host).toBe('imported-host')
      expect(config.redis?.port).toBe(6380)
    })

    it('should validate imported configuration', () => {
      const invalidConfigJson = JSON.stringify({
        adapter: 'invalid',
      })

      expect(() =>
        configManager.importConfiguration(invalidConfigJson)
      ).toThrow()
    })
  })
})
