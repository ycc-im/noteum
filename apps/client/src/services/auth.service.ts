import { apiClient } from './api'
import { useAuthStore } from '@/stores/auth'

export class AuthService {
  /**
   * 用户登录
   */
  async login(username: string, password: string) {
    const authStore = useAuthStore.getState()

    try {
      await authStore.setLoading(true)

      const response = await apiClient.login({ username, password })

      // 保存认证信息到 store - 转换为完整的 User 类型
      const fullUser = {
        ...response.user,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }

      await authStore.login({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: fullUser,
      })

      return response
    } catch (error) {
      await authStore.setLoading(false)
      throw error
    }
  }

  /**
   * 用户登出
   */
  async logout() {
    const authStore = useAuthStore.getState()
    const accessToken = authStore.accessToken

    try {
      // 调用后端登出接口（可选）
      if (accessToken) {
        await apiClient.logout(accessToken)
      }
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      // 无论 API 调用是否成功，都清除本地状态
      await authStore.logout()
    }
  }

  /**
   * 刷新访问令牌
   */
  async refreshAccessToken() {
    const authStore = useAuthStore.getState()
    const refreshToken = authStore.refreshToken

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await apiClient.refreshToken({ refreshToken })

      // 更新认证信息 - 转换为完整的 User 类型
      const fullUser = response.user
        ? {
            ...response.user,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
          }
        : authStore.user

      await authStore.login({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: fullUser,
      })

      return response.accessToken
    } catch (error) {
      // 刷新失败，清除认证状态
      await authStore.logout()
      throw error
    }
  }

  /**
   * 获取当前访问令牌
   */
  getAccessToken(): string | null {
    return useAuthStore.getState().accessToken
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated
  }

  /**
   * 获取当前用户
   */
  getCurrentUser() {
    return useAuthStore.getState().user
  }
}

// 导出单例实例
export const authService = new AuthService()
