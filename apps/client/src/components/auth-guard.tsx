import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token, checkAuthStatus } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // 如果没有认证信息，先检查一次
    if (!isAuthenticated || !token) {
      checkAuthStatus()
    }
  }, [isAuthenticated, token, checkAuthStatus])

  useEffect(() => {
    // 检查认证状态并重定向
    if (!isAuthenticated || !token) {
      router.navigate({ to: '/login' })
    }
  }, [isAuthenticated, token, router])

  // 如果未认证，返回空
  if (!isAuthenticated || !token) {
    return null
  }

  return <>{children}</>
}