import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useHandleSignInCallback } from '@logto/react'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackPage,
})

/**
 * Callback page for handling Logto authentication response
 * Processes the authorization code and redirects to intended destination
 */
function AuthCallbackPage() {
  const navigate = useNavigate()

  // Use the correct Logto hook for handling sign-in callback
  const { isLoading } = useHandleSignInCallback(() => {
    console.log('Logto 登录回调处理完成')

    let redirectTo = '/' // default redirect to home

    // Extract redirect destination from URL state parameter (safe for SSR)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const state = urlParams.get('state')

      if (state) {
        try {
          const stateData = JSON.parse(state)
          if (stateData.redirect) {
            redirectTo = stateData.redirect
          }
        } catch (error) {
          console.warn('Failed to parse callback state:', error)
        }
      }
    }

    console.log('准备跳转到:', redirectTo)

    // Navigate to the intended destination
    setTimeout(() => {
      navigate({ to: redirectTo, replace: true })
    }, 500)
  })

  // Show loading while processing the callback
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            处理登录结果
          </h2>
          <p className="mt-2 text-gray-600">请稍候，正在验证您的身份...</p>
        </div>
      </div>
    )
  }

  // This should not be shown as the callback should handle redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">登录成功</h2>
        <p className="text-gray-600">正在跳转...</p>
      </div>
    </div>
  )
}
