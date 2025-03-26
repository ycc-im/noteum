import type { TRPCClient } from '@trpc/client'
import type { QueryClient } from '@tanstack/react-query'
import type { Router as AppRouter } from '../../../server/src'

// 定义TRPC代理的基本接口
export interface TRPCProxy extends TRPCClient<AppRouter> {
  client: TRPCClient<AppRouter>
  queryClient: QueryClient
}

// 导出AppRouter类型供其他文件使用
export type { AppRouter }
