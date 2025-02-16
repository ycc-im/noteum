"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_2 = require("@trpc/server/adapters/fastify");
const context_1 = require("./context");
const router_1 = require("./modules/router");
const server_1 = require("./config/server");
const trpc_panel_1 = require("trpc-panel");
async function main() {
    const server = (0, fastify_1.default)({
        maxParamLength: 5000,
        logger: true,
    });
    // 注册 CORS 插件
    await server.register(cors_1.default, {
        origin: true, // 在生产环境中应该配置具体的域名
    });
    // 注册 tRPC 插件
    await server.register(fastify_2.fastifyTRPCPlugin, {
        prefix: '/trpc',
        trpcOptions: {
            router: router_1.appRouter,
            createContext: context_1.createContext,
        },
    });
    // 添加 tRPC 面板用于调试
    server.get('/', async () => {
        return (0, trpc_panel_1.renderTrpcPanel)(router_1.appRouter, { url: 'http://localhost:3000/trpc' });
    });
    // 添加示例路由
    server.get('/example', async () => {
        return {
            examples: [
                {
                    name: 'Hello API',
                    description: '基础示例 API',
                    endpoint: '/trpc/example.hello',
                    example: {
                        input: { name: '张三' },
                        curl: 'curl -X GET "http://localhost:3000/trpc/example.hello?input=%7B%22name%22%3A%22%E5%BC%A0%E4%B8%89%22%7D"'
                    }
                }
            ]
        };
    });
    // 健康检查端点
    server.get('/health', async () => {
        return { status: 'ok' };
    });
    try {
        await server.listen({
            port: server_1.SERVER_CONFIG.port,
            host: server_1.SERVER_CONFIG.host,
        });
        console.log(`Server is running on http://${server_1.SERVER_CONFIG.host}:${server_1.SERVER_CONFIG.port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=app.js.map