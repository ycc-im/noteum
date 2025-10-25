/**
 * Socket Store - Connection State Management
 *
 * 使用Zustand管理Socket连接状态
 * 只实现连接状态管理，不包含重连逻辑
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createSocketService, SocketService } from '@/lib/socket/socket-service'
import { useAuthStore } from './auth-store'

export interface SocketStoreState {
  // 连接状态
  isConnected: boolean
  isConnecting: boolean
  connectionError: Error | null
  lastConnectionTime: Date | null

  // Socket服务实例
  socketService: SocketService | null

  // Actions
  connect: (url?: string) => Promise<void>
  disconnect: () => void
  reset: () => void
}

interface SocketStoreActions {
  setConnecting: (isConnecting: boolean) => void
  setConnected: (isConnected: boolean) => void
  setConnectionError: (error: Error | null) => void
  setLastConnectionTime: (time: Date | null) => void
  setSocketService: (service: SocketService | null) => void
}

type SocketStore = SocketStoreState & SocketStoreActions

const initialState = {
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  lastConnectionTime: null,
  socketService: null,
}

export const useSocketStore = create<SocketStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions
      setConnecting: (isConnecting: boolean) =>
        set({ isConnecting }, false, 'setConnecting'),

      setConnected: (isConnected: boolean) =>
        set({ isConnected }, false, 'setConnected'),

      setConnectionError: (connectionError: Error | null) =>
        set({ connectionError }, false, 'setConnectionError'),

      setLastConnectionTime: (lastConnectionTime: Date | null) =>
        set({ lastConnectionTime }, false, 'setLastConnectionTime'),

      setSocketService: (socketService: SocketService | null) =>
        set({ socketService }, false, 'setSocketService'),

      connect: async (url?: string) => {
        const state = get()
        const authStore = useAuthStore.getState()

        // 检查认证状态
        if (!authStore || !authStore.isAuthenticated || !authStore.token) {
          set(
            {
              isConnected: false,
              isConnecting: false,
              connectionError: new Error(
                'Authentication required - Please login first'
              ),
            },
            false,
            'connect:auth-failed'
          )
          return
        }

        // 如果已经在连接中，不重复连接
        if (state.isConnecting) {
          return
        }

        // 如果已经连接，直接返回
        if (state.isConnected && state.socketService) {
          return
        }

        try {
          // 设置连接中状态
          set(
            {
              isConnecting: true,
              connectionError: null,
            },
            false,
            'connect:start'
          )

          // 创建或获取Socket服务，包含认证token
          const socketService = url
            ? createSocketService(url, { auth: { token: authStore.token } })
            : state.socketService ||
              createSocketService(undefined, {
                auth: { token: authStore.token },
              })

          // 设置Socket事件监听器
          socketService.on('connect', () => {
            set(
              {
                isConnected: true,
                isConnecting: false,
                connectionError: null,
                lastConnectionTime: new Date(),
                socketService,
              },
              false,
              'connect:success'
            )

            // 发送认证事件
            socketService.emit('authenticate', {
              userId: authStore.user?.id,
              token: authStore.token,
            })
          })

          socketService.on('disconnect', () => {
            set(
              {
                isConnected: false,
                isConnecting: false,
              },
              false,
              'disconnect'
            )
          })

          socketService.on('connect_error', (error: Error) => {
            set(
              {
                isConnected: false,
                isConnecting: false,
                connectionError: error,
              },
              false,
              'connect:error'
            )
          })

          // 认证相关事件
          socketService.on('authenticate', (data: any) => {
            console.log('Socket authenticated:', data)
          })

          socketService.on('auth_error', (error: any) => {
            console.error('Socket authentication error:', error)
            set(
              {
                isConnected: false,
                isConnecting: false,
                connectionError: new Error(
                  `Authentication failed: ${error.message}`
                ),
              },
              false,
              'auth:error'
            )
          })

          // 开始连接
          await socketService.connect()

          // 如果同步连接成功，更新状态
          if (socketService.isConnected()) {
            set(
              {
                isConnected: true,
                isConnecting: false,
                connectionError: null,
                lastConnectionTime: new Date(),
                socketService,
              },
              false,
              'connect:immediate-success'
            )
          }
        } catch (error) {
          set(
            {
              isConnected: false,
              isConnecting: false,
              connectionError: error as Error,
            },
            false,
            'connect:catch-error'
          )
        }
      },

      disconnect: () => {
        const { socketService } = get()

        if (socketService) {
          socketService.disconnect()
        }

        set(
          {
            isConnected: false,
            isConnecting: false,
          },
          false,
          'disconnect'
        )
      },

      reset: () => {
        const { socketService } = get()

        if (socketService) {
          socketService.disconnect()
        }

        set(initialState, false, 'reset')
      },
    }),
    {
      name: 'socket-store',
    }
  )
)

// 导出选择器以便在其他组件中使用
export const useSocketConnectionStatus = () =>
  useSocketStore((state) => ({
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    connectionError: state.connectionError,
  }))

export const useSocketActions = () =>
  useSocketStore((state) => ({
    connect: state.connect,
    disconnect: state.disconnect,
    reset: state.reset,
  }))

export const useSocketService = () =>
  useSocketStore((state) => state.socketService)
