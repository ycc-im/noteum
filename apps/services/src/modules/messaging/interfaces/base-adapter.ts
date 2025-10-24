import { Injectable, Logger } from '@nestjs/common'
import {
  MessageAdapter,
  Message,
  MessageHandler,
  ProducerConfig,
  ConsumerConfig,
} from '../types'

@Injectable()
export abstract class BaseMessageAdapter implements MessageAdapter {
  protected readonly logger = new Logger(this.constructor.name)
  protected connected = false

  abstract connect(): Promise<void>
  abstract disconnect(): Promise<void>
  abstract produce(
    topic: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ): Promise<string>
  abstract consume(
    topic: string,
    handler: MessageHandler,
    config?: Partial<ConsumerConfig>
  ): Promise<void>
  abstract createTopic(topic: string): Promise<void>
  abstract deleteTopic(topic: string): Promise<void>

  async healthCheck(): Promise<boolean> {
    return this.connected
  }

  protected generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  protected createMessage(
    baseMessage: Omit<Message, 'id' | 'timestamp'>,
    overrides?: Partial<Message>
  ): Message {
    return {
      ...baseMessage,
      id: overrides?.id ?? this.generateMessageId(),
      timestamp: overrides?.timestamp ?? new Date(),
      headers: {
        contentType: 'application/json',
        ...baseMessage.headers,
        ...overrides?.headers,
      },
    }
  }

  protected async handleMessage(
    message: Message,
    handler: MessageHandler
  ): Promise<void> {
    try {
      await handler(message)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      const errorStack = error instanceof Error ? error.stack : undefined

      this.logger.error(
        `Error handling message ${message.id}: ${errorMessage}`,
        errorStack
      )
      throw error
    }
  }

  protected validateConnection(): void {
    if (!this.connected) {
      throw new Error(`${this.constructor.name} is not connected`)
    }
  }

  protected logConnectionState(operation: string): void {
    this.logger.debug(`${operation} - Connection state: ${this.connected}`)
  }

  protected logMessageOperation(
    operation: string,
    topic: string,
    messageId?: string
  ): void {
    this.logger.debug(
      `${operation} - Topic: ${topic}${messageId ? `, Message ID: ${messageId}` : ''}`
    )
  }

  protected validateProducerConfig(config: ProducerConfig): void {
    if (!config.adapter) {
      throw new Error('Producer adapter type is required')
    }
  }

  protected validateConsumerConfig(config: ConsumerConfig): void {
    if (!config.adapter) {
      throw new Error('Consumer adapter type is required')
    }
    if (!config.groupId) {
      throw new Error('Consumer group ID is required')
    }
  }
}
