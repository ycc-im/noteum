import { initTRPC } from '@trpc/server';
import { Context } from '../context.js';
import { z } from 'zod';

// 初始化 tRPC
const t = initTRPC.context<Context>().create();

// 导出基础构建块
export const router = t.router;
export const publicProcedure = t.procedure;

// 创建根路由器
export const appRouter = t.router({
  // 示例过程，确保有一些内容
  hello: publicProcedure
    .input(z.string())
    .query(({ input }) => {
      return `Hello, ${input}!`;
    })
});

// 导出路由器类型
export type AppRouter = typeof appRouter;
