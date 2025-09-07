import React from 'react'
import { useLogto } from '@logto/react'
import { useNavigate } from '@tanstack/react-router'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Route protection component that requires authentication
 * Redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useLogto()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Get current path for redirect after login
      const currentPath = window.location.pathname + window.location.search
      navigate({
        to: '/login',
        search: currentPath !== '/' ? { redirect: currentPath } : undefined
      })
    }
  }, [isLoading, isAuthenticated, navigate])

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">验证身份中...</p>
          </div>
        </div>
      )
    )
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null
  }

  // Render protected content
  return <>{children}</>
}