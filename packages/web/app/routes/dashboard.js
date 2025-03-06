import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
// @ts-expect-error - Type definitions conflict with TypeScript version
export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})
function DashboardComponent() {
  return _jsxs(_Fragment, {
    children: [
      _jsxs('div', {
        className: 'flex items-center border-b',
        children: [
          _jsx('h2', { className: 'text-xl p-2', children: 'Dashboard' }),
          _jsx(Link, {
            to: '/dashboard/posts/$postId',
            params: {
              postId: '3',
            },
            className: 'py-1 px-2 text-xs bg-blue-500 text-white rounded-full',
            children: '1 New Invoice',
          }),
        ],
      }),
      _jsx('div', {
        className: 'flex flex-wrap divide-x',
        children: [
          ['.', 'Summary'],
          ['/dashboard/posts', 'Posts'],
        ].map(([to, label]) => {
          return _jsx(
            Link,
            { to: to, className: `p-2 ${to === '.' ? 'font-bold' : ''}`, children: label },
            to,
          )
        }),
      }),
      _jsx('hr', {}),
      _jsx(Outlet, {}),
    ],
  })
}
