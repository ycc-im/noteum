import { FastifyRequest } from 'fastify';

// 服务器特定的上下文类型
export interface Context {
  req: FastifyRequest;
  // 可以添加服务器特定的上下文属性
  user?: {
    id: string;
    // 可以添加更多用户相关的属性
  };
}

// 创建上下文时的选项
export interface CreateContextOptions {
  req: FastifyRequest;
}
