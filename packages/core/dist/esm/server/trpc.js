import { initTRPC, TRPCError } from '@trpc/server';
import { ZodError } from 'zod';
// 创建 tRPC 实例
const t = initTRPC.context().create({
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});
// 导出基础工具
export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
// 创建认证中间件
export const authMiddleware = middleware(async ({ ctx, next }) => {
    if (!ctx.userId) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: '需要登录',
        });
    }
    return next();
});
// 导出受保护的过程构建器
export const protectedProcedure = procedure.use(authMiddleware);
