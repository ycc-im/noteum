import fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { createContext } from './context.js';
import { appRouter } from './modules/router.js';
import { SERVER_CONFIG } from './config/server.js';
import { renderTrpcPanel } from 'trpc-panel';


async function main() {
  const server = fastify({
    maxParamLength: 5000,
    logger: true,
  });

  // 注册 CORS 插件
  await server.register(cors, {
    origin: true, // 在生产环境中应该配置具体的域名
  });

  // 注册 tRPC 插件
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
    },
  });

  // 添加 tRPC 面板用于调试（仅在开发环境中可用）
  if (process.env.NODE_ENV === 'development') {
    server.get('/', async (request, reply) => {
      const baseUrl = `http://${SERVER_CONFIG.host === '0.0.0.0' ? 'localhost' : SERVER_CONFIG.host}:${SERVER_CONFIG.port}`;
      const html = renderTrpcPanel(appRouter, { url: `${baseUrl}/trpc` });
      reply.type('text/html').send(html);
    });
  } else {
    // 在生产环境中返回 API 状态信息
    server.get('/', async (request, reply) => {
      reply.send({
        status: 'ok',
        version: process.env.npm_package_version || '0.0.0',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });
    });
  }

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
      port: SERVER_CONFIG.port,
      host: SERVER_CONFIG.host,
    });
    console.log(`Server is running on http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
