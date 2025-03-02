import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { Router } from '../../../server/src/index'

// 创建 tRPC 客户端
const trpc = createTRPCProxyClient<Router>({
  links: [
    httpBatchLink({
      url: `http://localhost:9157/trpc`,
    }),
  ],
});

// 导出客户端
export default trpc;