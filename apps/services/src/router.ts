import { createTrpcRouter } from './modules/trpc/trpc.router'
import { TrpcService } from './modules/trpc/trpc.service'

// 导出路由器类型
export type AppRouter = ReturnType<typeof createTrpcRouter>

// 创建并导出路由器实例
const trpcService = new TrpcService({
  // 基础配置
} as any)
export const appRouter = createTrpcRouter(trpcService)
