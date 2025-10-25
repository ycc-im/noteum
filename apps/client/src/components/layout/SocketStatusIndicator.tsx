/**
 * Socket Connection Status Indicator
 *
 * 显示Socket连接状态的头部组件
 */

import { useSocketStore } from '@/stores/socket-store'

export function SocketStatusIndicator() {
  // 简化版本 - 先确保组件能显示
  let socketState: {
    isConnected: boolean
    isConnecting: boolean
    connectionError: Error | null
    lastConnectionTime: Date | null
  } = {
    isConnected: false,
    isConnecting: false,
    connectionError: null,
    lastConnectionTime: null,
  }

  try {
    socketState = useSocketStore()
  } catch (error) {
    console.error('Socket store error:', error)
  }

  const { isConnected, isConnecting, connectionError } = socketState

  const getStatusColor = () => {
    if (isConnecting) return 'bg-yellow-500'
    if (isConnected) return 'bg-green-500'
    if (connectionError) return 'bg-red-500'
    return 'bg-gray-500'
  }

  const getStatusText = () => {
    if (isConnecting) return '连接中...'
    if (isConnected) return '已连接'
    if (connectionError) return '连接失败'
    return '未连接'
  }

  // 临时调试：强制显示组件以便调试
  console.log('SocketStatusIndicator render:', socketState)

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-blue-500 shadow-lg">
      <div
        className={`w-3 h-3 rounded-full ${getStatusColor()} ${isConnected ? 'animate-pulse' : ''}`}
      />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {getStatusText()}
      </span>

      {/* 调试信息 */}
      <div className="text-xs text-gray-500">[{isConnected ? '✓' : '✗'}]</div>
    </div>
  )
}
