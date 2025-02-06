import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../../trpc';
import { ExampleResponse } from '@noteum/core/types';

export const exampleRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, '名字不能为空').max(50, '名字太长了')
      }).optional().default({ name: '世界' })
    )
    .query(({ input }) => {
      const response: ExampleResponse = {
        message: `你好，${input.name}！`,
        timestamp: new Date().toISOString(),
      };
      return response;
    }),
    
  secretData: protectedProcedure
    .query(() => {
      const response: ExampleResponse = {
        message: '这是受保护的数据！',
        timestamp: new Date().toISOString(),
      };
      return response;
    }),
});
