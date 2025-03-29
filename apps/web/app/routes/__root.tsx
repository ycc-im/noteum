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
            <ReactQueryDevtools position="bottom" buttonPosition="bottom-left" />
            <TanStackRouterDevtools position="bottom-right" />
          </>
        )}

        <Scripts />
      </body>
    </html>
  )
}
