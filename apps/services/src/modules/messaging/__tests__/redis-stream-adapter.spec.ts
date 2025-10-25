import { Test, TestingModule } from '@nestjs/testing'
import { RedisStreamAdapter } from '../adapters/redis-stream-adapter'
import { MessageSerializer } from '../utils/message-serializer'
import {
  Message,
  MessageHandler,
  ProducerConfig,
  ConsumerConfig,
} from '../types'

// Mock Redis module first
jest.mock('ioredis', () => {
  const mockRedis = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    xadd: jest.fn(),
    xread: jest.fn(),
    xgroup: jest.fn(),
    xreadgroup: jest.fn(),
    xack: jest.fn(),
    del: jest.fn(),
    xdel: jest.fn(),
    xpending: jest.fn(),
    ping: jest.fn(),
    call: jest.fn(),
    defineCommand: jest.fn(),
    on: jest.fn(),
  }

  return {
    default: jest.fn(() => mockRedis),
    ...mockRedis,
  }
})

// Get the mocked constructor
const MockedRedis = require('ioredis').default

describe('RedisStreamAdapter', () => {
  let adapter: RedisStreamAdapter
  let serializer: MessageSerializer
  let module: TestingModule
  let mockRedisInstance: any

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks()

    // Get the mock Redis instance
    MockedRedis.mockClear()
    mockRedisInstance = MockedRedis.mock.instances[0]

    // Ensure we have a mock instance
    if (!mockRedisInstance) {
      mockRedisInstance = {
        connect: jest.fn(),
        disconnect: jest.fn(),
        xadd: jest.fn(),
        xread: jest.fn(),
        xgroup: jest.fn(),
        xreadgroup: jest.fn(),
        xack: jest.fn(),
        del: jest.fn(),
        xdel: jest.fn(),
        xpending: jest.fn(),
        ping: jest.fn(),
        call: jest.fn(),
        defineCommand: jest.fn(),
        on: jest.fn(),
      }
      MockedRedis.mockImplementation(() => mockRedisInstance)
    }

    // Set default mock return values
    mockRedisInstance.connect.mockResolvedValue(undefined)
    mockRedisInstance.disconnect.mockResolvedValue(undefined)
    mockRedisInstance.xadd.mockResolvedValue('message-id-123')
    mockRedisInstance.xread.mockResolvedValue([])
    mockRedisInstance.xgroup.mockResolvedValue('OK')
    mockRedisInstance.xreadgroup.mockResolvedValue([])
    mockRedisInstance.xack.mockResolvedValue(1)
    mockRedisInstance.del.mockResolvedValue(1)
    mockRedisInstance.xdel.mockResolvedValue(1)
    mockRedisInstance.xpending.mockResolvedValue([])
    mockRedisInstance.ping.mockResolvedValue('PONG')
    mockRedisInstance.call.mockResolvedValue({})

    module = await Test.createTestingModule({
      providers: [RedisStreamAdapter, MessageSerializer],
    }).compile()

    adapter = module.get<RedisStreamAdapter>(RedisStreamAdapter)
    serializer = module.get<MessageSerializer>(MessageSerializer)
  })

  afterEach(async () => {
    if (module) {
      await module.close()
    }
    jest.clearAllMocks()
  })

  describe('Connection Management', () => {
    it('should connect to Redis successfully', async () => {
      const config = {
        host: 'localhost',
        port: 6379,
      }

      await adapter.connectWithConfig(config)

      expect(mockRedisInstance.connect).toHaveBeenCalled()
      expect(adapter['connected']).toBe(true)
    })

    it('should disconnect from Redis successfully', async () => {
      const config = {
        host: 'localhost',
        port: 6379,
      }

      await adapter.connectWithConfig(config)
      await adapter.disconnect()

      expect(mockRedisInstance.disconnect).toHaveBeenCalled()
      expect(adapter['connected']).toBe(false)
    })

    it('should handle connection errors', async () => {
      const config = {
        host: 'invalid-host',
        port: 6379,
      }

      mockRedisInstance.connect.mockRejectedValue(
        new Error('Connection failed')
      )

      await expect(adapter.connectWithConfig(config)).rejects.toThrow(
        'Connection failed'
      )
      expect(adapter['connected']).toBe(false)
    })

    it('should perform health check', async () => {
      const config = {
        host: 'localhost',
        port: 6379,
      }

      await adapter.connectWithConfig(config)
      const isHealthy = await adapter.healthCheck()

      expect(mockRedisInstance.ping).toHaveBeenCalled()
      expect(isHealthy).toBe(true)
    })

    it('should return false for health check when not connected', async () => {
      const isHealthy = await adapter.healthCheck()
      expect(isHealthy).toBe(false)
    })
  })

  describe('Message Production', () => {
    const config = { host: 'localhost', port: 6379 }

    beforeEach(async () => {
      await adapter.connectWithConfig(config)
    })

    it('should produce a message to Redis stream', async () => {
      const message: Omit<Message, 'id' | 'timestamp'> = {
        payload: { data: 'test' },
        headers: { contentType: 'application/json' },
        topic: 'test-stream',
      }

      const messageId = await adapter.produce('test-stream', message)

      expect(mockRedisInstance.xadd).toHaveBeenCalledWith(
        'test-stream',
        '*',
        'payload',
        JSON.stringify(message.payload),
        'headers',
        JSON.stringify({ ...message.headers, topic: 'test-stream' }),
        'topic',
        'test-stream'
      )
      expect(messageId).toBe('message-id-123')
    })

    it('should handle message with custom key', async () => {
      const message: Omit<Message, 'id' | 'timestamp'> = {
        payload: { data: 'test' },
        headers: {},
        topic: 'test-stream',
        key: 'custom-key',
      }

      await adapter.produce('test-stream', message)

      expect(mockRedisInstance.xadd).toHaveBeenCalledWith(
        'test-stream',
        'custom-key',
        'payload',
        JSON.stringify(message.payload),
        'headers',
        JSON.stringify({ ...message.headers, topic: 'test-stream' }),
        'topic',
        'test-stream'
      )
    })

    it('should throw error when producing while not connected', async () => {
      await adapter.disconnect()

      const message: Omit<Message, 'id' | 'timestamp'> = {
        payload: { data: 'test' },
        headers: {},
      }

      await expect(adapter.produce('test-stream', message)).rejects.toThrow(
        'RedisStreamAdapter is not connected'
      )
    })

    it('should handle Redis XADD errors', async () => {
      mockRedisInstance.xadd.mockRejectedValue(new Error('Redis error'))

      const message: Omit<Message, 'id' | 'timestamp'> = {
        payload: { data: 'test' },
        headers: {},
      }

      await expect(adapter.produce('test-stream', message)).rejects.toThrow(
        'Redis error'
      )
    })
  })

  describe('Message Consumption', () => {
    const config = { host: 'localhost', port: 6379 }

    beforeEach(async () => {
      await adapter.connectWithConfig(config)
    })

    it('should consume messages from Redis stream', async () => {
      const handler: MessageHandler = jest.fn()

      // Mock Redis response
      mockRedisInstance.xread.mockResolvedValue([
        [
          'test-stream',
          [
            [
              'message-id-123',
              [
                'payload',
                '{"data":"test"}',
                'headers',
                '{"topic":"test-stream"}',
                'timestamp',
                '2023-01-01T00:00:00.000Z',
              ],
            ],
          ],
        ],
      ])

      await adapter.consume('test-stream', handler)

      expect(mockRedisInstance.xread).toHaveBeenCalledWith(
        'BLOCK',
        0,
        'STREAMS',
        'test-stream',
        '$'
      )
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'message-id-123',
          payload: { data: 'test' },
          headers: { topic: 'test-stream' },
          timestamp: expect.any(Date),
        })
      )
    })

    it('should consume messages with consumer group', async () => {
      const handler: MessageHandler = jest.fn()
      const consumerConfig: Partial<ConsumerConfig> = {
        groupId: 'test-group',
        clientId: 'test-consumer',
      }

      // Mock XGROUP creation (might fail if group exists)
      mockRedisInstance.xgroup.mockRejectedValue(
        new Error('BUSYGROUP Consumer Group name already exists')
      )

      mockRedisInstance.xreadgroup.mockResolvedValue([
        [
          'test-stream',
          [
            [
              'message-id-123',
              [
                'payload',
                '{"data":"test"}',
                'headers',
                '{"topic":"test-stream"}',
                'timestamp',
                '2023-01-01T00:00:00.000Z',
              ],
            ],
          ],
        ],
      ])

      await adapter.consume('test-stream', handler, consumerConfig)

      expect(mockRedisInstance.xreadgroup).toHaveBeenCalledWith(
        'GROUP',
        'test-group',
        'test-consumer',
        'COUNT',
        1,
        'BLOCK',
        1000,
        'STREAMS',
        'test-stream',
        '>'
      )
    })

    it('should acknowledge message after successful processing', async () => {
      const handler: MessageHandler = jest.fn().mockResolvedValue(undefined)
      const consumerConfig: Partial<ConsumerConfig> = {
        groupId: 'test-group',
        clientId: 'test-consumer',
      }

      mockRedisInstance.xgroup.mockResolvedValue('OK')
      mockRedisInstance.xreadgroup.mockResolvedValue([
        [
          'test-stream',
          [
            [
              'message-id-123',
              [
                'payload',
                '{"data":"test"}',
                'headers',
                '{"topic":"test-stream"}',
                'timestamp',
                '2023-01-01T00:00:00.000Z',
              ],
            ],
          ],
        ],
      ])

      await adapter.consume('test-stream', handler, consumerConfig)

      expect(mockRedisInstance.xack).toHaveBeenCalledWith(
        'test-stream',
        'test-group',
        'message-id-123'
      )
    })

    it('should not acknowledge message if handler fails', async () => {
      const handler: MessageHandler = jest
        .fn()
        .mockRejectedValue(new Error('Handler failed'))
      const consumerConfig: Partial<ConsumerConfig> = {
        groupId: 'test-group',
        clientId: 'test-consumer',
      }

      mockRedisInstance.xgroup.mockResolvedValue('OK')
      mockRedisInstance.xreadgroup.mockResolvedValue([
        [
          'test-stream',
          [
            [
              'message-id-123',
              [
                'payload',
                '{"data":"test"}',
                'headers',
                '{"topic":"test-stream"}',
                'timestamp',
                '2023-01-01T00:00:00.000Z',
              ],
            ],
          ],
        ],
      ])

      await expect(
        adapter.consume('test-stream', handler, consumerConfig)
      ).rejects.toThrow('Handler failed')
      expect(mockRedisInstance.xack).not.toHaveBeenCalled()
    })

    it('should handle empty stream response', async () => {
      const handler: MessageHandler = jest.fn()
      mockRedisInstance.xread.mockResolvedValue([])

      await adapter.consume('test-stream', handler)

      expect(handler).not.toHaveBeenCalled()
    })

    it('should throw error when consuming while not connected', async () => {
      await adapter.disconnect()

      await expect(adapter.consume('test-stream', jest.fn())).rejects.toThrow(
        'RedisStreamAdapter is not connected'
      )
    })
  })

  describe('Stream Management', () => {
    const config = { host: 'localhost', port: 6379 }

    beforeEach(async () => {
      await adapter.connectWithConfig(config)
    })

    it('should create a stream implicitly via XADD', async () => {
      await adapter.createTopic('test-stream')

      // Redis streams are created implicitly on first XADD
      expect(mockRedisInstance.xadd).toHaveBeenCalled()
    })

    it('should delete a stream', async () => {
      await adapter.deleteTopic('test-stream')

      expect(mockRedisInstance.del).toHaveBeenCalledWith('test-stream')
    })

    it('should handle topic management errors when not connected', async () => {
      await adapter.disconnect()

      await expect(adapter.createTopic('test-stream')).rejects.toThrow(
        'RedisStreamAdapter is not connected'
      )
      await expect(adapter.deleteTopic('test-stream')).rejects.toThrow(
        'RedisStreamAdapter is not connected'
      )
    })
  })

  describe('Configuration Validation', () => {
    it('should validate Redis connection config', async () => {
      const invalidConfig = {} as any

      await expect(adapter.connectWithConfig(invalidConfig)).rejects.toThrow(
        'Redis configuration is required'
      )
    })

    it('should accept valid Redis configuration', async () => {
      const validConfigs = [
        { host: 'localhost', port: 6379 },
        { host: 'localhost', port: 6379, password: 'secret' },
        { host: 'localhost', port: 6379, db: 1 },
        { url: 'redis://localhost:6379' },
      ]

      for (const config of validConfigs) {
        await adapter.connectWithConfig(config)
        expect(adapter['connected']).toBe(true)
        await adapter.disconnect()
      }
    })
  })

  describe('Message Serialization', () => {
    const config = { host: 'localhost', port: 6379 }

    beforeEach(async () => {
      await adapter.connectWithConfig(config)
    })

    it('should properly serialize complex payloads', async () => {
      const complexPayload = {
        user: { id: 1, name: 'John', roles: ['admin', 'user'] },
        metadata: { created: new Date(), tags: ['tag1', 'tag2'] },
      }

      const message: Omit<Message, 'id' | 'timestamp'> = {
        payload: complexPayload,
        headers: { contentType: 'application/json' },
        topic: 'test-stream',
      }

      await adapter.produce('test-stream', message)

      expect(mockRedisInstance.xadd).toHaveBeenCalledWith(
        'test-stream',
        '*',
        'payload',
        JSON.stringify(complexPayload),
        'headers',
        JSON.stringify({ ...message.headers, topic: 'test-stream' }),
        'topic',
        'test-stream'
      )
    })

    it('should handle serialization errors gracefully', async () => {
      // Create a circular reference
      const circular: any = { name: 'test' }
      circular.self = circular

      const message: Omit<Message, 'id' | 'timestamp'> = {
        payload: circular,
        headers: {},
      }

      await expect(adapter.produce('test-stream', message)).rejects.toThrow()
    })
  })

  describe('Additional Features', () => {
    const config = { host: 'localhost', port: 6379 }

    beforeEach(async () => {
      await adapter.connectWithConfig(config)
    })

    it('should get stream information', async () => {
      mockRedisInstance.call.mockResolvedValue({ length: 10, groups: 2 })

      const info = await adapter.getStreamInfo('test-stream')

      expect(mockRedisInstance.call).toHaveBeenCalledWith(
        'XINFO',
        'STREAM',
        'test-stream'
      )
      expect(info).toBeDefined()
    })

    it('should get consumer groups', async () => {
      mockRedisInstance.call.mockResolvedValue([
        { name: 'test-group', consumers: 1 },
      ])

      const groups = await adapter.getConsumerGroups('test-stream')

      expect(mockRedisInstance.call).toHaveBeenCalledWith(
        'XINFO',
        'GROUPS',
        'test-stream'
      )
      expect(groups).toBeDefined()
    })

    it('should get pending messages', async () => {
      mockRedisInstance.xpending.mockResolvedValue([
        { messageId: 'msg-1', consumer: 'consumer1' },
      ])

      const pending = await adapter.getPendingMessages(
        'test-stream',
        'test-group'
      )

      expect(mockRedisInstance.xpending).toHaveBeenCalledWith(
        'test-stream',
        'test-group'
      )
      expect(pending).toBeDefined()
    })
  })
})
