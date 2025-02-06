import { z } from 'zod';
import { initTRPC } from '@trpc/server';

// 定义基础的路由类型
export interface ExampleInput {
  name?: string;
}

export interface ExampleResponse {
  message: string;
  timestamp: string;
}

// 定义路由结构
export interface RouterDefinition {
  example: {
    hello: {
      input?: ExampleInput;
      output: ExampleResponse;
    };
    secretData: {
      input?: void;
      output: ExampleResponse;
    };
  };
}

// 创建路由类型
export type AppRouter = ReturnType<typeof createRouter>;

// 创建路由构建器函数类型
export type CreateRouter = () => AppRouter;

// 定义上下文类型
export interface Context {
  req: any; // 根据实际需要定义请求类型
}

// 创建 tRPC 实例
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

// 导出 tRPC 实例的各个部分
export const router = t.router;
export const middleware = t.middleware;
export const procedure = t.procedure;

// 导出 tRPC 实例类型
export type TRPC = typeof t;
