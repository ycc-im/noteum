import { jsx as _jsx } from 'react/jsx-runtime'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/dashboard/posts/')({
  component: DashboardPostsIndexComponent,
})
function DashboardPostsIndexComponent() {
  return _jsx('div', { className: 'p-2', children: 'Select a post to view.' })
}
