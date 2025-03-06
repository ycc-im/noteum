import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { MatchRoute, Outlet, createFileRoute, Link } from '@tanstack/react-router'
// @ts-expect-error - Type definitions conflict with TypeScript version
import { useQuery } from '@tanstack/react-query'
import { trpc } from '../router'
import { Spinner } from './-components/spinner'
export const Route = createFileRoute('/dashboard/posts')({
  errorComponent: () => 'Oh crap!',
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.ensureQueryData(trpc.posts.queryOptions())
    return
  },
  pendingComponent: Spinner,
  component: DashboardPostsComponent,
})
function DashboardPostsComponent() {
  const postsQuery = useQuery(trpc.posts.queryOptions())
  const posts = postsQuery.data || []
  return _jsxs('div', {
    className: 'flex-1 flex',
    children: [
      _jsx('div', {
        className: 'divide-y w-48',
        children: posts.map((post) => {
          return _jsx(
            'div',
            {
              children: _jsx(Link, {
                to: '/dashboard/posts/$postId',
                params: {
                  postId: post.id,
                },
                className: 'block py-2 px-3 text-blue-700',
                children: _jsxs('pre', {
                  className: 'text-sm',
                  children: [
                    '#',
                    post.id,
                    ' - ',
                    post.title,
                    ' ',
                    _jsx(MatchRoute, {
                      to: '/dashboard/posts/$postId',
                      params: {
                        postId: post.id,
                      },
                      pending: true,
                      children: _jsx(Spinner, {}),
                    }),
                  ],
                }),
              }),
            },
            post.id,
          )
        }),
      }),
      _jsx('div', { className: 'flex-1 border-l border-gray-200', children: _jsx(Outlet, {}) }),
    ],
  })
}
