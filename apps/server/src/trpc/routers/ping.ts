import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

export const pingRouter = t.router({
  ping: t.procedure.query(() => 'pong'),
})
