import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import logtoConfiguration from './logto.config';
import { validate } from './config.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration, logtoConfiguration],
      validate,
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}