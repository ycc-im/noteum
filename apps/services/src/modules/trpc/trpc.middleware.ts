import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { PrismaService } from '../database/prisma.service'
import { Context } from './trpc.context'

@Injectable()
export class TrpcMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Add trpc context to request
    ;(req as any).trpcContext = {
      req,
      prisma: this.prisma,
      user: (req as any).user, // Will be populated by auth middleware
    } as Context

    next()
  }
}
