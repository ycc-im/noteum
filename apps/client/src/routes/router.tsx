import { createRouter, createRootRoute, Outlet } from '@tanstack/react-router'
import { dashboardRoute } from './dashboard'
import { notebooksRoute } from './notebooks'
import { notesRoute } from './notes'
import { settingsRoute } from './settings'

// Create the root route
const rootRoute = createRootRoute({
  component: Outlet,
})

// Create the route tree
export const routeTree = rootRoute.addChildren([
  dashboardRoute,
  notebooksRoute,
  notesRoute,
  settingsRoute,
])

// Create the router instance
export const router = createRouter({ routeTree })

// Register router for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}