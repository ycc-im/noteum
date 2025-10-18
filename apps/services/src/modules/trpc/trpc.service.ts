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

  get procedure() {
    return this.t.procedure
  }

  // 创建需要认证的程序
  get authProcedure() {
    return this.t.procedure.use(({ ctx, next }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to access this resource',
        })
      }
      return next({
        ctx: {
          ...ctx,
          user: ctx.user,
        },
      })
    })
  }

  // 创建管理员权限程序
  get adminProcedure() {
    return this.authProcedure.use(({ ctx, next }) => {
      if (ctx.user?.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be an admin to access this resource',
        })
      }
      return next({
        ctx: {
          ...ctx,
        },
      })
    })
  }
}
