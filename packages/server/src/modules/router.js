"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("../trpc");
const router_1 = require("./example/router");
// 实现路由
exports.appRouter = (0, trpc_1.router)({
    example: router_1.exampleRouter,
});
//# sourceMappingURL=router.js.map