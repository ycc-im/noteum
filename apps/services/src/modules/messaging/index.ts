// Main module and service
export {
  MessagingModule,
  MessageTopic,
  MessageHandler,
} from './messaging.module'
export { MessagingService, MessagingConfig } from './messaging.service'

// Types and interfaces
export * from './types'

// Adapters
export * from './adapters/redis-stream-adapter'
export * from './adapters/kafka-adapter'

// Base adapter
export * from './interfaces/base-adapter'

// Utilities
export * from './utils/message-serializer'

// Configuration
export * from './config/message-config-manager'

// Error handling
export * from './error/messaging-error-handler'

// Health monitoring
export * from './health/messaging-health.service'

// Testing
export * from './testing/messaging-test-controller'
