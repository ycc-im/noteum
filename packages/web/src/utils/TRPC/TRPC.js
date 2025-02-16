"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.trpc = void 0;
const react_query_1 = require("@trpc/react-query");
const client_1 = require("@trpc/client");
const client_2 = require("@trpc/client");
exports.trpc = (0, react_query_1.createTRPCReact)();
// 创建 tRPC 客户端
exports.client = (0, client_2.createTRPCProxyClient)({
    links: [
        (0, client_1.httpBatchLink)({
            url: 'http://localhost:3000/trpc',
        }),
    ],
});
//# sourceMappingURL=TRPC.js.map