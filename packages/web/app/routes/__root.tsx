import * as React from 'react'
import { Outlet, createRootRouteWithContext, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { Spinner } from './-components/spinner'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { AppRouter } from '../../trpc-server.handler'
import type { QueryClient } from '@tanstack/react-query'

export interface RouterAppContext {
  trpc: TRPCOptionsProxy<AppRouter>
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
})

function RootComponent() {
  const isFetching = useRouterState({ select: (s) => s.isLoading })

  return (
    <>
      <div className={`min-h-screen flex flex-col`}>
        <div className={`flex items-center border-b gap-2`}>
          <h1 className={`text-3xl p-2`}>With tRPC + TanStack Query</h1>
          {/* Show a global spinner when the router is transitioning */}
          <div
            className={`text-3xl duration-300 delay-0 opacity-0 ${
              isFetching ? ` duration-1000 opacity-40` : ''
            }`}
          >
            <Spinner />
          </div>
        </div>
        <div className={`flex-1 flex`}>
          <div className={`divide-y w-56`}>
            {(
              [
                ['/', 'Home'],
                ['/dashboard', 'Dashboard'],
              ] as const
            ).map(([to, label]) => {
              return (
                <div key={to}>
                  <a href={to} className="nav-link">
                    {label}
                  </a>
                </div>
              )
            })}
          </div>
          <div className={`flex-1 border-l border-gray-200`}>
            {/* Render our first route match */}
            {React.createElement(Outlet as React.ComponentType<any>)}
          </div>
        </div>
      </div>
      {React.createElement(TanStackRouterDevtools as React.ComponentType<any>, {
        position: 'bottom-left',
      })}
      {React.createElement(ReactQueryDevtools as React.ComponentType<any>, {
        position: 'bottom',
        buttonPosition: 'bottom-right',
      })}
    </>
  )
}
