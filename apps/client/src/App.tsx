import { Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function App() {
  const { checkAuthStatus } = useAuthStore()

  useEffect(() => {
    // 应用启动时检查认证状态
    checkAuthStatus()
  }, [checkAuthStatus])

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}