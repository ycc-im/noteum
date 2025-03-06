import * as React from 'react'
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

  return (
    <div className="flex-1 flex">
      <div className="divide-y w-48">
        {posts.map((post) => {
          return (
            <div key={post.id}>
              <Link
                to="/dashboard/posts/$postId"
                params={{
                  postId: post.id,
                }}
                className="block py-2 px-3 text-blue-700"
              >
                <pre className="text-sm">
                  #{post.id} - {post.title}{' '}
                  <MatchRoute
                    to="/dashboard/posts/$postId"
                    params={{
                      postId: post.id,
                    }}
                    pending
                  >
                    <Spinner />
                  </MatchRoute>
                </pre>
              </Link>
            </div>
          )
        })}
      </div>
      <div className="flex-1 border-l border-gray-200">
        <Outlet />
      </div>
    </div>
  )
}
