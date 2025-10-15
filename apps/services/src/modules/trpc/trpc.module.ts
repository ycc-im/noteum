import { Module } from '@nestjs/common'
import { TrpcService } from './trpc.service'
import { TrpcRouter } from './trpc.router'
import { TrpcController } from './trpc.controller'
import { TrpcMiddleware } from './trpc.middleware'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [TrpcController],
  providers: [TrpcService, TrpcMiddleware],
  exports: [TrpcService, TrpcMiddleware],
})
export class TrpcModule {}