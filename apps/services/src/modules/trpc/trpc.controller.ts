import { Controller, Get, Post, Body } from '@nestjs/common'
import { TrpcService } from './trpc.service'
import { AuthService } from '../auth/auth.service'
import { createTrpcRouter } from './trpc.router'

@Controller('trpc')
export class TrpcController {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly authService: AuthService
  ) {}

  private router = createTrpcRouter(this.trpcService, this.authService)

  @Get()
  async getProcedure() {
    return {
      message: 'tRPC endpoint',
      availableRoutes: [
        'health',
        'auth.login',
        'auth.refreshToken',
        'auth.me',
        'auth.logout',
        'profile',
        'admin',
      ],
    }
  }
}
