import { Test, TestingModule } from '@nestjs/testing'
import { KafkaAdapter } from '../adapters/kafka-adapter'
import { MessageSerializer } from '../utils/message-serializer'
import {
  Message,
  MessageHandler,
  ProducerConfig,
  ConsumerConfig,
} from '../types'

// Mock Kafka module
jest.mock('kafkajs', () => {
  const mockProducer = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    send: jest.fn(),
    sendBatch: jest.fn(),
    events: [],
    on: jest.fn(),
  }

  const mockConsumer = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribe: jest.fn(),
    run: jest.fn(),
    stop: jest.fn(),
    commitOffsets: jest.fn(),
    seek: jest.fn(),
    describeGroup: jest.fn(),
    events: [],
    on: jest.fn(),
  }

  const mockAdmin = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    createTopics: jest.fn(),
    deleteTopics: jest.fn(),
    listTopics: jest.fn(),
    describeTopics: jest.fn(),
    fetchTopicMetadata: jest.fn(),
  }

  const mockKafka = {
    producer: jest.fn(() => mockProducer),
    consumer: jest.fn(() => mockConsumer),
    admin: jest.fn(() => mockAdmin),
  }

  return {
    Kafka: jest.fn(() => mockKafka),
    ...mockKafka,
  }
})

// Get the mocked constructors
const MockedKafka = require('kafkajs').Kafka
const MockedProducer = require('kafkajs').producer
const MockedConsumer = require('kafkajs').consumer
const MockedAdmin = require('kafkajs').admin

describe('KafkaAdapter', () => {
  let adapter: KafkaAdapter
  let serializer: MessageSerializer
  let module: TestingModule
  let mockKafkaInstance: any
  let mockProducerInstance: any
  let mockConsumerInstance: any
  let mockAdminInstance: any

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks()

    // Get the mock instances
    MockedKafka.mockClear()
    mockKafkaInstance = MockedKafka.mock.instances[0]

    // Ensure we have mock instances
    if (!mockKafkaInstance) {
      mockProducerInstance = {
        connect: jest.fn(),
        disconnect: jest.fn(),
        send: jest.fn(),
        sendBatch: jest.fn(),
        events: [],
        on: jest.fn(),
      }

      mockConsumerInstance = {
        connect: jest.fn(),
        disconnect: jest.fn(),
        subscribe: jest.fn(),
        run: jest.fn(),
        stop: jest.fn(),
        commitOffsets: jest.fn(),
        seek: jest.fn(),
        describeGroup: jest.fn(),
        events: [],
        on: jest.fn(),
      }

      mockAdminInstance = {
        connect: jest.fn(),
        disconnect: jest.fn(),
        createTopics: jest.fn(),
        deleteTopics: jest.fn(),
        listTopics: jest.fn(),
        describeTopics: jest.fn(),
        fetchTopicMetadata: jest.fn(),
      }

      mockKafkaInstance = {
        producer: jest.fn(() => mockProducerInstance),
        consumer: jest.fn(() => mockConsumerInstance),
        admin: jest.fn(() => mockAdminInstance),
      }

      MockedKafka.mockImplementation(() => mockKafkaInstance)
      MockedProducer.mockImplementation(() => mockProducerInstance)
      MockedConsumer.mockImplementation(() => mockConsumerInstance)
      MockedAdmin.mockImplementation(() => mockAdminInstance)
    }

    // Get instances from the mock
    mockProducerInstance = mockKafkaInstance.producer()
    mockConsumerInstance = mockKafkaInstance.consumer()
    mockAdminInstance = mockKafkaInstance.admin()

    // Set default mock return values
    mockProducerInstance.connect.mockResolvedValue(undefined)
    mockProducerInstance.disconnect.mockResolvedValue(undefined)
    mockProducerInstance.send.mockResolvedValue([])
    mockProducerInstance.sendBatch.mockResolvedValue([])

    mockConsumerInstance.connect.mockResolvedValue(undefined)
    mockConsumerInstance.disconnect.mockResolvedValue(undefined)
    mockConsumerInstance.subscribe.mockResolvedValue(undefined)
    mockConsumerInstance.run.mockResolvedValue(undefined)
    mockConsumerInstance.stop.mockResolvedValue(undefined)

    mockAdminInstance.connect.mockResolvedValue(undefined)
    mockAdminInstance.disconnect.mockResolvedValue(undefined)
    mockAdminInstance.createTopics.mockResolvedValue(true)
    mockAdminInstance.deleteTopics.mockResolvedValue(true)
    mockAdminInstance.listTopics.mockResolvedValue(['test-topic'])

    module = await Test.createTestingModule({
      providers: [KafkaAdapter, MessageSerializer],
    }).compile()

    adapter = module.get<KafkaAdapter>(KafkaAdapter)
    serializer = module.get<MessageSerializer>(MessageSerializer)
  })

  afterEach(async () => {
    if (module) {
      await module.close()
    }
    jest.clearAllMocks()
  })

  describe('Connection Management', () => {
    it('should connect to Kafka successfully', async () => {
      const config = {
        clientId: 'test-client',
        brokers: ['localhost:9092'],
      }

      await adapter.connectWithConfig(config)

      expect(MockedKafka).toHaveBeenCalledWith(config)
      expect(mockProducerInstance.connect).toHaveBeenCalled()
      expect(mockConsumerInstance.connect).toHaveBeenCalled()
      expect(mockAdminInstance.connect).toHaveBeenCalled()
      expect(adapter['connected']).toBe(true)
    })

    it('should disconnect from Kafka successfully', async () => {
      const config = {
        clientId: 'test-client',
        brokers: ['localhost:9092'],
      }

      await adapter.connectWithConfig(config)
      await adapter.disconnect()

      expect(mockProducerInstance.disconnect).toHaveBeenCalled()
      expect(mockConsumerInstance.disconnect).toHaveBeenCalled()
      expect(mockAdminInstance.disconnect).toHaveBeenCalled()
      expect(adapter['connected']).toBe(false)
    })

    it('should handle connection errors', async () => {
      const config = {
        clientId: 'test-client',
        brokers: ['localhost:9092'],
      }

      mockProducerInstance.connect.mockRejectedValue(
        new Error('Connection failed')
      )

      await expect(adapter.connectWithConfig(config)).rejects.toThrow(
        'Connection failed'
      )
      expect(adapter['connected']).toBe(false)
    })

    it('should perform health check', async () => {
      const config = {
        clientId: 'test-client',
        brokers: ['localhost:9092'],
      }

      await adapter.connectWithConfig(config)
      const isHealthy = await adapter.healthCheck()

      expect(isHealthy).toBe(true)
    })

    it('should return false for health check when not connected', async () => {
      const isHealthy = await adapter.healthCheck()
      expect(isHealthy).toBe(false)
    })
  })

  describe('Message Production', () => {
    const config = { clientId: 'test-client', brokers: ['localhost:9092'] }

    beforeEach(async () => {
      await adapter.connectWithConfig(config)
    })

    it('should produce a message to Kafka topic', async () => {
      const message: Omit<Message, 'id' | 'timestamp'> = {
        payload: { data: 'test' },
        headers: { contentType: 'application/json' },
        topic: 'test-topic',
      }

      await adapter.produce('test-topic', message)

      expect(mockProducerInstance.send).toHaveBeenCalledWith({
        topic: 'test-topic',
        messages: [
          expect.objectContaining({
            value: Buffer.from(JSON.stringify(message.payload)),
            headers: expect.objectContaining({
              contentType: Buffer.from('application/json'),
              topic: Buffer.from('test-topic'),
            }),
          }),
        ],
      })
    })

    it('should handle message with custom key and partition', async () => {
      const message: Omit<Message, 'id' | 'timestamp'> = {
        payload: { data: 'test' },
        headers: {},
        topic: 'test-topic',
        key: 'custom-key',
        partition: 1,
      }

      await adapter.produce('test-topic', message)

      expect(mockProducerInstance.send).toHaveBeenCalledWith({
        topic: 'test-topic',
        messages: [
          expect.objectContaining({
            key: 'custom-key',
            partition: 1,
            value: JSON.stringify(message.payload),
          }),
        ],
      })
    })

    it('should throw error when producing while not connected', async () => {
      await adapter.disconnect()

      const message: Omit<Message, 'id' | 'timestamp'> = {
        payload: { data: 'test' },
        headers: {},
      }

      await expect(adapter.produce('test-topic', message)).rejects.toThrow(
        'KafkaAdapter is not connected'
      )
    })

    it('should handle Kafka producer send errors', async () => {
      mockProducerInstance.send.mockRejectedValue(new Error('Kafka error'))

      const message: Omit<Message, 'id' | 'timestamp'> = {
        payload: { data: 'test' },
        headers: {},
      }

      await expect(adapter.produce('test-topic', message)).rejects.toThrow(
        'Kafka error'
      )
    })
  })

  describe('Message Consumption', () => {
    const config = { clientId: 'test-client', brokers: ['localhost:9092'] }

    beforeEach(async () => {
      await adapter.connectWithConfig(config)
    })

    it('should consume messages from Kafka topic', async () => {
      const handler: MessageHandler = jest.fn()

      await adapter.consume('test-topic', handler)

      expect(mockConsumerInstance.subscribe).toHaveBeenCalledWith({
        topic: 'test-topic',
        fromBeginning: false,
      })

      expect(mockConsumerInstance.run).toHaveBeenCalledWith({
        eachMessage: expect.any(Function),
      })
    })

    it('should consume messages with consumer group configuration', async () => {
      const handler: MessageHandler = jest.fn()
      const consumerConfig: Partial<ConsumerConfig> = {
        groupId: 'test-group',
        clientId: 'test-consumer',
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
      }

      await adapter.consume('test-topic', handler, consumerConfig)

      expect(MockedConsumer).toHaveBeenCalledWith(
        expect.objectContaining({
          groupId: 'test-group',
        })
      )
    })

    it('should process received messages correctly', async () => {
      const handler: MessageHandler = jest.fn()

      await adapter.consume('test-topic', handler)

      // Get the eachMessage handler from the run call
      const runCall = mockConsumerInstance.run.mock.calls[0]
      const eachMessageHandler = runCall[0].eachMessage

      // Simulate a received Kafka message
      const kafkaMessage = {
        topic: 'test-topic',
        partition: 0,
        offset: '123',
        key: Buffer.from('test-key'),
        value: Buffer.from(JSON.stringify({ data: 'test' })),
        headers: {
          contentType: Buffer.from('application/json'),
          topic: Buffer.from('test-topic'),
        },
        timestamp: '2023-01-01T00:00:00.000Z',
      }

      await eachMessageHandler(kafkaMessage)

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { data: 'test' },
          headers: { contentType: 'application/json', topic: 'test-topic' },
          topic: 'test-topic',
          partition: 0,
          offset: 123,
        })
      )
    })

    it('should throw error when consuming while not connected', async () => {
      await adapter.disconnect()

      await expect(adapter.consume('test-topic', jest.fn())).rejects.toThrow(
        'KafkaAdapter is not connected'
      )
    })
  })

  describe('Topic Management', () => {
    const config = { clientId: 'test-client', brokers: ['localhost:9092'] }

    beforeEach(async () => {
      await adapter.connectWithConfig(config)
    })

    it('should create a topic', async () => {
      await adapter.createTopic('test-topic')

      expect(mockAdminInstance.createTopics).toHaveBeenCalledWith({
        topics: [
          {
            topic: 'test-topic',
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
        validateOnly: false,
        timeout: 5000,
      })
    })

    it('should delete a topic', async () => {
      await adapter.deleteTopic('test-topic')

      expect(mockAdminInstance.deleteTopics).toHaveBeenCalledWith({
        topics: [{ topic: 'test-topic' }],
        timeout: 5000,
      })
    })

    it('should handle topic management errors when not connected', async () => {
      await adapter.disconnect()

      await expect(adapter.createTopic('test-topic')).rejects.toThrow(
        'KafkaAdapter is not connected'
      )
      await expect(adapter.deleteTopic('test-topic')).rejects.toThrow(
        'KafkaAdapter is not connected'
      )
    })
  })

  describe('Configuration Validation', () => {
    it('should validate Kafka connection config', async () => {
      const invalidConfig = {} as any

      await expect(adapter.connectWithConfig(invalidConfig)).rejects.toThrow(
        'Kafka configuration is required'
      )
    })

    it('should accept valid Kafka configuration', async () => {
      const validConfigs = [
        { clientId: 'test-client', brokers: ['localhost:9092'] },
        { clientId: 'test-client', brokers: ['localhost:9092'], ssl: true },
        {
          clientId: 'test-client',
          brokers: ['localhost:9092', 'localhost:9093'],
        },
      ]

      for (const config of validConfigs) {
        await adapter.connectWithConfig(config)
        expect(adapter['connected']).toBe(true)
        await adapter.disconnect()
      }
    })
  })

  describe('Message Serialization', () => {
    const config = { clientId: 'test-client', brokers: ['localhost:9092'] }

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
        topic: 'test-topic',
      }

      await adapter.produce('test-topic', message)

      expect(mockProducerInstance.send).toHaveBeenCalledWith({
        topic: 'test-topic',
        messages: [
          expect.objectContaining({
            value: JSON.stringify(complexPayload),
            headers: expect.objectContaining({
              contentType: 'application/json',
              topic: 'test-topic',
            }),
          }),
        ],
      })
    })

    it('should handle serialization errors gracefully', async () => {
      // Create a circular reference
      const circular: any = { name: 'test' }
      circular.self = circular

      const message: Omit<Message, 'id' | 'timestamp'> = {
        payload: circular,
        headers: {},
      }

      await expect(adapter.produce('test-topic', message)).rejects.toThrow()
    })
  })

  describe('Additional Features', () => {
    const config = { clientId: 'test-client', brokers: ['localhost:9092'] }

    beforeEach(async () => {
      await adapter.connectWithConfig(config)
    })

    it('should get topic metadata', async () => {
      const mockMetadata = {
        topics: [
          {
            name: 'test-topic',
            partitions: [
              { partitionId: 0, leader: 1, replicas: [1], isr: [1] },
            ],
          },
        ],
      }

      mockAdminInstance.fetchTopicMetadata.mockResolvedValue(mockMetadata)

      const metadata = await adapter.getTopicMetadata('test-topic')

      expect(mockAdminInstance.fetchTopicMetadata).toHaveBeenCalledWith({
        topics: ['test-topic'],
      })
      expect(metadata).toBeDefined()
    })

    it('should get consumer group information', async () => {
      const mockGroupInfo = {
        groups: [
          {
            groupId: 'test-group',
            state: 'stable',
            members: [
              {
                memberId: 'member-1',
                clientHost: '/127.0.0.1',
                assignment: {
                  topicPartitions: [{ topic: 'test-topic', partition: 0 }],
                },
              },
            ],
          },
        ],
      }

      mockConsumerInstance.describeGroup.mockResolvedValue(mockGroupInfo)

      const groupInfo = await adapter.getConsumerGroupInfo('test-group')

      expect(mockConsumerInstance.describeGroup).toHaveBeenCalled()
      expect(groupInfo).toBeDefined()
    })
  })
})
