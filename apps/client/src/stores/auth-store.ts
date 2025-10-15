import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean

  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      set => ({
        // Initial state
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        // Actions
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null })
          try {
            // TODO: Implement actual login API call
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
              throw new Error('Login failed')
            }

            const { user, token } = await response.json()
            set({ user, token, isAuthenticated: true })
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Login failed' })
          } finally {
            set({ isLoading: false })
          }
        },

        logout: () => {
          set({ user: null, token: null, isAuthenticated: false })
        },

        refreshToken: async () => {
          // TODO: Implement token refresh
        },

        updateProfile: async (_data: Partial<User>) => {
          // TODO: Implement profile update
        },

        clearError: () => set({ error: null }),
        setLoading: loading => set({ isLoading: loading }),
      }),
      {
        name: 'auth-store',
        partialize: state => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
)