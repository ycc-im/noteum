import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { TrpcModule } from './trpc/trpc.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule, HealthModule, TrpcModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}