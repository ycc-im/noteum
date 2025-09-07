import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcController } from './trpc.controller';
import { TrpcContextService } from './context';

@Module({
  controllers: [TrpcController],
  providers: [TrpcService, TrpcContextService],
})
export class TrpcModule {}