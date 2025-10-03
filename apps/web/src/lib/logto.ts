import { LogtoConfig } from '@logto/react'

// Logto configuration factory function
export const getLogtoConfig = (): LogtoConfig => {
  // Helper function to get current origin (safe for SSR)
  const getCurrentOrigin = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    // Fallback for SSR
    return 'http://localhost:3001'
  }

  return {
    endpoint: import.meta.env.VITE_LOGTO_ENDPOINT || 'https://auth.xiajia.im',
    appId: import.meta.env.VITE_LOGTO_APP_ID || '',
    resources: [
      // API resource identifier if needed
      import.meta.env.VITE_LOGTO_API_RESOURCE,
    ].filter(Boolean),
    scopes: [
      // OpenID Connect scopes
      'openid',
      'profile',
      'email',
      // Custom API scopes if needed
      'read:notes',
      'write:notes',
    ],
    // Callback URLs - use environment variables with fallback
    redirectUri:
      import.meta.env.VITE_LOGTO_REDIRECT_URI ||
      `${getCurrentOrigin()}/auth/callback`,
    postLogoutRedirectUri:
      import.meta.env.VITE_LOGTO_POST_LOGOUT_REDIRECT_URI || getCurrentOrigin(),
  }
}

// Static config for environments that specify all URLs
export const logtoConfig: LogtoConfig = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT || 'https://auth.xiajia.im',
  appId: import.meta.env.VITE_LOGTO_APP_ID || '',
  resources: [import.meta.env.VITE_LOGTO_API_RESOURCE].filter(Boolean),
  scopes: ['openid', 'profile', 'email', 'read:notes', 'write:notes'],
  // Use environment variables directly
  redirectUri:
    import.meta.env.VITE_LOGTO_REDIRECT_URI ||
    'http://localhost:3001/auth/callback',
  postLogoutRedirectUri:
    import.meta.env.VITE_LOGTO_POST_LOGOUT_REDIRECT_URI ||
    'http://localhost:3001',
}
