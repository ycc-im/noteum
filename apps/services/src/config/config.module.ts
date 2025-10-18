import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { configuration } from './configuration'
import { validateConfig } from './validation'
import { ConfigService } from './config.service'

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      validate: validateConfig,
      isGlobal: true,
      envFilePath: ['.env.local', '.env', '.env.production'],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
