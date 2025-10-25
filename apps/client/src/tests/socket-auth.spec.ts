/**
 * Socket Authentication Test - TDD Task 9
 *
 * 此测试验证Socket连接的认证集成功能
 * 按照TDD方法，此测试首先会失败（因为认证功能尚未实现）
 * 然后我们实现认证功能使测试通过
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSocketStore } from '@/stores/socket-store'
import { useAuthStore } from '@/stores/auth-store'
import { createSocketService } from '@/lib/socket/socket-service'

// Mock auth store
vi.mock('@/stores/auth-store')

describe('Socket Authentication Integration', () => {
  const mockUseAuthStore = vi.mocked(useAuthStore)
  const mockUseSocketStore = vi.mocked(useSocketStore)

  beforeEach(() => {
    vi.clearAllMocks()

    // Default auth store mock
    mockUseAuthStore.mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn(),
    })

    // Reset socket store
    if (useSocketStore.getState) {
      useSocketStore.getState().reset?.()
    }
  })

  describe('Unauthenticated Connection', () => {
    it('should not connect socket when user is not authenticated', async () => {
      // 测试：用户未认证时不应连接Socket
      mockUseAuthStore.mockReturnValue({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
      })

      const { result } = renderHook(() => useSocketStore())

      await act(async () => {
        await result.current.connect()
      })

      expect(result.current.isConnected).toBe(false)
      expect(result.current.connectionError).toBeInstanceOf(Error)
      expect(result.current.connectionError?.message).toContain(
        'Authentication required'
      )
    })

    it('should handle connection attempts without token', async () => {
      // 测试：应该处理没有token的连接尝试
      mockUseAuthStore.mockReturnValue({
        user: { id: 'user1', email: 'test@example.com' },
        token: null,
        isLoading: false,
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
      })

      const { result } = renderHook(() => useSocketStore())

      await act(async () => {
        await result.current.connect()
      })

      expect(result.current.isConnected).toBe(false)
      expect(result.current.connectionError).toBeInstanceOf(Error)
    })
  })

  describe('Authenticated Connection', () => {
    it('should connect socket with valid auth token', async () => {
      // 测试：应该使用有效认证token连接Socket
      const mockToken = 'valid-jwt-token'
      mockUseAuthStore.mockReturnValue({
        user: { id: 'user1', email: 'test@example.com' },
        token: mockToken,
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
      })

      const { result } = renderHook(() => useSocketStore())

      await act(async () => {
        await result.current.connect()
      })

      expect(result.current.isConnected).toBe(true)
      expect(result.current.connectionError).toBe(null)
    })

    it('should disconnect socket when user logs out', async () => {
      // 测试：用户登出时应该断开Socket连接
      const mockToken = 'valid-jwt-token'
      mockUseAuthStore.mockReturnValue({
        user: { id: 'user1', email: 'test@example.com' },
        token: mockToken,
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
      })

      const { result } = renderHook(() => useSocketStore())

      // 先连接
      await act(async () => {
        await result.current.connect()
      })
      expect(result.current.isConnected).toBe(true)

      // 模拟登出
      mockUseAuthStore.mockReturnValue({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
      })

      // 断开连接
      await act(async () => {
        result.current.disconnect()
      })

      expect(result.current.isConnected).toBe(false)
    })
  })

  describe('Token Refresh', () => {
    it('should handle token refresh during active connection', async () => {
      // 测试：应该在活跃连接期间处理token刷新
      const oldToken = 'old-jwt-token'
      const newToken = 'new-jwt-token'

      // 初始状态
      mockUseAuthStore.mockReturnValue({
        user: { id: 'user1', email: 'test@example.com' },
        token: oldToken,
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
      })

      const { result } = renderHook(() => useSocketStore())

      // 连接
      await act(async () => {
        await result.current.connect()
      })
      expect(result.current.isConnected).toBe(true)

      // 模拟token刷新
      mockUseAuthStore.mockReturnValue({
        user: { id: 'user1', email: 'test@example.com' },
        token: newToken,
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
      })

      // 连接应该仍然有效
      expect(result.current.isConnected).toBe(true)
    })

    it('should reconnect when token expires', async () => {
      // 测试：token过期时应该重新连接
      const expiredToken = 'expired-jwt-token'
      const freshToken = 'fresh-jwt-token'

      // 使用过期token
      mockUseAuthStore.mockReturnValue({
        user: { id: 'user1', email: 'test@example.com' },
        token: expiredToken,
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
      })

      const { result } = renderHook(() => useSocketStore())

      await act(async () => {
        await result.current.connect()
      })

      // 模拟token过期错误
      await act(async () => {
        result.current.disconnect()
      })

      // 使用新token重新连接
      mockUseAuthStore.mockReturnValue({
        user: { id: 'user1', email: 'test@example.com' },
        token: freshToken,
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
      })

      await act(async () => {
        await result.current.connect()
      })

      expect(result.current.isConnected).toBe(true)
    })
  })

  describe('Authentication Events', () => {
    it('should emit auth event on successful connection', async () => {
      // 测试：成功连接时应该发送认证事件
      const mockToken = 'valid-jwt-token'
      mockUseAuthStore.mockReturnValue({
        user: { id: 'user1', email: 'test@example.com' },
        token: mockToken,
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
      })

      const { result } = renderHook(() => useSocketStore())

      let authEventFired = false
      let authEventData = null

      await act(async () => {
        await result.current.connect()
      })

      const socketService = result.current.socketService
      if (socketService) {
        socketService.on('authenticate', (data: any) => {
          authEventFired = true
          authEventData = data
        })
      }

      expect(authEventFired).toBe(true)
      expect(authEventData).toMatchObject({
        userId: 'user1',
        token: mockToken,
      })
    })

    it('should handle auth error events', async () => {
      // 测试：应该处理认证错误事件
      const invalidToken = 'invalid-jwt-token'
      mockUseAuthStore.mockReturnValue({
        user: { id: 'user1', email: 'test@example.com' },
        token: invalidToken,
        isLoading: false,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        refreshToken: vi.fn(),
      })

      const { result } = renderHook(() => useSocketStore())

      let authErrorEventFired = false
      let errorMessage = null

      await act(async () => {
        await result.current.connect()
      })

      const socketService = result.current.socketService
      if (socketService) {
        socketService.on('auth_error', (error: any) => {
          authErrorEventFired = true
          errorMessage = error.message
        })
      }

      expect(authErrorEventFired).toBe(true)
      expect(errorMessage).toContain('authentication')
    })
  })
})
