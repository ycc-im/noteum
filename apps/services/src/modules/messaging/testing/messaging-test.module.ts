import { Module } from '@nestjs/common'
import { MessagingTestController } from './messaging-test-controller'
import { MessagingModule } from '../messaging.module'

@Module({
  imports: [
    MessagingModule.forRoot({
      adapter: 'redis',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        connectTimeout: 5000,
        lazyConnect: false,
        maxRetriesPerRequest: 2,
      },
      options: {
        enableHealthCheck: true,
        healthCheckInterval: 10000,
        reconnectAttempts: 3,
        reconnectDelay: 2000,
      },
    }),
  ],
  controllers: [MessagingTestController],
})
export class MessagingTestModule {}
