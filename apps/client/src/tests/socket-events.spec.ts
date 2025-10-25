/**
 * Socket Events Test - TDD Task 7
 *
 * 此测试验证Socket基本事件处理功能
 * 按照TDD方法，此测试首先会失败（因为事件处理逻辑尚未实现）
 * 然后我们实现事件处理使测试通过
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSocketStore } from '../stores/socket-store'
import { createSocketService } from '../lib/socket/socket-service'

describe('Socket Events Handling', () => {
  beforeEach(() => {
    // 清理store状态
    if (useSocketStore.getState) {
      useSocketStore.getState().reset?.()
    }
  })

  describe('Connection Events', () => {
    it('should handle connect event', async () => {
      // 测试：应该处理连接事件
      const { result } = renderHook(() => useSocketStore())

      // 监听连接事件
      let connectEventFired = false
      const mockSocketService = createSocketService()

      mockSocketService.on('connect', () => {
        connectEventFired = true
      })

      // 连接
      await act(async () => {
        await result.current.connect()
      })

      expect(result.current.isConnected).toBe(true)
      expect(connectEventFired).toBe(true)
    })

    it('should handle disconnect event', async () => {
      // 测试：应该处理断开连接事件
      const { result } = renderHook(() => useSocketStore())

      // 先连接
      await act(async () => {
        await result.current.connect()
      })
      expect(result.current.isConnected).toBe(true)

      // 监听断开连接事件
      let disconnectEventFired = false
      const mockSocketService = result.current.socketService

      if (mockSocketService) {
        mockSocketService.on('disconnect', () => {
          disconnectEventFired = true
        })
      }

      // 断开连接
      await act(async () => {
        result.current.disconnect()
      })

      expect(result.current.isConnected).toBe(false)
      expect(disconnectEventFired).toBe(true)
    })

    it('should handle connect_error event', async () => {
      // 测试：应该处理连接错误事件
      const { result } = renderHook(() => useSocketStore())

      // 监听连接错误事件
      let connectErrorEventFired = false
      let errorData: Error | null = null

      // 使用无效URL连接
      await act(async () => {
        await result.current.connect('http://localhost:9999')
      })

      expect(result.current.isConnected).toBe(false)
      expect(result.current.connectionError).toBeInstanceOf(Error)
      expect(result.current.isConnecting).toBe(false)
    })
  })

  describe('Message Events', () => {
    it('should handle custom message events', async () => {
      // 测试：应该处理自定义消息事件
      const { result } = renderHook(() => useSocketStore())

      // 连接
      await act(async () => {
        await result.current.connect()
      })

      // 监听自定义事件
      let messageReceived = null
      const mockSocketService = result.current.socketService

      if (mockSocketService) {
        mockSocketService.on('test-message', (data: any) => {
          messageReceived = data
        })

        // 发送测试消息
        mockSocketService.emit('test-message', { hello: 'world' })
      }

      expect(messageReceived).toEqual({ hello: 'world' })
    })

    it('should handle AI processing status events', async () => {
      // 测试：应该处理AI处理状态事件
      const { result } = renderHook(() => useSocketStore())

      // 连接
      await act(async () => {
        await result.current.connect()
      })

      // 监听AI处理状态事件
      let statusReceived = null
      const mockSocketService = result.current.socketService

      if (mockSocketService) {
        mockSocketService.on('ai-processing-status', (data: any) => {
          statusReceived = data
        })

        // 发送AI状态消息
        mockSocketService.emit('ai-processing-status', {
          noteId: 'test-note',
          status: 'processing',
          progress: 50,
        })
      }

      expect(statusReceived).toEqual({
        noteId: 'test-note',
        status: 'processing',
        progress: 50,
      })
    })
  })

  describe('Event Listeners Management', () => {
    it('should properly add and remove event listeners', async () => {
      // 测试：应该正确添加和移除事件监听器
      const { result } = renderHook(() => useSocketStore())

      // 连接
      await act(async () => {
        await result.current.connect()
      })

      const mockSocketService = result.current.socketService
      if (mockSocketService) {
        let eventCount = 0
        const eventHandler = () => {
          eventCount++
        }

        // 添加监听器
        mockSocketService.on('test-event', eventHandler)
        mockSocketService.emit('test-event')
        expect(eventCount).toBe(1)

        // 移除监听器
        mockSocketService.off('test-event', eventHandler)
        mockSocketService.emit('test-event')
        expect(eventCount).toBe(1) // 应该没有增加
      }
    })

    it('should handle multiple listeners for same event', async () => {
      // 测试：应该处理同一事件的多个监听器
      const { result } = renderHook(() => useSocketStore())

      // 连接
      await act(async () => {
        await result.current.connect()
      })

      const mockSocketService = result.current.socketService
      if (mockSocketService) {
        let count1 = 0
        let count2 = 0

        const handler1 = () => count1++
        const handler2 = () => count2++

        // 添加多个监听器
        mockSocketService.on('multi-event', handler1)
        mockSocketService.on('multi-event', handler2)

        // 触发事件
        mockSocketService.emit('multi-event')

        expect(count1).toBe(1)
        expect(count2).toBe(1)
      }
    })
  })

  describe('Error Handling in Events', () => {
    it('should handle errors in event handlers gracefully', async () => {
      // 测试：应该优雅处理事件处理器中的错误
      const { result } = renderHook(() => useSocketStore())

      // 连接
      await act(async () => {
        await result.current.connect()
      })

      const mockSocketService = result.current.socketService
      if (mockSocketService) {
        // 添加会抛出错误的处理器
        mockSocketService.on('error-event', () => {
          throw new Error('Test error in handler')
        })

        // 添加正常处理器
        let normalHandlerCalled = false
        mockSocketService.on('error-event', () => {
          normalHandlerCalled = true
        })

        // 触发事件，不应该导致整个应用崩溃
        expect(() => {
          mockSocketService.emit('error-event')
        }).not.toThrow()

        // 正常处理器应该仍然被调用
        expect(normalHandlerCalled).toBe(true)
      }
    })
  })
})
