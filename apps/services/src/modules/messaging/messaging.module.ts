import { DynamicModule, Global, Module } from '@nestjs/common'
import { MessagingService, MessagingConfig } from './messaging.service'
import { MessageSerializer } from './utils/message-serializer'
import { RedisStreamAdapter } from './adapters/redis-stream-adapter'
import { KafkaAdapter } from './adapters/kafka-adapter'
import { MessagingErrorHandler } from './error/messaging-error-handler'
import { MessagingHealthService } from './health/messaging-health.service'
import { MessageConfigManager } from './config/message-config-manager'

export interface MessagingModuleOptions extends MessagingConfig {
  // Additional module-specific options can be added here
}

export interface MessagingModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<MessagingModuleOptions> | MessagingModuleOptions
  inject?: any[]
  imports?: any[]
}

@Global()
@Module({})
export class MessagingModule {
  /**
   * Configure the messaging module synchronously
   */
  static forRoot(options: MessagingModuleOptions): DynamicModule {
    const providers = this.createProviders(options)
    const exports = [MessagingService]

    return {
      module: MessagingModule,
      providers,
      exports: [
        MessagingService,
        MessagingErrorHandler,
        MessagingHealthService,
        MessageConfigManager,
      ],
    }
  }

  /**
   * Configure the messaging module asynchronously
   */
  static forRootAsync(options: MessagingModuleAsyncOptions): DynamicModule {
    const providers = [
      {
        provide: 'MESSAGING_OPTIONS',
        useFactory: options.useFactory,
        inject: options.inject || [],
        imports: options.imports || [],
      },
      {
        provide: MessagingService,
        useFactory: async (configOptions: MessagingModuleOptions) => {
          const service = new MessagingService()
          await service.configure(configOptions)
          return service
        },
        inject: ['MESSAGING_OPTIONS'],
      },
      MessageSerializer,
    ]

    const exports = [
      MessagingService,
      MessagingErrorHandler,
      MessagingHealthService,
      MessageConfigManager,
    ]

    return {
      module: MessagingModule,
      imports: options.imports || [],
      providers,
      exports,
    }
  }

  /**
   * Create providers based on the configuration
   */
  private static createProviders(options: MessagingModuleOptions) {
    const providers = [
      {
        provide: 'MESSAGING_OPTIONS',
        useValue: options,
      },
      {
        provide: MessagingService,
        useFactory: async (configOptions: MessagingModuleOptions) => {
          const service = new MessagingService()
          await service.configure(configOptions)
          return service
        },
        inject: ['MESSAGING_OPTIONS'],
      },
      MessageSerializer,
      MessagingErrorHandler,
      MessageConfigManager,
      MessagingHealthService,
    ]

    // Add adapter-specific providers if needed (these are optional for future use)
    // The adapters are created directly in the service for now

    return providers
  }
}

/**
 * Convenience decorators for message handling
 */
export const MessageTopic =
  (topic: string) =>
  (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    // Support both method and class decorator usage
    if (propertyKey && descriptor) {
      // Method decorator
      Reflect.defineMetadata('message:topic', topic, target, propertyKey)
    } else {
      // Class decorator - store on constructor
      Reflect.defineMetadata('message:topic', topic, target)
    }
  }

export const MessageHandler =
  () =>
  (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    // Support both method and class decorator usage
    if (propertyKey && descriptor) {
      // Method decorator
      Reflect.defineMetadata('message:handler', true, target, propertyKey)
    } else {
      // Class decorator - store on constructor
      Reflect.defineMetadata('message:handler', true, target)
    }
  }

/**
 * Constants for dependency injection tokens
 */
export const MESSAGING_OPTIONS = 'MESSAGING_OPTIONS'
export const REDIS_ADAPTER = 'REDIS_ADAPTER'
export const KAFKA_ADAPTER = 'KAFKA_ADAPTER'
export const CUSTOM_ADAPTER = 'CUSTOM_ADAPTER'
