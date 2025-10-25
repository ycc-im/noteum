/**
 * Socket Service - Basic Socket.io Connection
 *
 * 提供基本的Socket.io连接功能，指向现有的WebsocketGateway
 * 不修改后端服务器配置，仅实现客户端连接逻辑
 */

import { io, Socket } from 'socket.io-client'

export interface SocketServiceConfig {
  url: string
  timeout: number
  autoConnect?: boolean
  transports?: ('polling' | 'websocket')[]
  auth?: {
    token: string
  }
}

export interface SocketService {
  connect(): Promise<void>
  disconnect(): void
  isConnected(): boolean
  on(event: string, callback: (...args: any[]) => void): void
  off(event: string, callback?: (...args: any[]) => void): void
  emit(event: string, ...args: any[]): void
  getServerUrl(): string
  getConfig(): SocketServiceConfig
}

class SocketServiceImpl implements SocketService {
  private socket: Socket | null = null
  private config: SocketServiceConfig
  private connectionPromise: Promise<void> | null = null
  private eventHandlers: Map<string, Function[]> = new Map()

  constructor(url: string, config: Partial<SocketServiceConfig> = {}) {
    this.config = {
      url,
      timeout: 5000,
      autoConnect: false,
      transports: ['polling', 'websocket'],
      ...config,
    }

    this.socket = io(this.config.url, {
      autoConnect: this.config.autoConnect,
      timeout: this.config.timeout,
      transports: this.config.transports,
      auth: this.config.auth,
    })

    // 设置内部事件监听器，用于转发到自定义处理器
    this.setupInternalEventHandlers()
  }

  private setupInternalEventHandlers(): void {
    if (!this.socket) return

    // 转发socket.io事件到自定义处理器
    this.socket.onAny((event: string, ...args: any[]) => {
      const handlers = this.eventHandlers.get(event)
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(...args)
          } catch (error) {
            console.error(`Error in event handler for ${event}:`, error)
          }
        })
      }
    })
  }

  async connect(): Promise<void> {
    if (!this.socket) {
      throw new Error('Socket instance not initialized')
    }

    // 如果已经在连接中，返回现有的Promise
    if (this.connectionPromise) {
      return this.connectionPromise
    }

    // 如果已经连接，直接返回
    if (this.socket.connected) {
      return
    }

    // 创建连接Promise
    this.connectionPromise = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.connectionPromise = null
        reject(new Error('Connection timeout'))
      }, this.config.timeout)

      const onConnect = () => {
        clearTimeout(timeoutId)
        this.connectionPromise = null
        resolve()
      }

      const onError = (error: any) => {
        clearTimeout(timeoutId)
        this.connectionPromise = null
        reject(error)
      }

      // 监听连接事件
      this.socket!.once('connect', onConnect)
      this.socket!.once('connect_error', onError)

      // 开始连接
      this.socket!.connect()
    })

    return this.connectionPromise
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.connectionPromise = null
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)!.push(callback)
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      const handlers = this.eventHandlers.get(event)
      if (handlers) {
        const index = handlers.indexOf(callback)
        if (index > -1) {
          handlers.splice(index, 1)
        }
        if (handlers.length === 0) {
          this.eventHandlers.delete(event)
        }
      }
    } else {
      this.eventHandlers.delete(event)
    }
  }

  emit(event: string, ...args: any[]): void {
    if (this.socket) {
      this.socket.emit(event, ...args)
    }

    // 同时触发本地事件处理器（用于测试）
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(...args)
        } catch (error) {
          console.error(`Error in local event handler for ${event}:`, error)
        }
      })
    }
  }

  getServerUrl(): string {
    return this.config.url
  }

  getConfig(): SocketServiceConfig {
    return { ...this.config }
  }
}

/**
 * 创建Socket服务实例
 *
 * @param url 服务器URL，默认为 http://localhost:9168
 * @param config 可选配置
 * @returns SocketService实例
 */
export function createSocketService(
  url?: string,
  config?: Partial<SocketServiceConfig>
): SocketService {
  const serverUrl = url || 'http://localhost:9168'
  return new SocketServiceImpl(serverUrl, config)
}

// 导出默认实例，使用默认配置
export const socketService = createSocketService()
