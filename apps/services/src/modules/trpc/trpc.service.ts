import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { initTRPC } from '@trpc/server'
import { ZodError } from 'zod'
import { TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { Context } from './trpc.context'

@Injectable()
export class TrpcService {
  private t

  constructor(private readonly configService: ConfigService) {
    this.t = initTRPC.context<Context>().create({
      transformer: superjson,
      errorFormatter(opts) {
        const { shape, error } = opts
        return {
          ...shape,
          data: {
            ...shape.data,
            zodError:
              error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
                ? error.cause.flatten()
                : null,
          },
        }
      },
    })
  }

  createRouter() {
    return this.t.router
  }

  get publicProcedure() {
    return this.t.procedure
  }

  get router() {
    return this.t.router
  }
}