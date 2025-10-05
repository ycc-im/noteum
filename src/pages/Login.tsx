import React, { useEffect } from 'react'
import { useLogto } from '@logto/react'
import { useNavigate, useSearch } from '@tanstack/react-router'

interface LoginProps {}

interface SearchParams {
  redirect?: string
}

/**
 * Login page component - redirects to Logto for authentication
 * Supports redirect parameter to specify where to go after login
 */
export default function Login(props: LoginProps) {
  const { signIn, isAuthenticated, isLoading } = useLogto()
  const navigate = useNavigate()
  const search = useSearch({ from: '/login' }) as SearchParams

  useEffect(() => {
    // If already authenticated, redirect to intended destination or dashboard
    if (isAuthenticated) {
      const redirectTo = search.redirect || '/dashboard'
      navigate({ to: redirectTo })
      return
    }

    // If not loading and not authenticated, initiate sign in
    if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
      const redirectUri = `${window.location.origin}/auth/callback`
      const state = search.redirect
        ? JSON.stringify({ redirect: search.redirect })
        : undefined

      signIn(redirectUri, state)
    }
  }, [isAuthenticated, isLoading, signIn, navigate, search.redirect])

  // Show loading state while checking authentication or redirecting
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在跳转到登录页面...</p>
        </div>
      </div>
    )
  }

  // Fallback UI (should rarely be seen due to automatic redirect)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登录到 Noteum
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            正在跳转到安全登录页面...
          </p>
        </div>
        <div className="text-center">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const redirectUri = `${window.location.origin}/auth/callback`
                const state = search.redirect
                  ? JSON.stringify({ redirect: search.redirect })
                  : undefined
                signIn(redirectUri, state)
              }
            }}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            点击登录
          </button>
        </div>
      </div>
    </div>
  )
}
