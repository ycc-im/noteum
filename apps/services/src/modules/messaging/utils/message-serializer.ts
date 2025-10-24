import { Injectable, Logger } from '@nestjs/common'
import { Message } from '../types'

export enum SerializationFormat {
  JSON = 'json',
}

@Injectable()
export class MessageSerializer {
  private readonly logger = new Logger(MessageSerializer.name)

  serialize(message: Message, format: SerializationFormat): string {
    try {
      switch (format) {
        case SerializationFormat.JSON:
          return this.serializeToJson(message)
        default:
          throw new Error(`Unsupported serialization format: ${format}`)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.logger.error(`Failed to serialize message: ${errorMessage}`)
      throw new Error(`Failed to serialize message: ${errorMessage}`)
    }
  }

  deserialize(data: string, format: SerializationFormat): Message {
    try {
      switch (format) {
        case SerializationFormat.JSON:
          return this.deserializeFromJson(data)
        default:
          throw new Error(`Unsupported serialization format: ${format}`)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.logger.error(`Failed to deserialize message: ${errorMessage}`)
      throw new Error(`Failed to deserialize message: ${errorMessage}`)
    }
  }

  private serializeToJson(message: Message): string {
    const serializableMessage = {
      id: message.id,
      payload: message.payload,
      headers: message.headers,
      timestamp: message.timestamp.toISOString(),
      key: message.key,
      topic: message.topic,
      partition: message.partition,
      offset: message.offset,
    }

    return JSON.stringify(serializableMessage)
  }

  private deserializeFromJson(data: string): Message {
    const parsed = JSON.parse(data)

    // Validate required fields
    if (!this.isValidMessageStructure(parsed)) {
      throw new Error('Invalid message format')
    }

    return {
      id: parsed.id,
      payload: parsed.payload,
      headers: parsed.headers || {},
      timestamp: this.parseTimestamp(parsed.timestamp),
      key: parsed.key,
      topic: parsed.topic,
      partition: parsed.partition,
      offset: parsed.offset,
    }
  }

  private isValidMessageStructure(obj: any): boolean {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.id === 'string' &&
      'payload' in obj &&
      typeof obj.headers === 'object' &&
      obj.headers !== null &&
      typeof obj.timestamp === 'string'
    )
  }

  private parseTimestamp(timestamp: string): Date {
    const date = new Date(timestamp)

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid timestamp format: ${timestamp}`)
    }

    return date
  }

  /**
   * Validate message size to prevent memory issues
   */
  validateMessageSize(
    message: Message,
    maxSizeInBytes: number = 1024 * 1024
  ): boolean {
    try {
      const serialized = this.serializeToJson(message)
      const size = Buffer.byteLength(serialized, 'utf8')
      return size <= maxSizeInBytes
    } catch {
      return false
    }
  }

  /**
   * Get estimated message size in bytes
   */
  getMessageSize(message: Message): number {
    try {
      const serialized = this.serializeToJson(message)
      return Buffer.byteLength(serialized, 'utf8')
    } catch {
      return -1
    }
  }

  /**
   * Check if message can be safely serialized (no circular references)
   */
  canSerialize(message: Message): boolean {
    try {
      JSON.stringify(message.payload)
      return true
    } catch {
      return false
    }
  }

  /**
   * Create a safe copy of message payload by removing circular references
   */
  sanitizePayload(payload: any): any {
    const seen = new WeakSet()

    const removeCircularRefs = (obj: any): any => {
      if (obj === null || typeof obj !== 'object') {
        return obj
      }

      if (seen.has(obj)) {
        return '[Circular]'
      }

      seen.add(obj)

      if (Array.isArray(obj)) {
        return obj.map(removeCircularRefs)
      }

      const result: any = {}
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = removeCircularRefs(obj[key])
        }
      }

      return result
    }

    return removeCircularRefs(payload)
  }
}
