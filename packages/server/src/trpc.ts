import { initTRPC } from '@trpc/server';
import { Context } from './types/context.js';
import { ZodError } from 'zod';

// 创建一个新的 tRPC 实例
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// 导出 tRPC 路由器和中间件构建器
export const router = t.router;
export const middleware = t.middleware;

// 导出公共过程构建器
export const publicProcedure = t.procedure;

// 创建一个需要认证的中间件
export const authMiddleware = middleware(async ({ ctx, next }) => {
  // 这里可以添加你的认证逻辑
  // TODO: 实现实际的认证逻辑
  return next({
    ctx: {
      ...ctx,
      user: { id: 'temp-user-id' }, // 临时用户ID
    },
  });
});

// 导出需要认证的过程构建器
export const protectedProcedure = t.procedure.use(authMiddleware);

// TODO: 后续添加实际的认证验证函数
