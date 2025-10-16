import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './index'

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: function Settings() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p>Application settings will appear here</p>
      </div>
    )
  },
})