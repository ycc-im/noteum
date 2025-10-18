import { Outlet } from '@tanstack/react-router'
import { AppInit } from '@/components/app-init'

// Import test utilities in development
if (import.meta.env.DEV) {
  import('@/test/utils/database-test')
}

export function App() {
  return (
    <AppInit>
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    </AppInit>
  )
}
