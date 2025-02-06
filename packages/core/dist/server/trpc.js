"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.authMiddleware = exports.middleware = exports.procedure = exports.router = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
// 创建 tRPC 实例
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
// 导出基础工具
exports.router = t.router;
exports.procedure = t.procedure;
exports.middleware = t.middleware;
// 创建认证中间件
exports.authMiddleware = (0, exports.middleware)(async ({ ctx, next }) => {
    if (!ctx.userId) {
        throw new server_1.TRPCError({
            code: 'UNAUTHORIZED',
            message: '需要登录',
        });
    }
    return next();
});
// 导出受保护的过程构建器
exports.protectedProcedure = exports.procedure.use(exports.authMiddleware);
