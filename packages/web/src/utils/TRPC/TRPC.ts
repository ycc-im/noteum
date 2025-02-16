import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCProxyClient } from '@trpc/client';

// 从 server 包导入类型
import type { AppRouter } from '@noteum/server';

export const trpc = createTRPCReact<AppRouter>();

// 创建 tRPC 客户端
export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});
