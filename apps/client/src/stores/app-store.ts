import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  // UI State
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  loading: boolean
  error: string | null

  // User session
  isAuthenticated: boolean
  currentUser: unknown | null

  // Actions
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setCurrentUser: (user: unknown | null) => void
  clearError: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        sidebarOpen: true,
        theme: 'system',
        loading: false,
        error: null,
        isAuthenticated: false,
        currentUser: null,

        // Actions
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setTheme: (theme) => set({ theme }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        setAuthenticated: (authenticated) =>
          set({ isAuthenticated: authenticated }),
        setCurrentUser: (user) => set({ currentUser: user }),
        clearError: () => set({ error: null }),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          theme: state.theme,
          isAuthenticated: state.isAuthenticated,
          currentUser: state.currentUser,
        }),
      }
    )
  )
)
