import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import type * as React from 'react'

import type { QueryClient } from '@tanstack/react-query'
import type { TRPCProxy } from '../types/trpc'

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
    <html lang="zh-CN">
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
