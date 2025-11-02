import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const {
    isAuthenticated,
    token,
    isInitialized,
    initializeAuth,
    checkAuthStatus,
  } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Initialize auth on component mount
    if (!isInitialized) {
      initializeAuth()
    }
  }, [isInitialized, initializeAuth])

  useEffect(() => {
    // 如果没有认证信息且已初始化，先检查一次
    if (isInitialized && (!isAuthenticated || !token)) {
      checkAuthStatus()
    }
  }, [isInitialized, isAuthenticated, token, checkAuthStatus])

  useEffect(() => {
    // 检查认证状态并重定向（仅在初始化后）
    if (isInitialized && (!isAuthenticated || !token)) {
      router.navigate({ to: '/login' })
    }
  }, [isInitialized, isAuthenticated, token, router])

  // 如果未初始化，显示加载状态
  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '16px',
          color: '#666',
        }}
      >
        Loading...
      </div>
    )
  }

  // 如果未认证，返回空
  if (!isAuthenticated || !token) {
    return null
  }

  return <>{children}</>
}
