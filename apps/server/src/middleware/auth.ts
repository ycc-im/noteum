import { initTRPC, TRPCError } from '@trpc/server'
import type { Context } from '../context'
export const t = initTRPC.context<Context>().create()

export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts
  // `ctx.user` is nullable
  if (!ctx.user) {
    //     ^?
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return opts.next({
    ctx: {
      // ✅ user value is known to be non-null now
      user: ctx.user,
      // ^?
    },
  })
})
