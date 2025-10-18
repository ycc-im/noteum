import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/types'
import apiClient from '@/services/api'
import { authService } from '@/lib/database/auth-service'
import { migrationService } from '@/lib/database/migration'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  isInitialized: boolean

  // Actions
  initializeAuth: () => Promise<void>
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
        isInitialized: false,

        // Actions
        initializeAuth: async () => {
          set({ isLoading: true, error: null })

          try {
            // First, check and migrate any localStorage data
            await migrationService.checkAndMigrateAuthData()

            // Then load auth data from IndexedDB
            const authData = await authService.getAuthData()

            if (authData) {
              set({
                user: authData.user,
                token: authData.accessToken,
                refreshToken: authData.refreshToken,
                isAuthenticated: true,
                error: null,
                isInitialized: true,
              })
            } else {
              set({
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                error: null,
                isInitialized: true,
              })
            }
          } catch (error) {
            console.error('Auth initialization failed:', error)
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              error: 'Failed to initialize authentication',
              isInitialized: true,
            })
          } finally {
            set({ isLoading: false })
          }
        },

        login: async (username: string, password: string) => {
          set({ isLoading: true, error: null })
          try {
            const response = await apiClient.login({ username, password })

            // Store auth data in IndexedDB - convert response.user to full User type
            const fullUser: User = {
              ...response.user,
              createdAt: new Date(),
              updatedAt: new Date(),
              isActive: true,
            }

            await authService.storeAuthData(
              response.accessToken,
              response.refreshToken,
              fullUser
            )

            set({
              user: fullUser,
              token: response.accessToken,
              refreshToken: response.refreshToken,
              isAuthenticated: true,
              error: null,
            })

            // 登录成功后重定向到 dashboard
            window.location.href = '/dashboard'
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Login failed'
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
            // Clear auth data from IndexedDB
            await authService.clearAuthData()

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

            // Convert response.user to full User type
            const fullUser: User = {
              ...response.user,
              createdAt: new Date(),
              updatedAt: new Date(),
              isActive: true,
            }

            // Update auth data in IndexedDB
            await authService.updateAuthData(
              response.accessToken,
              response.refreshToken,
              fullUser
            )

            set({
              token: response.accessToken,
              refreshToken: response.refreshToken,
              user: fullUser,
              isAuthenticated: true,
            })
          } catch (error) {
            console.error('Token refresh failed:', error)
            // Clear auth data on refresh failure
            await authService.clearAuthData()
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
        setLoading: (loading) => set({ isLoading: loading }),

        checkAuthStatus: async () => {
          try {
            // Check auth status from IndexedDB
            const authData = await authService.getAuthData()

            if (!authData) {
              set({
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
              })
              return
            }

            // Token is still valid, update state
            set({
              user: authData.user,
              token: authData.accessToken,
              refreshToken: authData.refreshToken,
              isAuthenticated: true,
            })

            // Optionally verify with server
            try {
              const user = await apiClient.getCurrentUser(authData.accessToken)
              set({ user, isAuthenticated: true })
            } catch (error) {
              console.error('Server auth check failed:', error)
              // Token 可能已过期，尝试刷新
              await get().refreshAccessToken()
            }
          } catch (error) {
            console.error('Auth status check failed:', error)
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
            })
          }
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
)
