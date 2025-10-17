import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/types'
import apiClient from '@/services/api'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean

  // Actions
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
  checkAuthStatus: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        token: null,
        refreshToken: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        // Actions
        login: async (username: string, password: string) => {
          set({ isLoading: true, error: null })
          try {
            const response = await apiClient.login({ username, password })

            set({
              user: response.user,
              token: response.accessToken,
              refreshToken: response.refreshToken,
              isAuthenticated: true,
              error: null,
            })

            // 登录成功后重定向到 dashboard
            window.location.href = '/dashboard'
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed'
            set({ error: errorMessage, isAuthenticated: false })
          } finally {
            set({ isLoading: false })
          }
        },

        logout: async () => {
          const { token } = get()
          try {
            if (token) {
              await apiClient.logout(token)
            }
          } catch (error) {
            console.error('Logout error:', error)
          } finally {
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              error: null,
            })
            // 重定向到登录页面
            window.location.href = '/login'
          }
        },

        refreshAccessToken: async () => {
          const { refreshToken } = get()
          if (!refreshToken) {
            set({ isAuthenticated: false, token: null })
            return
          }

          try {
            const response = await apiClient.refreshToken({ refreshToken })
            set({
              token: response.accessToken,
              refreshToken: response.refreshToken,
              user: response.user,
              isAuthenticated: true,
            })
          } catch (error) {
            console.error('Token refresh failed:', error)
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
            })
          }
        },

        updateProfile: async (_data: Partial<User>) => {
          // TODO: Implement profile update
        },

        clearError: () => set({ error: null }),
        setLoading: loading => set({ isLoading: loading }),

        checkAuthStatus: async () => {
          const { token } = get()
          if (!token) {
            set({ isAuthenticated: false })
            return
          }

          try {
            const user = await apiClient.getCurrentUser(token)
            set({ user, isAuthenticated: true })
          } catch (error) {
            console.error('Auth status check failed:', error)
            // Token 可能已过期，尝试刷新
            await get().refreshAccessToken()
          }
        },
      }),
      {
        name: 'auth-store',
        partialize: state => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
)