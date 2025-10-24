import { Injectable, Logger } from '@nestjs/common'
import { MessagingConfig } from '../messaging.service'
import { RedisStreamConfig } from '../adapters/redis-stream-adapter'
import { KafkaConfig } from '../adapters/kafka-adapter'

export interface MessageHandlerInfo {
  topic: string
  methodName: string
  className: string
  handler: Function
}

export interface ConfigurationTemplate {
  version?: number
  adapter: 'redis' | 'kafka' | 'custom'
  redis?: Partial<RedisStreamConfig>
  kafka?: Partial<KafkaConfig>
  custom?: {
    provider: any
  }
  options?: {
    enableHealthCheck?: boolean
    healthCheckInterval?: number
    reconnectAttempts?: number
    reconnectDelay?: number
  }
}

@Injectable()
export class MessageConfigManager {
  private readonly logger = new Logger(MessageConfigManager.name)
  private config: ConfigurationTemplate
  private configurationWatchers: Map<string, Function> = new Map()

  constructor() {
    this.config = this.getDefaultConfiguration()
  }

  /**
   * Get the current configuration
   */
  getConfiguration(
    overrides?: Partial<ConfigurationTemplate>
  ): ConfigurationTemplate {
    if (overrides) {
      return { ...this.config, ...overrides }
    }
    return { ...this.config }
  }

  /**
   * Load configuration from environment variables and apply defaults
   */
  loadConfiguration(): ConfigurationTemplate {
    const envConfig = this.loadFromEnvironment()
    this.config = { ...this.config, ...envConfig }
    return this.config
  }

  /**
   * Validate configuration
   */
  validateConfiguration(config: ConfigurationTemplate): void {
    if (!config.adapter) {
      throw new Error('Adapter type is required')
    }

    const validAdapters = ['redis', 'kafka', 'custom']
    if (!validAdapters.includes(config.adapter)) {
      throw new Error(`Unsupported message adapter: ${config.adapter}`)
    }

    switch (config.adapter) {
      case 'redis':
        this.validateRedisConfig(config.redis)
        break
      case 'kafka':
        this.validateKafkaConfig(config.kafka)
        break
      case 'custom':
        this.validateCustomConfig(config.custom)
        break
    }
  }

  /**
   * Discover message handlers in a class
   */
  discoverMessageHandlers(target: any): MessageHandlerInfo[] {
    const handlers: MessageHandlerInfo[] = []
    const constructor = target.prototype ? target : target.constructor
    const className = constructor.name

    // Get all methods in the class prototype
    const methods = Object.getOwnPropertyNames(
      constructor.prototype || constructor
    )

    for (const methodName of methods) {
      // Skip constructor and non-function properties
      if (
        methodName === 'constructor' ||
        typeof (constructor.prototype || constructor)[methodName] !== 'function'
      ) {
        continue
      }

      // Check if the method has message handler metadata
      const isHandler = Reflect.getMetadata(
        'message:handler',
        constructor,
        methodName
      )
      const topic = Reflect.getMetadata(
        'message:topic',
        constructor,
        methodName
      )

      if (isHandler && topic) {
        handlers.push({
          topic,
          methodName,
          className,
          handler: (constructor.prototype || constructor)[methodName],
        })
      }
    }

    return handlers
  }

  /**
   * Get Redis configuration template
   */
  getRedisConfigTemplate(): ConfigurationTemplate {
    return {
      adapter: 'redis',
      redis: {
        host: 'localhost',
        port: 6379,
        connectTimeout: 10000,
        lazyConnect: false,
        maxRetriesPerRequest: 3,
      },
      options: {
        enableHealthCheck: true,
        healthCheckInterval: 30000,
        reconnectAttempts: 5,
        reconnectDelay: 5000,
      },
    }
  }

  /**
   * Get Kafka configuration template
   */
  getKafkaConfigTemplate(): ConfigurationTemplate {
    return {
      adapter: 'kafka',
      kafka: {
        clientId: 'messaging-service',
        brokers: ['localhost:9092'],
        requestTimeout: 30000,
        connectionTimeout: 10000,
        retry: {
          initialRetryTime: 100,
          retries: 8,
        },
      },
      options: {
        enableHealthCheck: true,
        healthCheckInterval: 30000,
        reconnectAttempts: 5,
        reconnectDelay: 5000,
      },
    }
  }

  /**
   * Get production configuration template
   */
  getProductionConfigTemplate(): ConfigurationTemplate {
    return {
      adapter: 'redis', // Default to Redis for production
      redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        connectTimeout: 30000,
        lazyConnect: false,
        maxRetriesPerRequest: 5,
      },
      options: {
        enableHealthCheck: true,
        healthCheckInterval: 15000, // More frequent health checks in production
        reconnectAttempts: 10,
        reconnectDelay: 3000,
      },
    }
  }

  /**
   * Get development configuration template
   */
  getDevelopmentConfigTemplate(): ConfigurationTemplate {
    return {
      adapter: 'redis', // Default to Redis for development
      redis: {
        host: 'localhost',
        port: 6379,
        connectTimeout: 5000,
        lazyConnect: false,
        maxRetriesPerRequest: 2,
      },
      options: {
        enableHealthCheck: true,
        healthCheckInterval: 60000, // Less frequent health checks in development
        reconnectAttempts: 3,
        reconnectDelay: 2000,
      },
    }
  }

  /**
   * Migrate configuration from old format
   */
  migrateConfiguration(oldConfig: any): ConfigurationTemplate {
    // Handle migration from version 1 format
    if (oldConfig.type && !oldConfig.adapter) {
      return {
        adapter: oldConfig.type as any,
        redis: oldConfig.connection || oldConfig.redis,
        kafka: oldConfig.kafka,
        options: oldConfig.options || this.getDefaultOptions(),
      }
    }

    return oldConfig as ConfigurationTemplate
  }

  /**
   * Upgrade configuration version
   */
  upgradeConfiguration(config: any): ConfigurationTemplate {
    const currentVersion = config.version || 1
    let upgradedConfig = { ...config }

    if (currentVersion < 2) {
      // Add version 2 features
      upgradedConfig.options = {
        ...this.getDefaultOptions(),
        ...upgradedConfig.options,
      }
      upgradedConfig.version = 2
    }

    return upgradedConfig as ConfigurationTemplate
  }

  /**
   * Enable configuration watching
   */
  enableConfigurationWatch(): void {
    this.logger.log('Configuration watching enabled')
    // In a real implementation, this would watch for file changes or environment changes
  }

  /**
   * Reload configuration
   */
  async reloadConfiguration(): Promise<void> {
    this.logger.log('Reloading configuration...')
    const newConfig = this.loadFromEnvironment()
    this.config = { ...this.config, ...newConfig }
    this.logger.log('Configuration reloaded successfully')
  }

  /**
   * Export configuration to JSON
   */
  exportConfiguration(): string {
    return JSON.stringify(this.config, null, 2)
  }

  /**
   * Import configuration from JSON
   */
  importConfiguration(configJson: string): void {
    try {
      const config = JSON.parse(configJson)
      this.validateConfiguration(config)
      this.config = config
      this.logger.log('Configuration imported successfully')
    } catch (error) {
      this.logger.error('Failed to import configuration:', error)
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      throw new Error(`Invalid configuration: ${errorMessage}`)
    }
  }

  private getDefaultConfiguration(): ConfigurationTemplate {
    return {
      adapter: 'redis',
      redis: {
        host: 'localhost',
        port: 6379,
        connectTimeout: 10000,
        lazyConnect: false,
        maxRetriesPerRequest: 3,
      },
      options: {
        enableHealthCheck: true,
        healthCheckInterval: 30000,
        reconnectAttempts: 5,
        reconnectDelay: 5000,
      },
    }
  }

  private getDefaultOptions() {
    return {
      enableHealthCheck: true,
      healthCheckInterval: 30000,
      reconnectAttempts: 5,
      reconnectDelay: 5000,
    }
  }

  private loadFromEnvironment(): Partial<ConfigurationTemplate> {
    const config: Partial<ConfigurationTemplate> = {}

    // Load adapter type
    if (process.env.MESSAGING_ADAPTER) {
      config.adapter = process.env.MESSAGING_ADAPTER as any
    }

    // Load Redis configuration
    if (process.env.MESSAGING_REDIS_HOST || process.env.REDIS_HOST) {
      config.redis = {
        ...config.redis,
        host: process.env.MESSAGING_REDIS_HOST || process.env.REDIS_HOST,
      }
    }

    if (process.env.MESSAGING_REDIS_PORT || process.env.REDIS_PORT) {
      const portStr = process.env.MESSAGING_REDIS_PORT || process.env.REDIS_PORT
      if (portStr) {
        config.redis = {
          ...config.redis,
          port: parseInt(portStr),
        }
      }
    }

    if (process.env.MESSAGING_REDIS_PASSWORD || process.env.REDIS_PASSWORD) {
      config.redis = {
        ...config.redis,
        password:
          process.env.MESSAGING_REDIS_PASSWORD || process.env.REDIS_PASSWORD,
      }
    }

    // Load Kafka configuration
    if (process.env.MESSAGING_KAFKA_CLIENT_ID) {
      config.kafka = {
        ...config.kafka,
        clientId: process.env.MESSAGING_KAFKA_CLIENT_ID,
      }
    }

    if (process.env.MESSAGING_KAFKA_BROKERS) {
      config.kafka = {
        ...config.kafka,
        brokers: process.env.MESSAGING_KAFKA_BROKERS.split(',').map(b =>
          b.trim()
        ),
      }
    }

    if (process.env.MESSAGING_KAFKA_SSL) {
      config.kafka = {
        ...config.kafka,
        ssl: process.env.MESSAGING_KAFKA_SSL === 'true',
      }
    }

    if (process.env.MESSAGING_KAFKA_REQUEST_TIMEOUT) {
      config.kafka = {
        ...config.kafka,
        requestTimeout: parseInt(process.env.MESSAGING_KAFKA_REQUEST_TIMEOUT),
      }
    }

    // Load options
    if (process.env.MESSAGING_OPTIONS_ENABLE_HEALTH_CHECK) {
      config.options = {
        ...config.options,
        enableHealthCheck:
          process.env.MESSAGING_OPTIONS_ENABLE_HEALTH_CHECK === 'true',
      }
    }

    if (process.env.MESSAGING_OPTIONS_HEALTH_CHECK_INTERVAL) {
      config.options = {
        ...config.options,
        healthCheckInterval: parseInt(
          process.env.MESSAGING_OPTIONS_HEALTH_CHECK_INTERVAL
        ),
      }
    }

    if (process.env.MESSAGING_OPTIONS_RECONNECT_ATTEMPTS) {
      config.options = {
        ...config.options,
        reconnectAttempts: parseInt(
          process.env.MESSAGING_OPTIONS_RECONNECT_ATTEMPTS
        ),
      }
    }

    return config
  }

  private validateRedisConfig(redis?: RedisStreamConfig): void {
    if (!redis) {
      throw new Error('Redis configuration is required for Redis adapter')
    }

    if (typeof redis.host !== 'string' || !redis.host.trim()) {
      throw new Error('Redis host is required')
    }

    if (!redis.port || redis.port < 1 || redis.port > 65535) {
      throw new Error('Valid Redis port is required')
    }
  }

  private validateKafkaConfig(kafka?: Partial<KafkaConfig>): void {
    if (!kafka) {
      throw new Error('Kafka configuration is required for Kafka adapter')
    }

    if (
      kafka.clientId &&
      (typeof kafka.clientId !== 'string' || !kafka.clientId.trim())
    ) {
      throw new Error('Invalid Kafka client ID format')
    }

    if (
      kafka.brokers &&
      (!Array.isArray(kafka.brokers) || kafka.brokers.length === 0)
    ) {
      throw new Error('Kafka brokers list must be a non-empty array')
    }

    // Validate broker format
    if (kafka.brokers) {
      for (const broker of kafka.brokers) {
        if (typeof broker !== 'string' || !broker.trim()) {
          throw new Error('Invalid broker format')
        }
      }
    }
  }

  private validateCustomConfig(custom?: { provider: any }): void {
    if (!custom || !custom.provider) {
      throw new Error('Custom adapter provider is required for custom adapter')
    }

    // Check if provider has required methods
    const requiredMethods = [
      'connect',
      'disconnect',
      'produce',
      'consume',
      'createTopic',
      'deleteTopic',
      'healthCheck',
    ]
    for (const method of requiredMethods) {
      if (typeof custom.provider[method] !== 'function') {
        throw new Error(
          `Custom adapter provider must implement ${method} method`
        )
      }
    }
  }
}
