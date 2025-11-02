import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import { type AppRouter } from '../../../services/src/router'
import { authService } from '@/lib/database/auth-service'
import { configService } from '@/lib/database/config-service'

// 创建 tRPC React hook
export const trpc = createTRPCReact<AppRouter>()

// 获取认证token的函数
async function getAuthToken(): Promise<string | null> {
  try {
    // 从 IndexedDB 获取 token (使用现有的 auth service)
    const authData = await authService.getAuthData()
    return authData?.accessToken || null
  } catch (error) {
    console.error('Failed to get auth token from IndexedDB:', error)
    return null
  }
}

// 获取动态URL的函数
async function getTrpcUrl(): Promise<string> {
  try {
    const baseUrl = await configService.getApiBaseUrl()
    return `${baseUrl}/api/v1/trpc`
  } catch (error) {
    console.warn('Failed to get API base URL from config, using default', error)
    return 'http://localhost:9168/api/v1/trpc'
  }
}

// 创建 tRPC 客户端链接
const links = [
  httpBatchLink({
    url: async () => await getTrpcUrl(), // 动态获取后端服务地址
    headers: async () => {
      const token = await getAuthToken()
      return token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}
    },
  }),
]

// 导出类型和链接
export type { AppRouter }
export { links }
