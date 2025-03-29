import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { pingRouter } from './routers/ping'

// 创建 tRPC 实例
const t = initTRPC.create()

// 导出基础构建块
export const router = t.router
export const publicProcedure = t.procedure

// 定义路由
export const appRouter = router({
  ...pingRouter._def.procedures,
  hello: publicProcedure.input(z.object({ name: z.string().optional() })).query(({ input }) => {
    return {
      greeting: `Hello, ${input.name ? input.name : 'world'}!`,
    }
  }),
})

// 导出类型
export type AppRouter = typeof appRouter
