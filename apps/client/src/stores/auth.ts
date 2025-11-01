import { create } from 'zustand'
import type { User } from '@/types/user'
import { authService } from '@/lib/database/auth-service'

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthActions {
  login: (data: {
    accessToken: string
    refreshToken: string
    user: User
  }) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: Partial<User>) => void
}

export type AuthStore = AuthState & AuthActions

// 创建内存中的状态存储
let memoryState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
}

// 从 IndexedDB 初始化状态
const initializeAuthFromIndexedDB = async () => {
  try {
    const authData = await authService.getAuthData()
    if (authData) {
      memoryState = {
        user: authData.user,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        isAuthenticated: authData.isAuthenticated,
        isLoading: authData.isLoading,
      }
    }
  } catch (error) {
    console.error('Failed to initialize auth from IndexedDB:', error)
  }
}

// 初始化认证状态
initializeAuthFromIndexedDB()

export const useAuthStore = create<AuthStore>()((set, _get) => ({
  // State
  ...memoryState,

  // Actions
  login: async (data) => {
    const newState = {
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      isAuthenticated: true,
      isLoading: false,
    }

    // 更新内存状态
    memoryState = newState

    // 保存到 IndexedDB
    try {
      await authService.storeAuthData(
        newState.accessToken,
        newState.refreshToken,
        newState.user
      )
    } catch (error) {
      console.error('Failed to save auth data to IndexedDB:', error)
    }

    // 更新 Zustand 状态
    set(newState)
  },

  logout: async () => {
    const newState = {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    }

    // 更新内存状态
    memoryState = newState

    // 清除 IndexedDB
    try {
      await authService.clearAuthData()
    } catch (error) {
      console.error('Failed to clear auth data from IndexedDB:', error)
    }

    // 更新 Zustand 状态
    set(newState)
  },

  setLoading: async (loading) => {
    const newState = { ...memoryState, isLoading: loading }

    // 更新内存状态
    memoryState = newState

    // 保存到 IndexedDB
    try {
      await indexedDBService.saveAuthData(newState)
    } catch (error) {
      console.error('Failed to save loading state to IndexedDB:', error)
    }

    // 更新 Zustand 状态
    set({ isLoading: loading })
  },

  updateUser: async (userData) => {
    const currentUser = memoryState.user
    if (currentUser) {
      const newState = {
        ...memoryState,
        user: { ...currentUser, ...userData },
      }

      // 更新内存状态
      memoryState = newState

      // 保存到 IndexedDB
      try {
        await indexedDBService.saveAuthData(newState)
      } catch (error) {
        console.error('Failed to update user data in IndexedDB:', error)
      }

      // 更新 Zustand 状态
      set({ user: newState.user })
    }
  },
}))

// 添加一个方法来刷新状态从 IndexedDB
export const refreshAuthFromIndexedDB = async () => {
  try {
    const authData = await indexedDBService.getAuthData()
    if (authData) {
      memoryState = {
        user: authData.user,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        isAuthenticated: authData.isAuthenticated,
        isLoading: authData.isLoading,
      }
      useAuthStore.setState(memoryState)
    }
  } catch (error) {
    console.error('Failed to refresh auth from IndexedDB:', error)
  }
}

// Helper hooks
export const useAuth = () => {
  const auth = useAuthStore()
  return {
    ...auth,
    // Convenience getters
    isLoggedIn: auth.isAuthenticated && !!auth.accessToken,
    currentUser: auth.user,
  }
}

export const useIsAuthenticated = () => {
  return useAuthStore((state) => state.isAuthenticated)
}

export const useCurrentUser = () => {
  return useAuthStore((state) => state.user)
}
