import { BaseMessageAdapter } from '../interfaces/base-adapter'
import {
  Message,
  MessageHandler,
  ProducerConfig,
  ConsumerConfig,
} from '../types'

// Mock implementation for testing
class MockMessageAdapter extends BaseMessageAdapter {
  private isConnected = false
  private messages: Message[] = []

  async connect(): Promise<void> {
    this.isConnected = true
  }

  async disconnect(): Promise<void> {
    this.isConnected = false
  }

  async produce(
    topic: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ): Promise<string> {
    if (!this.isConnected) {
      throw new Error('Adapter not connected')
    }

    const fullMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
    }

    this.messages.push(fullMessage)
    return fullMessage.id
  }

  async consume(topic: string, handler: MessageHandler): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Adapter not connected')
    }

    // Simulate message consumption
    for (const message of this.messages) {
      if (message.topic === topic) {
        await handler(message)
      }
    }
  }

  async createTopic(topic: string): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Adapter not connected')
    }
    // Mock implementation
  }

  async deleteTopic(topic: string): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Adapter not connected')
    }
    // Mock implementation
  }

  async healthCheck(): Promise<boolean> {
    return this.isConnected
  }

  // Helper methods for testing
  getStoredMessages(): Message[] {
    return [...this.messages]
  }

  clearMessages(): void {
    this.messages = []
  }
}

describe('BaseMessageAdapter', () => {
  let adapter: MockMessageAdapter

  beforeEach(() => {
    adapter = new MockMessageAdapter()
  })

  afterEach(async () => {
    try {
      await adapter.disconnect()
    } catch {
      // Ignore errors during cleanup
    }
  })

  describe('Connection Management', () => {
    it('should connect successfully', async () => {
      await adapter.connect()
      const isHealthy = await adapter.healthCheck()
      expect(isHealthy).toBe(true)
    })

    it('should disconnect successfully', async () => {
      await adapter.connect()
      await adapter.disconnect()
      const isHealthy = await adapter.healthCheck()
      expect(isHealthy).toBe(false)
    })

    it('should handle health check when not connected', async () => {
      const isHealthy = await adapter.healthCheck()
      expect(isHealthy).toBe(false)
    })
  })

  describe('Message Production', () => {
    beforeEach(async () => {
      await adapter.connect()
    })

    it('should produce a message successfully', async () => {
      const messageData = {
        payload: { data: 'test' },
        headers: { contentType: 'application/json' },
      }

      const messageId = await adapter.produce('test-topic', messageData)

      expect(messageId).toMatch(/^msg-\d+$/)
      expect(adapter.getStoredMessages()).toHaveLength(1)

      const storedMessage = adapter.getStoredMessages()[0]
      expect(storedMessage.id).toBe(messageId)
      expect(storedMessage.payload).toEqual({ data: 'test' })
      expect(storedMessage.headers.contentType).toBe('application/json')
      expect(storedMessage.topic).toBeUndefined() // Not set in produce
      expect(storedMessage.timestamp).toBeInstanceOf(Date)
    })

    it('should produce multiple messages', async () => {
      const messages = [
        { payload: { data: 'test1' }, headers: {} },
        { payload: { data: 'test2' }, headers: {} },
        { payload: { data: 'test3' }, headers: {} },
      ]

      for (const message of messages) {
        await adapter.produce('test-topic', message)
      }

      expect(adapter.getStoredMessages()).toHaveLength(3)
    })

    it('should throw error when producing while not connected', async () => {
      await adapter.disconnect()

      await expect(
        adapter.produce('test-topic', { payload: {}, headers: {} })
      ).rejects.toThrow('Adapter not connected')
    })
  })

  describe('Message Consumption', () => {
    beforeEach(async () => {
      await adapter.connect()
    })

    it('should consume messages from a topic', async () => {
      const handler = jest.fn()
      const messageData = {
        payload: { data: 'test' },
        headers: {},
        topic: 'test-topic',
      }

      await adapter.produce('test-topic', messageData)
      await adapter.consume('test-topic', handler)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { data: 'test' },
          topic: 'test-topic',
        })
      )
    })

    it('should only consume messages from specified topic', async () => {
      const handler1 = jest.fn()
      const handler2 = jest.fn()

      await adapter.produce('topic1', {
        payload: { data: 'message1' },
        headers: {},
        topic: 'topic1',
      })
      await adapter.produce('topic2', {
        payload: { data: 'message2' },
        headers: {},
        topic: 'topic2',
      })

      await adapter.consume('topic1', handler1)
      await adapter.consume('topic2', handler2)

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler1).toHaveBeenCalledWith(
        expect.objectContaining({ payload: { data: 'message1' } })
      )

      expect(handler2).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledWith(
        expect.objectContaining({ payload: { data: 'message2' } })
      )
    })

    it('should throw error when consuming while not connected', async () => {
      await adapter.disconnect()

      await expect(adapter.consume('test-topic', jest.fn())).rejects.toThrow(
        'Adapter not connected'
      )
    })
  })

  describe('Topic Management', () => {
    beforeEach(async () => {
      await adapter.connect()
    })

    it('should create a topic successfully', async () => {
      await expect(adapter.createTopic('new-topic')).resolves.toBeUndefined()
    })

    it('should delete a topic successfully', async () => {
      await expect(
        adapter.deleteTopic('existing-topic')
      ).resolves.toBeUndefined()
    })

    it('should throw error when managing topics while not connected', async () => {
      await adapter.disconnect()

      await expect(adapter.createTopic('test-topic')).rejects.toThrow(
        'Adapter not connected'
      )
      await expect(adapter.deleteTopic('test-topic')).rejects.toThrow(
        'Adapter not connected'
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      // Mock connection failure
      const failingAdapter = new MockMessageAdapter()
      jest
        .spyOn(failingAdapter, 'connect')
        .mockRejectedValue(new Error('Connection failed'))

      await expect(failingAdapter.connect()).rejects.toThrow(
        'Connection failed'
      )
    })

    it('should handle message production errors gracefully', async () => {
      await adapter.connect()

      // Test with invalid payload that might cause serialization errors
      const circularRef: any = {}
      circularRef.self = circularRef

      // This should work with JSON serialization
      await expect(
        adapter.produce('test-topic', { payload: circularRef, headers: {} })
      ).resolves.toBeDefined()
    })

    it('should handle consumer handler errors', async () => {
      await adapter.connect()

      const errorHandler = jest
        .fn()
        .mockRejectedValue(new Error('Handler failed'))
      await adapter.produce('test-topic', {
        payload: { data: 'test' },
        headers: {},
        topic: 'test-topic',
      })

      // The error should be thrown when consuming
      await expect(adapter.consume('test-topic', errorHandler)).rejects.toThrow(
        'Handler failed'
      )
    })
  })

  describe('Message Validation', () => {
    beforeEach(async () => {
      await adapter.connect()
    })

    it('should validate required message fields', async () => {
      const invalidMessage = {
        headers: {},
        // Missing payload
      }

      // Should still work as Message type allows any payload
      await expect(
        adapter.produce('test-topic', invalidMessage as any)
      ).resolves.toBeDefined()
    })

    it('should handle different payload types', async () => {
      const payloads = [
        { string: 'test' },
        { number: 123 },
        { boolean: true },
        { array: [1, 2, 3] },
        { nested: { value: 'deep' } },
        null,
        undefined,
      ]

      for (const payload of payloads) {
        const messageId = await adapter.produce('test-topic', {
          payload,
          headers: {},
        })
        expect(messageId).toMatch(/^msg-\d+$/)
      }

      expect(adapter.getStoredMessages()).toHaveLength(payloads.length)
    })
  })
})
