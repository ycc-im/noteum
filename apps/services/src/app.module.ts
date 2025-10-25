import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { TerminusModule } from '@nestjs/terminus'
import { HealthModule } from './modules/health/health.module'
import { DatabaseModule } from './modules/database/database.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { NotebooksModule } from './modules/notebooks/notebooks.module'
import { NotesModule } from './modules/notes/notes.module'
import { WebsocketModule } from './modules/websocket/websocket.module'
import { TrpcModule } from './modules/trpc/trpc.module'
import { MessagingTestModule } from './modules/messaging/testing/messaging-test.module'
import { configuration } from './config/configuration'
import { validateConfig } from './config/validation'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      validate: validateConfig,
    }),

    // 限流模块
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // 健康检查模块
    TerminusModule.forRoot(),

    // 业务模块
    HealthModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    NotebooksModule,
    NotesModule,
    WebsocketModule,
    TrpcModule,
    MessagingTestModule,
  ],
})
export class AppModule {}
