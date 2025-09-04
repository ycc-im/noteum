import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcController } from './trpc.controller';

@Module({
  controllers: [TrpcController],
  providers: [TrpcService],
})
export class TrpcModule {}