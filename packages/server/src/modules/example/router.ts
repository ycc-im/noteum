import { z } from 'zod';
import type { ExampleResponse } from '../../types/router.js';
import { router, publicProcedure as procedure } from '../../trpc.js';

// 实现示例路由
export const exampleRouter = router({
  hello: procedure
    .input(
      z.object({
        name: z.string().optional()
      })
    )
    .output(
      z.object({
        message: z.string(),
        timestamp: z.string()
      })
    )
    .query(({ input }: { input: { name?: string } }) => {
      return {
        message: `你好，${input.name || '访客'}！`,
        timestamp: new Date().toISOString()
      };
    }),

  secretData: procedure
    .query(() => {
      const response: ExampleResponse = {
        message: '这是受保护的数据！',
        timestamp: new Date().toISOString(),
      };
      return response;
    }),
});
