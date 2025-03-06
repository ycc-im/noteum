import { jsxs as _jsxs, jsx as _jsx } from 'react/jsx-runtime'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '../router'
export const Route = createFileRoute('/dashboard/')({
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.ensureQueryData(trpc.posts.queryOptions())
    return
  },
  component: DashboardIndexComponent,
})
function DashboardIndexComponent() {
  const postsQuery = useQuery(trpc.posts.queryOptions())
  const posts = postsQuery.data || []
  return _jsx('div', {
    className: 'p-2',
    children: _jsxs('div', {
      className: 'p-2',
      children: [
        'Welcome to the dashboard! You have ',
        _jsxs('strong', { children: [posts.length, ' total posts'] }),
        '.',
      ],
    }),
  })
}
