import { router } from '../trpc';
import { exampleRouter } from './example/router';

// 实现路由
export const appRouter = router({
  example: exampleRouter,
});

// 导出路由实例
export type AppRouter = typeof appRouter;
