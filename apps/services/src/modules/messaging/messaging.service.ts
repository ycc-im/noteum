import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import {
  MessageAdapter,
  Message,
  MessageHandler,
  ConsumerConfig,
} from './types'
import {
  RedisStreamAdapter,
  RedisStreamConfig,
} from './adapters/redis-stream-adapter'
import { KafkaAdapter, KafkaConfig } from './adapters/kafka-adapter'
import { MessageSerializer } from './utils/message-serializer'

export interface MessagingConfig {
  adapter: 'redis' | 'kafka' | 'custom'
  redis?: RedisStreamConfig
  kafka?: KafkaConfig
  custom?: {
    provider: MessageAdapter
  }
  options?: {
    enableHealthCheck?: boolean
    healthCheckInterval?: number
    reconnectAttempts?: number
    reconnectDelay?: number
  }
}

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  private adapter: MessageAdapter | null = null
  private serializer = new MessageSerializer()
  private config: MessagingConfig
  private healthCheckInterval: NodeJS.Timeout | null = null

  constructor() {
    this.config = {
      adapter: 'redis',
      options: {
        enableHealthCheck: true,
        healthCheckInterval: 30000,
        reconnectAttempts: 5,
        reconnectDelay: 5000,
      },
    }
  }

  async onModuleInit() {
    // Connection will be handled by configure() method
  }

  async onModuleDestroy() {
    await this.disconnect()
  }

  /**
   * Configure the messaging service with the specified adapter
   */
  async configure(config: MessagingConfig): Promise<void> {
    this.config = { ...this.config, ...config }

    // Create the appropriate adapter (connect is handled inside)
    this.adapter = await this.createAdapter(config)

    // Start health check if enabled
    if (this.config.options?.enableHealthCheck) {
      this.startHealthCheck()
    }
  }

  /**
   * Get the current adapter instance
   */
  getAdapter(): MessageAdapter {
    if (!this.adapter) {
      throw new Error('Messaging service not configured')
    }
    return this.adapter
  }

  /**
   * Produce a message to the specified topic
   */
  async produce(
    topic: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ): Promise<string> {
    this.ensureConnected()
    return this.adapter!.produce(topic, message)
  }

  /**
   * Consume messages from the specified topic
   */
  async consume(
    topic: string,
    handler: MessageHandler,
    config?: Partial<ConsumerConfig>
  ): Promise<void> {
    this.ensureConnected()
    return this.adapter!.consume(topic, handler, config)
  }

  /**
   * Create a new topic
   */
  async createTopic(topic: string): Promise<void> {
    this.ensureConnected()
    return this.adapter!.createTopic(topic)
  }

  /**
   * Delete a topic
   */
  async deleteTopic(topic: string): Promise<void> {
    this.ensureConnected()
    return this.adapter!.deleteTopic(topic)
  }

  /**
   * Check the health of the messaging service
   */
  async healthCheck(): Promise<boolean> {
    if (!this.adapter) {
      return false
    }
    return this.adapter.healthCheck()
  }

  /**
   * Disconnect from the message broker
   */
  async disconnect(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
    }

    if (this.adapter) {
      await this.adapter.disconnect()
      this.adapter = null
    }
  }

  /**
   * Reconnect to the message broker
   */
  async reconnect(): Promise<void> {
    await this.disconnect()
    await this.configure(this.config)
  }

  /**
   * Get adapter-specific functionality
   */
  getAdapterFeatures(): any {
    this.ensureConnected()

    if (this.adapter instanceof RedisStreamAdapter) {
      return {
        type: 'redis',
        features: [
          'streams',
          'consumer-groups',
          'pending-messages',
          'stream-info',
        ],
        getStreamInfo: (topic: string) =>
          (this.adapter as any).getStreamInfo?.(topic),
        getConsumerGroups: (topic: string) =>
          (this.adapter as any).getConsumerGroups?.(topic),
        getPendingMessages: (topic: string, groupId: string) =>
          (this.adapter as any).getPendingMessages?.(topic, groupId),
      }
    }

    if (this.adapter instanceof KafkaAdapter) {
      return {
        type: 'kafka',
        features: [
          'partitions',
          'consumer-groups',
          'topic-metadata',
          'offset-management',
        ],
        getTopicMetadata: (topic?: string | string[]) =>
          (this.adapter as any).getTopicMetadata?.(topic),
        getConsumerGroupInfo: (groupId: string) =>
          (this.adapter as any).getConsumerGroupInfo?.(groupId),
        commitOffsets: (topicPartitions: any[]) =>
          (this.adapter as any).commitOffsets?.(topicPartitions),
        seek: (topic: string, partition: number, offset: string) =>
          (this.adapter as any).seek?.(topic, partition, offset),
      }
    }

    return {
      type: 'custom',
      features: [],
    }
  }

  private async createAdapter(
    config: MessagingConfig
  ): Promise<MessageAdapter> {
    switch (config.adapter) {
      case 'redis':
        const redisAdapter = new RedisStreamAdapter()
        // Connect with default config if not provided, or throw if no config
        if (config.redis) {
          await redisAdapter.connectWithConfig(config.redis)
        }
        return redisAdapter

      case 'kafka':
        const kafkaAdapter = new KafkaAdapter()
        // Connect with default config if not provided, or throw if no config
        if (config.kafka) {
          await kafkaAdapter.connectWithConfig(config.kafka)
        }
        return kafkaAdapter

      case 'custom':
        if (!config.custom?.provider) {
          throw new Error(
            'Custom adapter provider is required for custom adapter'
          )
        }
        return config.custom.provider

      default:
        throw new Error(`Unsupported message adapter: ${config.adapter}`)
    }
  }

  private ensureConnected(): void {
    if (!this.adapter) {
      throw new Error(
        'Messaging service not configured. Call configure() first.'
      )
    }
  }

  private startHealthCheck(): void {
    const interval = this.config.options?.healthCheckInterval || 30000

    this.healthCheckInterval = setInterval(async () => {
      try {
        const isHealthy = await this.healthCheck()
        if (!isHealthy) {
          console.warn(
            'Messaging service health check failed, attempting reconnection...'
          )
          await this.attemptReconnection()
        }
      } catch (error) {
        console.error('Health check error:', error)
      }
    }, interval)
  }

  private async attemptReconnection(): Promise<void> {
    const maxAttempts = this.config.options?.reconnectAttempts || 5
    const delay = this.config.options?.reconnectDelay || 5000

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Reconnection attempt ${attempt}/${maxAttempts}`)
        await this.reconnect()
        console.log('Reconnection successful')
        break
      } catch (error) {
        console.error(`Reconnection attempt ${attempt} failed:`, error)

        if (attempt < maxAttempts) {
          await this.sleep(delay)
        } else {
          console.error('All reconnection attempts failed')
        }
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
