import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { TrpcModule } from './trpc/trpc.module';

@Module({
  imports: [ConfigModule, HealthModule, TrpcModule],
  controllers: [],
  providers: [],
})
export class AppModule {}