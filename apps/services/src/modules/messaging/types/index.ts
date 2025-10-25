export interface MessageHeaders {
  contentType?: string
  messageId?: string
  correlationId?: string
  source?: string
  retryCount?: number
  [key: string]: any
}

export interface Message {
  id: string
  payload: any
  headers: MessageHeaders
  timestamp: Date
  key?: string
  topic?: string
  partition?: number
  offset?: number
}

export interface ProducerConfig {
  adapter: 'redis-stream' | 'kafka'
  clientId?: string
  maxRetries?: number
  retryDelay?: number
  timeout?: number
  enableIdempotence?: boolean
  batchSize?: number
  lingerMs?: number
}

export interface ConsumerConfig {
  adapter: 'redis-stream' | 'kafka'
  groupId: string
  clientId?: string
  sessionTimeout?: number
  heartbeatInterval?: number
  maxPollRecords?: number
  autoCommit?: boolean
  autoCommitInterval?: number
  enableAutoCommit?: boolean
  readFromBeginning?: boolean
}

export type MessageHandler = (message: Message) => Promise<void>

export interface MessageAdapter {
  connect(): Promise<void>
  disconnect(): Promise<void>
  produce(
    topic: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ): Promise<string>
  consume(
    topic: string,
    handler: MessageHandler,
    config?: Partial<ConsumerConfig>
  ): Promise<void>
  createTopic(topic: string): Promise<void>
  deleteTopic(topic: string): Promise<void>
  healthCheck(): Promise<boolean>
}

export interface MessagingService {
  produce(
    topic: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ): Promise<string>
  consume(topic: string, handler: MessageHandler): Promise<void>
  createTopic(topic: string): Promise<void>
  deleteTopic(topic: string): Promise<void>
  healthCheck(): Promise<boolean>
}

export type AdapterType = 'redis-stream' | 'kafka'

export interface MessageOptions {
  key?: string
  headers?: MessageHeaders
  partition?: number
}

export interface ConsumeOptions {
  fromBeginning?: boolean
  maxMessages?: number
  timeout?: number
}
