import { Controller, Get, Post, Body } from '@nestjs/common'
import { TrpcService } from './trpc.service'
import { createTrpcRouter } from './trpc.router'

@Controller('trpc')
export class TrpcController {
  constructor(private readonly trpcService: TrpcService) {}

  private router = createTrpcRouter(this.trpcService)

  @Get()
  async getProcedure() {
    return {
      message: 'tRPC endpoint',
      router: this.router,
    }
  }
}