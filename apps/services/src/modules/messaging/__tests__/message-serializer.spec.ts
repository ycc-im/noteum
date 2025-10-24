import {
  MessageSerializer,
  SerializationFormat,
} from '../utils/message-serializer'
import { Message, MessageHeaders } from '../types'

describe('MessageSerializer', () => {
  let serializer: MessageSerializer

  beforeEach(() => {
    serializer = new MessageSerializer()
  })

  describe('JSON Serialization', () => {
    it('should serialize a basic message to JSON', () => {
      const message: Message = {
        id: 'test-123',
        payload: { data: 'test' },
        headers: { contentType: 'application/json' },
        timestamp: new Date('2023-01-01T00:00:00.000Z'),
      }

      const serialized = serializer.serialize(message, SerializationFormat.JSON)

      expect(typeof serialized).toBe('string')
      const parsed = JSON.parse(serialized)
      expect(parsed.id).toBe('test-123')
      expect(parsed.payload).toEqual({ data: 'test' })
      expect(parsed.headers.contentType).toBe('application/json')
      expect(parsed.timestamp).toBe('2023-01-01T00:00:00.000Z')
    })

    it('should deserialize a JSON message', () => {
      const serialized = JSON.stringify({
        id: 'test-123',
        payload: { data: 'test' },
        headers: { contentType: 'application/json' },
        timestamp: '2023-01-01T00:00:00.000Z',
      })

      const message = serializer.deserialize(
        serialized,
        SerializationFormat.JSON
      )

      expect(message.id).toBe('test-123')
      expect(message.payload).toEqual({ data: 'test' })
      expect(message.headers.contentType).toBe('application/json')
      expect(message.timestamp).toBeInstanceOf(Date)
      expect(message.timestamp.toISOString()).toBe('2023-01-01T00:00:00.000Z')
    })

    it('should handle complex nested objects', () => {
      const message: Message = {
        id: 'complex-123',
        payload: {
          user: { id: 1, name: 'John' },
          metadata: { tags: ['a', 'b', 'c'], scores: [1, 2, 3] },
          nested: {
            deep: { value: 'test' },
          },
        },
        headers: {
          contentType: 'application/json',
          version: '1.0',
        },
        timestamp: new Date(),
      }

      const serialized = serializer.serialize(message, SerializationFormat.JSON)
      const deserialized = serializer.deserialize(
        serialized,
        SerializationFormat.JSON
      )

      expect(deserialized).toEqual(message)
    })

    it('should handle arrays in payload', () => {
      const message: Message = {
        id: 'array-123',
        payload: [
          { id: 1, name: 'item1' },
          { id: 2, name: 'item2' },
          { id: 3, name: 'item3' },
        ],
        headers: {},
        timestamp: new Date(),
      }

      const serialized = serializer.serialize(message, SerializationFormat.JSON)
      const deserialized = serializer.deserialize(
        serialized,
        SerializationFormat.JSON
      )

      expect(deserialized.payload).toEqual(message.payload)
    })

    it('should handle null and undefined values', () => {
      const message: Message = {
        id: 'null-undefined-123',
        payload: {
          nullValue: null,
          undefinedValue: undefined,
          stringValue: 'test',
        },
        headers: {},
        timestamp: new Date(),
      }

      const serialized = serializer.serialize(message, SerializationFormat.JSON)
      const deserialized = serializer.deserialize(
        serialized,
        SerializationFormat.JSON
      )

      expect(deserialized.payload.nullValue).toBeNull()
      expect(deserialized.payload.undefinedValue).toBeUndefined()
      expect(deserialized.payload.stringValue).toBe('test')
    })
  })

  describe('Error Handling', () => {
    it('should throw error when serializing circular references', () => {
      const circular: any = { name: 'parent' }
      circular.self = circular

      const message: Message = {
        id: 'circular-123',
        payload: circular,
        headers: {},
        timestamp: new Date(),
      }

      expect(() => {
        serializer.serialize(message, SerializationFormat.JSON)
      }).toThrow('Failed to serialize message')
    })

    it('should throw error when deserializing invalid JSON', () => {
      const invalidJson = '{ invalid json }'

      expect(() => {
        serializer.deserialize(invalidJson, SerializationFormat.JSON)
      }).toThrow('Failed to deserialize message')
    })

    it('should throw error when deserializing with missing required fields', () => {
      const incompleteMessage = JSON.stringify({
        payload: { data: 'test' },
        // Missing id, headers, timestamp
      })

      expect(() => {
        serializer.deserialize(incompleteMessage, SerializationFormat.JSON)
      }).toThrow('Invalid message format')
    })

    it('should throw error with unsupported format', () => {
      const message: Message = {
        id: 'test-123',
        payload: { data: 'test' },
        headers: {},
        timestamp: new Date(),
      }

      expect(() => {
        serializer.serialize(message, 'unsupported' as SerializationFormat)
      }).toThrow('Unsupported serialization format')

      expect(() => {
        serializer.deserialize('test', 'unsupported' as SerializationFormat)
      }).toThrow('Unsupported serialization format')
    })
  })

  describe('Message Validation', () => {
    it('should validate message structure during deserialization', () => {
      const invalidMessages = [
        '{}', // Empty object
        '{"id": "test"}', // Missing fields
        '{"id": "test", "payload": {}}', // Missing headers, timestamp
        '{"id": "test", "payload": {}, "headers": {}}', // Missing timestamp
      ]

      for (const invalidMessage of invalidMessages) {
        expect(() => {
          serializer.deserialize(invalidMessage, SerializationFormat.JSON)
        }).toThrow()
      }
    })

    it('should validate timestamp format', () => {
      const messageWithInvalidTimestamp = JSON.stringify({
        id: 'test-123',
        payload: { data: 'test' },
        headers: {},
        timestamp: 'invalid-date',
      })

      expect(() => {
        serializer.deserialize(
          messageWithInvalidTimestamp,
          SerializationFormat.JSON
        )
      }).toThrow('Invalid timestamp format')
    })
  })

  describe('Performance and Size', () => {
    it('should handle large messages efficiently', () => {
      const largePayload = {
        data: new Array(1000).fill(0).map((_, i) => ({
          id: i,
          name: `item-${i}`,
          description: 'A'.repeat(100), // 100 char description
        })),
      }

      const message: Message = {
        id: 'large-123',
        payload: largePayload,
        headers: { contentType: 'application/json' },
        timestamp: new Date(),
      }

      const startTime = Date.now()
      const serialized = serializer.serialize(message, SerializationFormat.JSON)
      const serializationTime = Date.now() - startTime

      expect(serialized.length).toBeGreaterThan(0)
      expect(serializationTime).toBeLessThan(1000) // Should serialize within 1 second

      const deserializationStart = Date.now()
      const deserialized = serializer.deserialize(
        serialized,
        SerializationFormat.JSON
      )
      const deserializationTime = Date.now() - deserializationStart

      expect(deserialized.payload).toEqual(largePayload)
      expect(deserializationTime).toBeLessThan(1000) // Should deserialize within 1 second
    })

    it('should produce reasonable serialized sizes', () => {
      const message: Message = {
        id: 'size-test-123',
        payload: { data: 'test message' },
        headers: { contentType: 'application/json' },
        timestamp: new Date(),
      }

      const serialized = serializer.serialize(message, SerializationFormat.JSON)

      // Should be reasonably compact (less than 1KB for simple message)
      expect(serialized.length).toBeLessThan(1024)
    })
  })

  describe('Custom Headers and Metadata', () => {
    it('should preserve custom headers during round-trip', () => {
      const customHeaders: MessageHeaders = {
        contentType: 'application/json',
        messageId: 'msg-123',
        correlationId: 'corr-456',
        source: 'test-service',
        retryCount: 3,
        customField1: 'custom-value-1',
        customField2: 'custom-value-2',
      }

      const message: Message = {
        id: 'headers-123',
        payload: { data: 'test' },
        headers: customHeaders,
        timestamp: new Date(),
      }

      const serialized = serializer.serialize(message, SerializationFormat.JSON)
      const deserialized = serializer.deserialize(
        serialized,
        SerializationFormat.JSON
      )

      expect(deserialized.headers).toEqual(customHeaders)
    })

    it('should handle empty headers', () => {
      const message: Message = {
        id: 'empty-headers-123',
        payload: { data: 'test' },
        headers: {},
        timestamp: new Date(),
      }

      const serialized = serializer.serialize(message, SerializationFormat.JSON)
      const deserialized = serializer.deserialize(
        serialized,
        SerializationFormat.JSON
      )

      expect(deserialized.headers).toEqual({})
    })
  })

  describe('Date Handling', () => {
    it('should handle different date formats correctly', () => {
      const dates = [
        new Date('2023-01-01T00:00:00.000Z'),
        new Date('2023-12-31T23:59:59.999Z'),
        new Date(),
      ]

      for (const date of dates) {
        const message: Message = {
          id: `date-${date.getTime()}`,
          payload: { data: 'test' },
          headers: {},
          timestamp: date,
        }

        const serialized = serializer.serialize(
          message,
          SerializationFormat.JSON
        )
        const deserialized = serializer.deserialize(
          serialized,
          SerializationFormat.JSON
        )

        expect(deserialized.timestamp.getTime()).toBe(date.getTime())
      }
    })

    it('should handle dates with milliseconds precision', () => {
      const date = new Date('2023-01-01T12:34:56.789Z')
      const message: Message = {
        id: 'ms-precision-123',
        payload: { data: 'test' },
        headers: {},
        timestamp: date,
      }

      const serialized = serializer.serialize(message, SerializationFormat.JSON)
      const deserialized = serializer.deserialize(
        serialized,
        SerializationFormat.JSON
      )

      expect(deserialized.timestamp.getMilliseconds()).toBe(789)
    })
  })
})
