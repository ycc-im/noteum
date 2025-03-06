import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime'
import * as React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
// @ts-expect-error - Type definitions conflict with TypeScript version
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '../router'
import { Spinner } from './-components/spinner'
export const Route = createFileRoute('/dashboard/posts/$postId')({
  validateSearch: z.object({
    showNotes: z.boolean().optional(),
    notes: z.string().optional(),
  }),
  loader: async ({ context: { trpc, queryClient }, params: { postId } }) => {
    await queryClient.ensureQueryData(trpc.post.queryOptions(postId))
  },
  pendingComponent: Spinner,
  component: DashboardPostsPostIdComponent,
})
function DashboardPostsPostIdComponent() {
  const postId = Route.useParams({ select: (d) => d.postId })
  const postQuery = useQuery(trpc.post.queryOptions(postId))
  const post = postQuery.data
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const [notes, setNotes] = React.useState(search.notes ?? ``)
  React.useEffect(() => {
    navigate({
      search: (old) => ({ ...old, notes: notes ? notes : undefined }),
      replace: true,
      params: true,
    })
  }, [notes])
  if (!post) {
    return _jsx('div', { children: 'Post not found' })
  }
  return _jsxs(
    'div',
    {
      className: 'p-2 space-y-2',
      children: [
        _jsxs('div', {
          className: 'space-y-2',
          children: [
            _jsx('h2', {
              className: 'font-bold text-lg',
              children: _jsx('input', {
                defaultValue: post.id,
                className: 'border border-opacity-50 rounded p-2 w-full',
                disabled: true,
              }),
            }),
            _jsx('div', {
              children: _jsx('textarea', {
                defaultValue: post.title,
                rows: 6,
                className: 'border border-opacity-50 p-2 rounded w-full',
                disabled: true,
              }),
            }),
          ],
        }),
        _jsxs('div', {
          children: [
            _jsx(Link, {
              to: `/dashboard/posts/${postId}`,
              className: 'text-blue-700',
              children: 'Post Details',
            }),
            _jsxs(Link, {
              to: Route.fullPath,
              search: (old) => ({
                ...old,
                showNotes: old.showNotes ? undefined : true,
              }),
              className: 'text-blue-700',
              children: [search.showNotes ? 'Close Notes' : 'Show Notes', ' '],
            }),
            search.showNotes
              ? _jsx(_Fragment, {
                  children: _jsxs('div', {
                    children: [
                      _jsx('div', { className: 'h-2' }),
                      _jsx('textarea', {
                        value: notes,
                        onChange: (e) => setNotes(e.target.value),
                        rows: 5,
                        className: 'shadow w-full p-2 rounded',
                        placeholder: 'Write some notes here...',
                      }),
                      _jsx('div', {
                        className: 'italic text-xs',
                        children:
                          'Notes are stored in the URL. Try copying the URL into a new tab!',
                      }),
                    ],
                  }),
                })
              : null,
          ],
        }),
      ],
    },
    post.id,
  )
}
