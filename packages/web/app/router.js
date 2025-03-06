import { jsx as _jsx } from 'react/jsx-runtime'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { Spinner } from './routes/-components/spinner'
export const queryClient = new QueryClient()
export const trpc = createTRPCOptionsProxy({
  client: createTRPCClient({
    links: [
      httpBatchLink({
        // since we are using Vinxi, the server is running on the same port,
        // this means in dev the url is `http://localhost:3000/trpc`
        // and since its from the same origin, we don't need to explicitly set the full URL
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
    defaultPendingComponent: () =>
      _jsx('div', { className: `p-2 text-2xl`, children: _jsx(Spinner, {}) }),
    Wrap: function WrapComponent({ children }) {
      return _jsx(QueryClientProvider, { client: queryClient, children: children })
    },
  })
  return router
}
