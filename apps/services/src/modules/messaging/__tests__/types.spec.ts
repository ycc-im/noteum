import {
  Message,
  MessageHeaders,
  ProducerConfig,
  ConsumerConfig,
  MessageAdapter,
} from '../types'

describe('Message Types', () => {
  describe('Message', () => {
    it('should create a valid message with required fields', () => {
      const message: Message = {
        id: 'test-message-id',
        payload: { data: 'test' },
        headers: {},
        timestamp: new Date(),
      }

      expect(message.id).toBe('test-message-id')
      expect(message.payload).toEqual({ data: 'test' })
      expect(message.headers).toEqual({})
      expect(message.timestamp).toBeInstanceOf(Date)
    })

    it('should create a message with all optional fields', () => {
      const headers: MessageHeaders = {
        contentType: 'application/json',
        messageId: 'msg-123',
        correlationId: 'corr-456',
        source: 'test-service',
        retryCount: 0,
      }

      const message: Message = {
        id: 'test-message-id',
        payload: { data: 'test' },
        headers,
        timestamp: new Date(),
        key: 'test-key',
        topic: 'test-topic',
        partition: 0,
        offset: 123,
      }

      expect(message.headers).toEqual(headers)
      expect(message.key).toBe('test-key')
      expect(message.topic).toBe('test-topic')
      expect(message.partition).toBe(0)
      expect(message.offset).toBe(123)
    })
  })

  describe('MessageHeaders', () => {
    it('should create headers with only required fields', () => {
      const headers: MessageHeaders = {}

      expect(headers).toEqual({})
    })

    it('should create headers with all fields', () => {
      const headers: MessageHeaders = {
        contentType: 'application/json',
        messageId: 'msg-123',
        correlationId: 'corr-456',
        source: 'test-service',
        retryCount: 3,
        customHeader: 'custom-value',
      }

      expect(headers.contentType).toBe('application/json')
      expect(headers.messageId).toBe('msg-123')
      expect(headers.correlationId).toBe('corr-456')
      expect(headers.source).toBe('test-service')
      expect(headers.retryCount).toBe(3)
      expect(headers.customHeader).toBe('custom-value')
    })
  })

  describe('ProducerConfig', () => {
    it('should create producer config with required fields', () => {
      const config: ProducerConfig = {
        adapter: 'redis-stream',
      }

      expect(config.adapter).toBe('redis-stream')
    })

    it('should create producer config with all optional fields', () => {
      const config: ProducerConfig = {
        adapter: 'kafka',
        clientId: 'test-client',
        maxRetries: 5,
        retryDelay: 1000,
        timeout: 5000,
        enableIdempotence: true,
        batchSize: 100,
        lingerMs: 10,
      }

      expect(config.clientId).toBe('test-client')
      expect(config.maxRetries).toBe(5)
      expect(config.retryDelay).toBe(1000)
      expect(config.timeout).toBe(5000)
      expect(config.enableIdempotence).toBe(true)
      expect(config.batchSize).toBe(100)
      expect(config.lingerMs).toBe(10)
    })
  })

  describe('ConsumerConfig', () => {
    it('should create consumer config with required fields', () => {
      const config: ConsumerConfig = {
        adapter: 'redis-stream',
        groupId: 'test-group',
      }

      expect(config.adapter).toBe('redis-stream')
      expect(config.groupId).toBe('test-group')
    })

    it('should create consumer config with all optional fields', () => {
      const config: ConsumerConfig = {
        adapter: 'kafka',
        groupId: 'test-group',
        clientId: 'test-client',
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        maxPollRecords: 100,
        autoCommit: true,
        autoCommitInterval: 5000,
        enableAutoCommit: true,
        readFromBeginning: false,
      }

      expect(config.clientId).toBe('test-client')
      expect(config.sessionTimeout).toBe(30000)
      expect(config.heartbeatInterval).toBe(3000)
      expect(config.maxPollRecords).toBe(100)
      expect(config.autoCommit).toBe(true)
      expect(config.autoCommitInterval).toBe(5000)
      expect(config.enableAutoCommit).toBe(true)
      expect(config.readFromBeginning).toBe(false)
    })
  })
})

describe('MessageAdapter Interface', () => {
  let mockAdapter: MessageAdapter

  beforeEach(() => {
    mockAdapter = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      produce: jest.fn(),
      consume: jest.fn(),
      createTopic: jest.fn(),
      deleteTopic: jest.fn(),
      healthCheck: jest.fn(),
    }
  })

  it('should have all required methods', () => {
    expect(typeof mockAdapter.connect).toBe('function')
    expect(typeof mockAdapter.disconnect).toBe('function')
    expect(typeof mockAdapter.produce).toBe('function')
    expect(typeof mockAdapter.consume).toBe('function')
    expect(typeof mockAdapter.createTopic).toBe('function')
    expect(typeof mockAdapter.deleteTopic).toBe('function')
    expect(typeof mockAdapter.healthCheck).toBe('function')
  })

  it('should be able to call all methods without errors', async () => {
    // Mock implementations
    mockAdapter.connect = jest.fn().mockResolvedValue(undefined)
    mockAdapter.disconnect = jest.fn().mockResolvedValue(undefined)
    mockAdapter.produce = jest.fn().mockResolvedValue('message-id')
    mockAdapter.consume = jest.fn().mockResolvedValue([])
    mockAdapter.createTopic = jest.fn().mockResolvedValue(undefined)
    mockAdapter.deleteTopic = jest.fn().mockResolvedValue(undefined)
    mockAdapter.healthCheck = jest.fn().mockResolvedValue(true)

    await expect(mockAdapter.connect()).resolves.toBeUndefined()
    await expect(mockAdapter.disconnect()).resolves.toBeUndefined()
    await expect(
      mockAdapter.produce('topic', { payload: { data: 'test' }, headers: {} })
    ).resolves.toBe('message-id')
    await expect(mockAdapter.consume('topic', jest.fn())).resolves.toEqual([])
    await expect(mockAdapter.createTopic('topic')).resolves.toBeUndefined()
    await expect(mockAdapter.deleteTopic('topic')).resolves.toBeUndefined()
    await expect(mockAdapter.healthCheck()).resolves.toBe(true)
  })
})
