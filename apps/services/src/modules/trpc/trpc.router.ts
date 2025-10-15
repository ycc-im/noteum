import { TrpcService } from './trpc.service'
import { z } from 'zod'

// 创建一个简单的导出函数来生成路由器
export function createTrpcRouter(trpc: TrpcService) {
  return trpc.router({
    health: trpc.publicProcedure.query(() => ({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    })),

    // 简化的用户配置，避免复杂的类型问题
    user: trpc.publicProcedure.query(() => ({
      message: 'User endpoint working',
    })),

    // TODO: Add more routers as we implement them
    // notebooks: notebooksRouter,
    // notes: notesRouter,
  })
}

// 为模块导出创建一个默认路由器实例
export const TrpcRouter = createTrpcRouter(new TrpcService({} as any))