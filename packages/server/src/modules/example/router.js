"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../../trpc");
// 实现示例路由
exports.exampleRouter = (0, trpc_1.router)({
    hello: trpc_1.publicProcedure
        .input(zod_1.z.object({
        name: zod_1.z.string().optional()
    }))
        .output(zod_1.z.object({
        message: zod_1.z.string(),
        timestamp: zod_1.z.string()
    }))
        .query(({ input }) => {
        return {
            message: `你好，${input.name || '访客'}！`,
            timestamp: new Date().toISOString()
        };
    }),
    secretData: trpc_1.publicProcedure
        .query(() => {
        const response = {
            message: '这是受保护的数据！',
            timestamp: new Date().toISOString(),
        };
        return response;
    }),
});
//# sourceMappingURL=router.js.map