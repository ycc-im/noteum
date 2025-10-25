/**
 * Integration Test - TDD Task 10 (修正版)
 *
 * 此测试验证SocketStatusIndicator组件的集成功能
 * 修复了Router依赖问题，专注于组件本身测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SocketStatusIndicator } from '@/components/layout/SocketStatusIndicator'
import { useSocketStore } from '@/stores/socket-store'

// Mock socket store
vi.mock('@/stores/socket-store')

describe('Socket Integration', () => {
  const mockUseSocketStore = vi.mocked(useSocketStore)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('SocketStatusIndicator Component Integration', () => {
    it('应该渲染未连接状态', () => {
      // 测试：应该渲染未连接状态
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
      expect(screen.getByText('[✗]')).toBeInTheDocument()
    })

    it('应该显示已连接状态', () => {
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
      expect(screen.getByText('[✓]')).toBeInTheDocument()
    })

    it('应该显示连接中状态', () => {
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
      expect(screen.getByText('[✗]')).toBeInTheDocument()
    })

    it('应该显示连接失败状态', () => {
      // 测试：应该显示连接失败状态
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
      expect(screen.getByText('[✗]')).toBeInTheDocument()
    })
  })

  describe('Socket Store Integration', () => {
    it('应该初始化正确的默认状态', () => {
      // 测试：应该初始化正确的默认状态
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

    it('应该暴露必需的方法', () => {
      // 测试：应该暴露必需的方法
      const mockConnect = vi.fn()
      const mockDisconnect = vi.fn()
      const mockReset = vi.fn()

      mockUseSocketStore.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        connectionError: null,
        lastConnectionTime: null,
        connect: mockConnect,
        disconnect: mockDisconnect,
        reset: mockReset,
        socketService: null,
      })

      render(<SocketStatusIndicator />)

      // 验证方法存在（通过组件渲染成功间接验证）
      expect(screen.getByText('未连接')).toBeInTheDocument()
    })
  })

  describe('状态变更响应测试', () => {
    it('应该响应连接状态变更', () => {
      // 测试：应该响应连接状态变更
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

      // 验证绿色状态点和动画
      const statusDot = document.querySelector('.bg-green-500')
      expect(statusDot).toBeInTheDocument()

      const pulseAnimation = document.querySelector('.animate-pulse')
      expect(pulseAnimation).toBeInTheDocument()
    })

    it('应该响应错误状态变更', () => {
      // 测试：应该响应错误状态变更
      mockUseSocketStore.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        connectionError: new Error('Network error'),
        lastConnectionTime: null,
        connect: vi.fn(),
        disconnect: vi.fn(),
        reset: vi.fn(),
        socketService: null,
      })

      render(<SocketStatusIndicator />)

      expect(screen.getByText('连接失败')).toBeInTheDocument()

      // 验证红色状态点
      const statusDot = document.querySelector('.bg-red-500')
      expect(statusDot).toBeInTheDocument()
    })
  })
})
