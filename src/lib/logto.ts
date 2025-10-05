import { LogtoConfig } from '@logto/react'

// 检测是否在 Tauri 环境中运行
const isTauriEnvironment = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI__' in window
}

// 获取适当的回调 URI
const getRedirectUri = (): string => {
  // 如果环境变量已设置，优先使用
  if (import.meta.env.VITE_LOGTO_REDIRECT_URI) {
    return import.meta.env.VITE_LOGTO_REDIRECT_URI
  }

  // 根据 Tauri 环境自动选择
  if (isTauriEnvironment()) {
    // Tauri 生产环境使用自定义协议
    return 'noteum://auth/callback'
  } else {
    // Web 开发环境使用 localhost
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    return `${origin}/auth/callback`
  }
}

// 获取适当的登出重定向 URI
const getPostLogoutRedirectUri = (): string => {
  if (import.meta.env.VITE_LOGTO_POST_LOGOUT_REDIRECT_URI) {
    return import.meta.env.VITE_LOGTO_POST_LOGOUT_REDIRECT_URI
  }

  if (isTauriEnvironment()) {
    // Tauri 环境下，登出后重定向到应用首页
    return 'noteum://'
  } else {
    // Web 环境
    return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  }
}

// Logto configuration factory function
export const getLogtoConfig = (): LogtoConfig => {
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
    // 根据环境自动选择回调 URI
    redirectUri: getRedirectUri(),
    postLogoutRedirectUri: getPostLogoutRedirectUri(),
  }
}

// Static config for environments that specify all URLs
export const logtoConfig: LogtoConfig = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT || 'https://auth.xiajia.im',
  appId: import.meta.env.VITE_LOGTO_APP_ID || '',
  resources: [import.meta.env.VITE_LOGTO_API_RESOURCE].filter(Boolean),
  scopes: ['openid', 'profile', 'email', 'read:notes', 'write:notes'],
  // 使用动态配置确保在 Tauri 和 Web 环境中都能正常工作
  redirectUri: getRedirectUri(),
  postLogoutRedirectUri: getPostLogoutRedirectUri(),
}
