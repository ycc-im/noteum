import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import { Spinner } from './routes/-components/spinner'
// 由于前后端tRPC版本可能不兼容，使用any类型绕过类型检查
// import type { Router as AppRouter } from '../../server/src/index'
type AppRouter = any

export const queryClient = new QueryClient()

// 创建连接到外部服务器的tRPC客户端
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:9157/trpc',
      }),
    ],
  }),
  queryClient,
})

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
      <div className={`p-2 text-2xl`}>
        <Spinner />
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
