import { initTRPC } from '@trpc/server';
import { Context } from '../context.js';

// 初始化 tRPC
const t = initTRPC.context<Context>().create();

// 导出基础构建块
export const router = t.router;
export const publicProcedure = t.procedure;

// 创建根路由器
export const appRouter = router({
  // 这里可以添加更多的子路由器
});

// 导出路由器类型
export type AppRouter = typeof appRouter;
