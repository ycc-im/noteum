import { FastifyRequest } from 'fastify';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@noteum/server/src/modules/router';

// tRPC 上下文类型
export interface Context {
  req: FastifyRequest;
}

export type CreateContextOptions = {
  req: FastifyRequest;
};

// 导出 tRPC 路由的输入输出类型
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// API 响应类型
export interface ExampleResponse {
  message: string;
  timestamp: string;
}
