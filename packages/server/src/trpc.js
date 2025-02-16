"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.authMiddleware = exports.publicProcedure = exports.middleware = exports.router = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
// 创建一个新的 tRPC 实例
const t = server_1.initTRPC.context().create({
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof zod_1.ZodError ? error.cause.flatten() : null,
            },
        };
    },
});
// 导出 tRPC 路由器和中间件构建器
exports.router = t.router;
exports.middleware = t.middleware;
// 导出公共过程构建器
exports.publicProcedure = t.procedure;
// 创建一个需要认证的中间件
exports.authMiddleware = (0, exports.middleware)(async ({ ctx, next }) => {
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
exports.protectedProcedure = t.procedure.use(exports.authMiddleware);
// TODO: 后续添加实际的认证验证函数
//# sourceMappingURL=trpc.js.map