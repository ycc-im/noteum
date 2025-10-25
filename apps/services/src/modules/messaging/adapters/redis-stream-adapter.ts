import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { BaseMessageAdapter } from '../interfaces/base-adapter'
import { Message, MessageHandler, ConsumerConfig } from '../types'
import {
  MessageSerializer,
  SerializationFormat,
} from '../utils/message-serializer'

export interface RedisStreamConfig {
  host?: string
  port?: number
  password?: string
  db?: number
  url?: string
  connectTimeout?: number
  lazyConnect?: boolean
  maxRetriesPerRequest?: number
}

@Injectable()
export class RedisStreamAdapter extends BaseMessageAdapter {
  private redis: Redis | null = null
  private serializer = new MessageSerializer()
  private consumerTimers: Map<string, NodeJS.Timeout> = new Map()
  private config: RedisStreamConfig = {}

  async connect(): Promise<void> {
    // Default connection - should be overridden with actual config
    await this.connectWithConfig({})
  }

  async connectWithConfig(config: RedisStreamConfig): Promise<void> {
    this.config = config
    try {
      if (!config || Object.keys(config).length === 0) {
        throw new Error('Redis configuration is required')
      }

      this.redis = new Redis(config)

      this.redis.on('error', error => {
        this.logger.error(`Redis connection error: ${error.message}`)
        this.connected = false
      })

      this.redis.on('connect', () => {
        this.logger.log('Redis connected successfully')
        this.connected = true
      })

      if (!config.lazyConnect) {
        await this.redis.connect()
      }

      this.connected = true
      this.logConnectionState('Connected')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.logger.error(`Failed to connect to Redis: ${errorMessage}`)
      this.connected = false
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      // Clear all consumer timers
      for (const timer of this.consumerTimers.values()) {
        clearTimeout(timer)
      }
      this.consumerTimers.clear()

      await this.redis.disconnect()
      this.redis = null
    }
    this.connected = false
    this.logConnectionState('Disconnected')
  }

  async produce(
    topic: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ): Promise<string> {
    this.validateConnection()
    this.logMessageOperation('Producing', topic)

    try {
      const serializedPayload = JSON.stringify(message.payload)
      const serializedHeaders = JSON.stringify({
        ...message.headers,
        topic,
      })

      const fields: string[] = []
      fields.push('payload', serializedPayload)
      fields.push('headers', serializedHeaders)

      if (message.topic) {
        fields.push('topic', message.topic)
      }

      const messageId = await this.redis!.xadd(
        topic,
        message.key || '*',
        ...fields
      )
      this.logMessageOperation('Produced', topic, messageId || undefined)
      return messageId!
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.logger.error(
        `Failed to produce message to stream ${topic}: ${errorMessage}`
      )
      throw error
    }
  }

  async consume(
    topic: string,
    handler: MessageHandler,
    config: Partial<ConsumerConfig> = {}
  ): Promise<void> {
    this.validateConnection()
    this.logMessageOperation('Starting consumption', topic)

    try {
      if (config.groupId && config.clientId) {
        await this.consumeWithConsumerGroup(topic, handler, config)
      } else {
        await this.consumeWithoutGroup(topic, handler)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.logger.error(
        `Failed to start consuming from stream ${topic}: ${errorMessage}`
      )
      throw error
    }
  }

  private async consumeWithoutGroup(
    topic: string,
    handler: MessageHandler
  ): Promise<void> {
    const poll = async () => {
      try {
        if (!this.connected || !this.redis) {
          return
        }

        const results = await this.redis.xread(
          'BLOCK',
          0,
          'STREAMS',
          topic,
          '$'
        )

        if (results && results.length > 0) {
          for (const result of results) {
            const [streamName, messages] = result as [
              string,
              Array<[string, string[]]>,
            ]
            for (const message of messages) {
              const [messageId, fields] = message
              await this.processMessage(messageId, fields, handler)
            }
          }
        }
      } catch (error) {
        this.logger.error(`Error in consumer poll: ${error}`)
      }

      // Continue polling if still connected
      if (this.connected) {
        const timer = setTimeout(poll, 100)
        this.consumerTimers.set(`${topic}-simple`, timer)
      }
    }

    // Start polling
    poll()
  }

  private async consumeWithConsumerGroup(
    topic: string,
    handler: MessageHandler,
    config: Partial<ConsumerConfig>
  ): Promise<void> {
    const groupId = config.groupId!
    const clientId = config.clientId!

    // Try to create consumer group (might fail if already exists)
    try {
      await this.redis!.xgroup('CREATE', topic, groupId, '0', 'MKSTREAM')
    } catch (error: any) {
      if (!error.message.includes('BUSYGROUP')) {
        throw error
      }
      // Group already exists, which is fine
    }

    const poll = async () => {
      try {
        if (!this.connected || !this.redis) {
          return
        }

        const count = config.maxPollRecords || 1
        const block = config.sessionTimeout || 1000

        const results = await this.redis.xreadgroup(
          'GROUP',
          groupId,
          clientId,
          'COUNT',
          count,
          'BLOCK',
          block,
          'STREAMS',
          topic,
          '>'
        )

        if (results && results.length > 0) {
          for (const result of results) {
            const [streamName, messages] = result as [
              string,
              Array<[string, string[]]>,
            ]
            for (const message of messages) {
              const [messageId, fields] = message
              try {
                await this.processMessage(messageId, fields, handler)
                // Acknowledge message after successful processing
                await this.redis!.xack(streamName, groupId, messageId)
              } catch (error) {
                this.logger.error(
                  `Failed to process message ${messageId}: ${error}`
                )
                // Don't acknowledge failed messages - they will be retried
                throw error
              }
            }
          }
        }
      } catch (error) {
        this.logger.error(`Error in consumer group poll: ${error}`)
      }

      // Continue polling if still connected
      if (this.connected) {
        const timer = setTimeout(poll, 100)
        this.consumerTimers.set(`${topic}-${groupId}-${clientId}`, timer)
      }
    }

    // Start polling
    poll()
  }

  private async processMessage(
    messageId: string,
    fields: string[],
    handler: MessageHandler
  ): Promise<void> {
    try {
      // Parse Redis stream fields
      const fieldMap = new Map<string, string>()
      for (let i = 0; i < fields.length; i += 2) {
        fieldMap.set(fields[i], fields[i + 1])
      }

      // Reconstruct message
      const payloadData = fieldMap.get('payload')
      const headersData = fieldMap.get('headers')
      const timestampData = fieldMap.get('timestamp')
      const topicData = fieldMap.get('topic')

      if (!payloadData || !headersData) {
        throw new Error('Invalid message format: missing payload or headers')
      }

      const message: Message = {
        id: messageId,
        payload: JSON.parse(payloadData),
        headers: JSON.parse(headersData),
        timestamp: timestampData ? new Date(timestampData) : new Date(),
        topic: topicData,
      }

      await this.handleMessage(message, handler)
    } catch (error) {
      this.logger.error(`Failed to process message ${messageId}: ${error}`)
      throw error
    }
  }

  async createTopic(topic: string): Promise<void> {
    this.validateConnection()
    this.logMessageOperation('Creating topic', topic)

    // Redis streams are created implicitly on first XADD
    // We can add a dummy message to create the stream, then delete it
    try {
      const messageId = await this.redis!.xadd(topic, '*', 'init', 'true')
      if (messageId) {
        await this.redis!.xdel(topic, messageId)
      }
      this.logMessageOperation('Topic created', topic)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.logger.error(`Failed to create topic ${topic}: ${errorMessage}`)
      throw error
    }
  }

  async deleteTopic(topic: string): Promise<void> {
    this.validateConnection()
    this.logMessageOperation('Deleting topic', topic)

    try {
      await this.redis!.del(topic)
      this.logMessageOperation('Topic deleted', topic)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.logger.error(`Failed to delete topic ${topic}: ${errorMessage}`)
      throw error
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.connected || !this.redis) {
        return false
      }

      const result = await this.redis.ping()
      return result === 'PONG'
    } catch (error) {
      this.logger.error(`Health check failed: ${error}`)
      return false
    }
  }

  /**
   * Get stream information
   */
  async getStreamInfo(topic: string): Promise<any> {
    this.validateConnection()
    return await this.redis!.call('XINFO', 'STREAM', topic)
  }

  /**
   * Get consumer group information
   */
  async getConsumerGroups(topic: string): Promise<any> {
    this.validateConnection()
    return await this.redis!.call('XINFO', 'GROUPS', topic)
  }

  /**
   * Get pending messages for a consumer group
   */
  async getPendingMessages(topic: string, groupId: string): Promise<any> {
    this.validateConnection()
    return await this.redis!.xpending(topic, groupId)
  }
}
