import { router } from '../trpc';

// 创建根路由器
export const appRouter = router({
  // 这里可以添加更多的子路由器
});

// 导出路由器类型
export type AppRouter = typeof appRouter;
