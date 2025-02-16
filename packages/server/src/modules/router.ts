import { router } from '../trpc.js';
import { exampleRouter } from './example/router.js';

// 实现路由
export const appRouter = router({
  example: exampleRouter,
});

// 导出路由实例
export type AppRouter = typeof appRouter;
