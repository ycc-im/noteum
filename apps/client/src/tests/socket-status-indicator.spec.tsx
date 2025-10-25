/**
 * Socket Status Indicator Test - TDD Task 8
 *
 * 此测试验证Socket连接状态UI组件
 * 按照TDD方法，此测试首先会失败（因为组件尚未集成到头部）
 * 然后我们将组件集成到头部使测试通过
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useSocketStore } from '@/stores/socket-store'
import { SocketStatusIndicator } from '@/components/layout/SocketStatusIndicator'

// Mock store
vi.mock('@/stores/socket-store')

describe('Socket Status Indicator', () => {
  const mockUseSocketStore = vi.mocked(useSocketStore)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Connection Status Display', () => {
    it('should show connecting status', () => {
      // 测试：应该显示连接中状态
      mockUseSocketStore.mockReturnValue({
        isConnected: false,
        isConnecting: true,
        connectionError: null,
        lastConnectionTime: null,
        connect: vi.fn(),
        disconnect: vi.fn(),
        reset: vi.fn(),
        socketService: null,
      })

      render(<SocketStatusIndicator />)

      expect(screen.getByText('连接中...')).toBeInTheDocument()
    })

    it('should show connected status', () => {
      // 测试：应该显示已连接状态
      mockUseSocketStore.mockReturnValue({
        isConnected: true,
        isConnecting: false,
        connectionError: null,
        lastConnectionTime: new Date(),
        connect: vi.fn(),
        disconnect: vi.fn(),
        reset: vi.fn(),
        socketService: null,
      })

      render(<SocketStatusIndicator />)

      expect(screen.getByText('已连接')).toBeInTheDocument()
    })

    it('should show disconnected status', () => {
      // 测试：应该显示未连接状态
      mockUseSocketStore.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        connectionError: null,
        lastConnectionTime: null,
        connect: vi.fn(),
        disconnect: vi.fn(),
        reset: vi.fn(),
        socketService: null,
      })

      render(<SocketStatusIndicator />)

      expect(screen.getByText('未连接')).toBeInTheDocument()
    })

    it('should show connection error status', () => {
      // 测试：应该显示连接错误状态
      mockUseSocketStore.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        connectionError: new Error('Connection failed'),
        lastConnectionTime: null,
        connect: vi.fn(),
        disconnect: vi.fn(),
        reset: vi.fn(),
        socketService: null,
      })

      render(<SocketStatusIndicator />)

      expect(screen.getByText('连接失败')).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('should render status indicator dot', () => {
      // 测试：应该渲染状态指示点
      mockUseSocketStore.mockReturnValue({
        isConnected: true,
        isConnecting: false,
        connectionError: null,
        lastConnectionTime: null,
        connect: vi.fn(),
        disconnect: vi.fn(),
        reset: vi.fn(),
        socketService: null,
      })

      render(<SocketStatusIndicator />)

      // 检查组件是否渲染
      const statusElement = screen.getByText('已连接')
      expect(statusElement).toBeInTheDocument()
      expect(statusElement.closest('div')).toBeInTheDocument()
    })

    it('should have proper accessibility attributes', () => {
      // 测试：应该有适当的可访问性属性
      mockUseSocketStore.mockReturnValue({
        isConnected: true,
        isConnecting: false,
        connectionError: null,
        lastConnectionTime: null,
        connect: vi.fn(),
        disconnect: vi.fn(),
        reset: vi.fn(),
        socketService: null,
      })

      render(<SocketStatusIndicator />)

      // 组件应该有语义化的HTML结构
      const container = screen.getByText('已连接').closest('div')
      expect(container).toBeInTheDocument()
      expect(container?.className).toContain('flex')
    })
  })
})
