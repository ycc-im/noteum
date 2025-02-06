import { z } from 'zod';

// 定义输入验证 schema
export const exampleInputSchema = z.object({
  name: z.string().min(1, '名字不能为空').max(50, '名字太长了')
}).optional().default({ name: '世界' });

// 定义基础的路由类型
export interface ExampleInput {
  name?: string;
}

export interface ExampleResponse {
  message: string;
  timestamp: string;
}

// 定义路由结构（只包含公共接口定义）
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

// 定义上下文类型（只包含必要的公共部分）
export interface Context {
  // 可以定义一些安全的公共上下文属性
  userId?: string;
  // 注意：不要在这里暴露敏感的请求/响应对象
}

// 导出路由类型（只用于类型检查）
export type AppRouter = RouterDefinition;
