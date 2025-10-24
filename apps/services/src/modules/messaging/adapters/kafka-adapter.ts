import { Injectable } from '@nestjs/common'
import { Kafka, Producer, Consumer, Admin, SASLOptions } from 'kafkajs'
import { BaseMessageAdapter } from '../interfaces/base-adapter'
import { Message, MessageHandler, ConsumerConfig } from '../types'
import {
  MessageSerializer,
  SerializationFormat,
} from '../utils/message-serializer'

export interface KafkaConfig {
  clientId: string
  brokers: string[]
  ssl?: boolean
  sasl?: SASLOptions
  connectionTimeout?: number
  requestTimeout?: number
  enforceRequestTimeout?: boolean
  retry?: {
    initialRetryTime: number
    retries: number
  }
}

@Injectable()
export class KafkaAdapter extends BaseMessageAdapter {
  private kafka: Kafka | null = null
  private producer: Producer | null = null
  private consumer: Consumer | null = null
  private admin: Admin | null = null
  private serializer = new MessageSerializer()
  private config: KafkaConfig = {} as KafkaConfig
  private isConsuming = false

  async connect(): Promise<void> {
    // Default connection - should be overridden with actual config
    throw new Error('Kafka configuration is required for connection')
  }

  async connectWithConfig(config: KafkaConfig): Promise<void> {
    this.config = config
    try {
      if (!config || !config.clientId || !config.brokers) {
        throw new Error('Kafka configuration is required')
      }

      this.kafka = new Kafka(config)

      // Initialize producer, consumer, and admin
      this.producer = this.kafka.producer()
      this.consumer = this.kafka.consumer({ groupId: 'default-group' })
      this.admin = this.kafka.admin()

      // Set up event handlers
      this.setupEventHandlers()

      // Connect all clients
      await this.producer.connect()
      await this.consumer.connect()
      await this.admin.connect()

      this.connected = true
      this.logConnectionState('Connected')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.logger.error(`Failed to connect to Kafka: ${errorMessage}`)
      this.connected = false
      throw error
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.isConsuming && this.consumer) {
        await this.consumer.stop()
        this.isConsuming = false
      }

      if (this.producer) {
        await this.producer.disconnect()
      }

      if (this.consumer) {
        await this.consumer.disconnect()
      }

      if (this.admin) {
        await this.admin.disconnect()
      }

      this.producer = null
      this.consumer = null
      this.admin = null
      this.kafka = null
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.logger.error(`Error during disconnect: ${errorMessage}`)
    } finally {
      this.connected = false
      this.logConnectionState('Disconnected')
    }
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

      // Convert headers object to Buffer format expected by KafkaJS
      const kafkaHeaders: Record<string, Buffer> = {}
      Object.entries({
        ...message.headers,
        topic,
      }).forEach(([key, value]) => {
        kafkaHeaders[key] = Buffer.from(String(value))
      })

      const kafkaMessage = {
        topic,
        messages: [
          {
            key: message.key ? Buffer.from(message.key) : undefined,
            value: Buffer.from(serializedPayload),
            headers: kafkaHeaders,
            partition: message.partition,
            // timestamp: message.timestamp?.getTime().toString(), // Not available in Message type
          },
        ],
      }

      const result = await this.producer!.send(kafkaMessage)
      const messageOffset = result[0]?.offset || this.generateMessageId()
      this.logMessageOperation('Produced', topic, messageOffset)
      return messageOffset
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.logger.error(
        `Failed to produce message to topic ${topic}: ${errorMessage}`
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
      const consumerConfig: any = {
        groupId: config.groupId || this.config.clientId,
      }

      // Create a new consumer with the specified group configuration
      if (config.groupId || config.clientId) {
        this.consumer = this.kafka!.consumer(consumerConfig)
        await this.consumer.connect()
        this.setupEventHandlers()
      }

      await this.consumer!.subscribe({
        topic,
        fromBeginning: config.readFromBeginning || false,
      })

      this.isConsuming = true

      await this.consumer!.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            await this.processKafkaMessage(topic, partition, message, handler)
          } catch (error) {
            this.logger.error(
              `Error processing message from ${topic}:${partition}: ${error}`
            )
            throw error // Let Kafka handle the error (retry, etc.)
          }
        },
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      this.logger.error(
        `Failed to start consuming from topic ${topic}: ${errorMessage}`
      )
      throw error
    }
  }

  private async processKafkaMessage(
    topic: string,
    partition: number,
    kafkaMessage: any,
    handler: MessageHandler
  ): Promise<void> {
    try {
      // Parse Kafka message
      const payload = kafkaMessage.value
        ? JSON.parse(kafkaMessage.value.toString())
        : null

      const headers: Record<string, any> = {}
      if (kafkaMessage.headers) {
        Object.entries(kafkaMessage.headers).forEach(([key, value]) => {
          headers[key] = Buffer.isBuffer(value)
            ? value.toString()
            : String(value)
        })
      }

      const message: Message = {
        id: `${topic}-${partition}-${kafkaMessage.offset}`,
        payload,
        headers,
        timestamp: kafkaMessage.timestamp
          ? new Date(parseInt(kafkaMessage.timestamp))
          : new Date(),
        key: kafkaMessage.key?.toString(),
        topic,
        partition,
        offset: parseInt(kafkaMessage.offset),
      }

      await this.handleMessage(message, handler)
    } catch (error) {
      this.logger.error(
        `Failed to process Kafka message from ${topic}:${partition}: ${error}`
      )
      throw error
    }
  }

  async createTopic(topic: string): Promise<void> {
    this.validateConnection()
    this.logMessageOperation('Creating topic', topic)

    try {
      await this.admin!.createTopics({
        topics: [
          {
            topic,
            numPartitions: 1,
            replicationFactor: 1, // Note: This might need adjustment based on cluster configuration
          },
        ],
        validateOnly: false,
        timeout: 5000,
      })
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
      await this.admin!.deleteTopics({
        topics: [topic],
        timeout: 5000,
      })
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
      if (!this.connected || !this.admin) {
        return false
      }

      // Try to list topics to check connectivity
      await this.admin.listTopics()
      return true
    } catch (error) {
      this.logger.error(`Health check failed: ${error}`)
      return false
    }
  }

  /**
   * Get topic metadata
   */
  async getTopicMetadata(topic?: string | string[]): Promise<any> {
    this.validateConnection()
    return await this.admin!.fetchTopicMetadata({
      topics: topic ? (Array.isArray(topic) ? topic : [topic]) : [],
    })
  }

  /**
   * Get consumer group information
   */
  async getConsumerGroupInfo(groupId: string): Promise<any> {
    this.validateConnection()
    if (!this.consumer) {
      throw new Error('No consumer available')
    }
    return await this.consumer!.describeGroup()
  }

  /**
   * Commit offsets manually (useful for manual offset management)
   */
  async commitOffsets(topicPartitions: any[]): Promise<void> {
    this.validateConnection()
    if (!this.consumer) {
      throw new Error('No consumer available')
    }
    await this.consumer.commitOffsets(topicPartitions)
  }

  /**
   * Seek to specific offset
   */
  async seek(topic: string, partition: number, offset: string): Promise<void> {
    this.validateConnection()
    if (!this.consumer) {
      throw new Error('No consumer available')
    }
    await this.consumer.seek({ topic, partition, offset })
  }

  private setupEventHandlers(): void {
    if (this.producer) {
      this.producer.on('producer.connect', () => {
        this.logger.log('Kafka producer connected')
      })

      this.producer.on('producer.disconnect', () => {
        this.logger.warn('Kafka producer disconnected')
        this.connected = false
      })

      this.producer.on('producer.network.request_timeout', timeout => {
        this.logger.warn(`Kafka producer request timeout: ${timeout}`)
      })
    }

    if (this.consumer) {
      this.consumer.on('consumer.connect', () => {
        this.logger.log('Kafka consumer connected')
      })

      this.consumer.on('consumer.disconnect', () => {
        this.logger.warn('Kafka consumer disconnected')
        this.connected = false
      })

      this.consumer.on('consumer.network.request_timeout', timeout => {
        this.logger.warn(`Kafka consumer request timeout: ${timeout}`)
      })

      this.consumer.on('consumer.crash', error => {
        this.logger.error(`Kafka consumer crash: ${error}`)
        this.connected = false
      })
    }

    // Admin client in KafkaJS doesn't have the same event emitter interface
    // We'll log admin events separately if needed
    this.logger.log('Kafka admin initialized')
  }
}
