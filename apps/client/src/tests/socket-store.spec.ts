/**
 * Socket Store Test - TDD Task 4
 *
 * 此测试验证Socket连接状态管理
 * 按照TDD方法，此测试首先会失败（因为socket-store不存在）
 * 然后我们实现socket-store使测试通过
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createSocketService } from '../lib/socket/socket-service'
import { useSocketStore } from '../stores/socket-store'

describe('Socket Store', () => {
  beforeEach(() => {
    // 清理store状态
    if (useSocketStore.getState) {
      useSocketStore.getState().reset?.()
    }
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      // 测试：应该有正确的初始状态
      const { result } = renderHook(() => useSocketStore())

      expect(result.current.isConnected).toBe(false)
      expect(result.current.isConnecting).toBe(false)
      expect(result.current.connectionError).toBe(null)
      expect(result.current.lastConnectionTime).toBe(null)
      expect(typeof result.current.connect).toBe('function')
      expect(typeof result.current.disconnect).toBe('function')
      expect(typeof result.current.reset).toBe('function')
    })
  })

  describe('Connection Management', () => {
    it('should update connection status when connecting', async () => {
      // 测试：连接时应该更新连接状态
      const { result } = renderHook(() => useSocketStore())

      // 初始状态
      expect(result.current.isConnected).toBe(false)
      expect(result.current.isConnecting).toBe(false)

      // 开始连接
      await act(async () => {
        await result.current.connect()
      })

      // 连接后状态
      expect(result.current.isConnected).toBe(true)
      expect(result.current.isConnecting).toBe(false)
      expect(result.current.connectionError).toBe(null)
      expect(result.current.lastConnectionTime).toBeInstanceOf(Date)
    })

    it('should update connection status when disconnecting', async () => {
      // 测试：断开连接时应该更新状态
      const { result } = renderHook(() => useSocketStore())

      // 先连接
      await act(async () => {
        await result.current.connect()
      })
      expect(result.current.isConnected).toBe(true)

      // 断开连接
      await act(async () => {
        result.current.disconnect()
      })

      // 断开后状态
      expect(result.current.isConnected).toBe(false)
      expect(result.current.isConnecting).toBe(false)
      expect(result.current.connectionError).toBe(null)
    })

    it('should handle connection errors', async () => {
      // 测试：应该处理连接错误
      const { result } = renderHook(() => useSocketStore())

      // 使用无效URL连接
      await act(async () => {
        await result.current.connect('http://localhost:9999')
      })

      expect(result.current.isConnected).toBe(false)
      expect(result.current.isConnecting).toBe(false)
      expect(result.current.connectionError).toBeInstanceOf(Error)
    })
  })

  describe('State Persistence', () => {
    it('should maintain state across hook instances', async () => {
      // 测试：应该在hook实例间保持状态

      // 第一个hook实例
      const { result: result1 } = renderHook(() => useSocketStore())

      // 连接
      await act(async () => {
        await result1.current.connect()
      })
      expect(result1.current.isConnected).toBe(true)

      // 第二个hook实例应该看到相同的状态
      const { result: result2 } = renderHook(() => useSocketStore())
      expect(result2.current.isConnected).toBe(true)
      expect(result2.current.lastConnectionTime).toEqual(
        result1.current.lastConnectionTime
      )

      // 在第二个实例中断开
      await act(async () => {
        result2.current.disconnect()
      })

      // 第一个实例应该看到更新的状态
      expect(result1.current.isConnected).toBe(false)
    })
  })

  describe('Reset Functionality', () => {
    it('should reset store to initial state', async () => {
      // 测试：应该重置store到初始状态
      const { result } = renderHook(() => useSocketStore())

      // 先连接产生状态变化
      await act(async () => {
        await result.current.connect()
      })
      expect(result.current.isConnected).toBe(true)
      expect(result.current.lastConnectionTime).toBeTruthy()

      // 重置
      await act(async () => {
        result.current.reset()
      })

      // 验证重置后的状态
      expect(result.current.isConnected).toBe(false)
      expect(result.current.isConnecting).toBe(false)
      expect(result.current.connectionError).toBe(null)
      expect(result.current.lastConnectionTime).toBe(null)
    })
  })

  describe('Reactive Updates', () => {
    it('should update state reactively', async () => {
      // 测试：状态应该响应式更新
      const { result } = renderHook(() => useSocketStore())

      // 初始状态
      expect(result.current.isConnected).toBe(false)

      // 连接应该更新状态
      await act(async () => {
        await result.current.connect()
      })

      expect(result.current.isConnected).toBe(true)
      expect(result.current.lastConnectionTime).toBeInstanceOf(Date)

      // 断开应该更新状态
      await act(async () => {
        result.current.disconnect()
      })

      expect(result.current.isConnected).toBe(false)
    })
  })
})
