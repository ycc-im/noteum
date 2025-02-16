import { z } from 'zod';

// 基础路由定义类型
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

// 示例输入验证 schema
export const exampleInputSchema = z.object({
  name: z.string().min(1, '名字不能为空').max(50, '名字太长了')
}).optional().default({ name: '世界' });

// 示例输入类型
export interface ExampleInput {
  name?: string;
}

// 示例响应类型
export interface ExampleResponse {
  message: string;
  timestamp: string;
}

// 创建路由器类型
export type CreateRouter = () => RouterDefinition;
