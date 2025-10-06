import { useEffect } from 'react'
import { useLogto } from '@logto/react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SearchParams {
  redirect?: string
}

/**
 * Login page component - redirects to Logto for authentication
 * Supports redirect parameter to specify where to go after login
 */
export default function Login() {
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

      signIn(redirectUri)
    }
  }, [isAuthenticated, isLoading, signIn, navigate, search.redirect])

  // Show loading state while checking authentication or redirecting
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">正在跳转到登录页面...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fallback UI (should rarely be seen due to automatic redirect)
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-96">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">登录到 Noteum</CardTitle>
          <CardDescription>
            正在跳转到安全登录页面...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const redirectUri = `${window.location.origin}/auth/callback`
                signIn(redirectUri)
              }
            }}
            className="w-full"
          >
            点击登录
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
