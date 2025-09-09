import { All, Controller, Req, Res, Next } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcContextService } from './context';
import { Request, Response, NextFunction } from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';

@Controller('trpc')
export class TrpcController {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly contextService: TrpcContextService,
  ) {}

  @All('*')
  async handler(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    const middleware = createExpressMiddleware({
      router: this.trpcService.getRouter(),
      createContext: ({ req }) => this.contextService.createContext(req),
    });

    return middleware(req, res, next);
  }
}