import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime'
import { Link, Outlet, createRootRouteWithContext, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// @ts-expect-error - Type definitions conflict with TypeScript version
import { Spinner } from './-components/spinner'
export const Route = createRootRouteWithContext()({
  component: RootComponent,
})
function RootComponent() {
  const isFetching = useRouterState({ select: (s) => s.isLoading })
  return _jsxs(_Fragment, {
    children: [
      _jsxs('div', {
        className: `min-h-screen flex flex-col`,
        children: [
          _jsxs('div', {
            className: `flex items-center border-b gap-2`,
            children: [
              _jsx('h1', { className: `text-3xl p-2`, children: 'With tRPC + TanStack Query' }),
              _jsx('div', {
                className: `text-3xl duration-300 delay-0 opacity-0 ${isFetching ? ` duration-1000 opacity-40` : ''}`,
                children: _jsx(Spinner, {}),
              }),
            ],
          }),
          _jsxs('div', {
            className: `flex-1 flex`,
            children: [
              _jsx('div', {
                className: `divide-y w-56`,
                children: [
                  ['/', 'Home'],
                  ['/dashboard', 'Dashboard'],
                ].map(([to, label]) => {
                  return _jsx(
                    'div',
                    { children: _jsx(Link, { to: to, className: 'nav-link', children: label }) },
                    to,
                  )
                }),
              }),
              _jsx('div', {
                className: `flex-1 border-l border-gray-200`,
                children: _jsx(Outlet, {}),
              }),
            ],
          }),
        ],
      }),
      _jsx(TanStackRouterDevtools, { position: 'bottom-left' }),
      _jsx(ReactQueryDevtools, { position: 'bottom', buttonPosition: 'bottom-right' }),
    ],
  })
}
