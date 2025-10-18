import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { Context } from '../trpc.context'

export const publicProcedure = {
  query: (schema: z.ZodTypeAny, fn?: (opts: any) => any) => {
    return async ({ input, ctx }: { input?: any; ctx: Context }) => {
      // Public procedure logic
      return fn ? await fn({ input, ctx }) : input
    }
  },

  mutation: (schema: z.ZodTypeAny, fn?: (opts: any) => any) => {
    return async ({ input, ctx }: { input?: any; ctx: Context }) => {
      // Public mutation logic
      return fn ? await fn({ input, ctx }) : input
    }
  },
}

export const protectedProcedure = {
  query: (schema: z.ZodTypeAny, fn?: (opts: any) => any) => {
    return async ({ input, ctx }: { input?: any; ctx: Context }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to access this resource',
        })
      }

      return fn ? await fn({ input, ctx }) : input
    }
  },

  mutation: (schema: z.ZodTypeAny, fn?: (opts: any) => any) => {
    return async ({ input, ctx }: { input?: any; ctx: Context }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to access this resource',
        })
      }

      return fn ? await fn({ input, ctx }) : input
    }
  },
}
