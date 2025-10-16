import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './index'

export const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notes',
  component: function Notes() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <p>Your notes will appear here</p>
      </div>
    )
  },
})