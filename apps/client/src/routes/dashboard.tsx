import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './index'

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: function Dashboard() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to Noteum Dashboard</p>
      </div>
    )
  },
})