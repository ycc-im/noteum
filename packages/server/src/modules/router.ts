import type { RouterDefinition } from '@noteum/core/types';
import { router } from '@noteum/core/server';
import { exampleRouter } from './example/router';

// 实现路由
export const appRouter = router({
  example: exampleRouter,
}) satisfies RouterDefinition;

// 导出路由实例
export type AppRouter = typeof appRouter;
