import * as React from 'react'
import {
  HeadContent,
  Scripts,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import type { TRPCProxy } from '../types/trpc'
import type { QueryClient } from '@tanstack/react-query'

export interface RouterAppContext {
  trpc: TRPCProxy
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      {/* @ts-expect-error Type mismatch between React Router and React 18 */}
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        {process.env.NODE_ENV === 'development' && (
          <>
            {/* @ts-expect-error Type mismatch between React Query and React 18 */}
            <ReactQueryDevtools position="bottom" buttonPosition="bottom-left" />
            {/* @ts-expect-error Type mismatch between React Router and React 18 */}
            <TanStackRouterDevtools position="bottom-right" />
          </>
        )}

        <Scripts />
      </body>
    </html>
  )
}
