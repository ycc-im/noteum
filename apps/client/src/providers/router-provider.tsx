import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/routes/router'

export function RouterProviders() {
  return <RouterProvider router={router} />
}
