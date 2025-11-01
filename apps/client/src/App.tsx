import { Outlet } from '@tanstack/react-router'
import { AppInit } from '@/components/app-init'
import { TrpcProvider } from '@/providers/trpc-provider'

// Import test utilities in development
if (import.meta.env.DEV) {
  import('@/test/utils/database-test')
}

export function App() {
  return (
    <TrpcProvider>
      <AppInit>
        <div className="min-h-screen bg-background">
          <Outlet />
        </div>
      </AppInit>
    </TrpcProvider>
  )
}
