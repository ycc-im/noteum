import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { Spinner } from './routes/-components/spinner'
import type { AppRouter, TRPCProxy } from './types/trpc'

// 初始化全局queryClient
export const queryClient = new QueryClient()

// 创建类型安全的tRPC客户端
const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:9157/trpc',
    }),
  ],
})

// 创建一个包含trpc客户端和queryClient的对象
export const trpc = {
  client: trpcClient,
  queryClient,
  // 代理所有客户端方法
  query: trpcClient.query,
  mutation: trpcClient.mutation,
  subscription: trpcClient.subscription,
  runtime: trpcClient.runtime,
} as TRPCProxy

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    context: {
      trpc,
      queryClient,
    },
    defaultPendingComponent: () => (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50`}
      >
        <Spinner size="large" color="primary" />
      </div>
    ),
    Wrap: function WrapComponent({ children }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    },
  })

  return router
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
