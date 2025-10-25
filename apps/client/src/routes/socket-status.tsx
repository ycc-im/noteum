import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useSocketStore } from '@/stores/socket-store'
import { useAuthStore } from '@/stores/auth-store'
import { SocketStatusIndicator } from '@/components/layout/SocketStatusIndicator'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function SocketStatusPage() {
  const socketStore = useSocketStore()
  const authStore = useAuthStore()
  const [debugInfo, setDebugInfo] = useState<string>('')

  // 收集调试信息
  useEffect(() => {
    const info = {
      socketState: {
        isConnected: socketStore.isConnected,
        isConnecting: socketStore.isConnecting,
        connectionError: socketStore.connectionError?.message || null,
        lastConnectionTime:
          socketStore.lastConnectionTime?.toISOString() || null,
        socketServiceExists: !!socketStore.socketService,
      },
      authState: {
        isAuthenticated: authStore.isAuthenticated,
        hasToken: !!authStore.token,
        userExists: !!authStore.user,
        userId: authStore.user?.id || null,
      },
      environment: {
        frontendUrl: window.location.origin,
        socketUrl: 'http://localhost:9168',
        userAgent: navigator.userAgent,
      },
    }
    setDebugInfo(JSON.stringify(info, null, 2))
  }, [socketStore, authStore])

  const handleConnect = async () => {
    try {
      await socketStore.connect()
    } catch (error) {
      console.error('连接失败:', error)
    }
  }

  const handleDisconnect = () => {
    socketStore.disconnect()
  }

  const handleReset = () => {
    socketStore.reset()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Socket 状态测试页面</h1>
        <SocketStatusIndicator />
      </div>

      {/* 状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Socket 连接状态 */}
        <Card>
          <CardHeader>
            <CardTitle>Socket 连接状态</CardTitle>
            <CardDescription>当前Socket.io连接的状态信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>连接状态:</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  socketStore.isConnected
                    ? 'bg-green-100 text-green-800'
                    : socketStore.isConnecting
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {socketStore.isConnected
                  ? '已连接'
                  : socketStore.isConnecting
                    ? '连接中...'
                    : '未连接'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>最后连接时间:</span>
              <span className="text-sm text-gray-600">
                {socketStore.lastConnectionTime
                  ? new Date(
                      socketStore.lastConnectionTime
                    ).toLocaleTimeString()
                  : '从未连接'}
              </span>
            </div>

            {socketStore.connectionError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">
                  错误: {socketStore.connectionError.message}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleConnect}
                disabled={socketStore.isConnected || socketStore.isConnecting}
              >
                连接
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDisconnect}
                disabled={!socketStore.isConnected}
              >
                断开
              </Button>
              <Button size="sm" variant="ghost" onClick={handleReset}>
                重置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 认证状态 */}
        <Card>
          <CardHeader>
            <CardTitle>认证状态</CardTitle>
            <CardDescription>用户认证和token信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>认证状态:</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  authStore.isAuthenticated
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {authStore.isAuthenticated ? '已认证' : '未认证'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Token存在:</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  authStore.token
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {authStore.token ? '是' : '否'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>用户信息:</span>
              <span className="text-sm text-gray-600">
                {authStore.user ? authStore.user.email : '无'}
              </span>
            </div>

            <div className="text-xs text-gray-500">
              <p>用户ID: {authStore.user?.id || '无'}</p>
            </div>
          </CardContent>
        </Card>

        {/* 环境信息 */}
        <Card>
          <CardHeader>
            <CardTitle>环境信息</CardTitle>
            <CardDescription>开发和运行环境信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <p>
                <strong>前端地址:</strong>
              </p>
              <p className="text-gray-600">{window.location.origin}</p>
            </div>
            <div className="text-sm">
              <p>
                <strong>Socket服务:</strong>
              </p>
              <p className="text-gray-600">http://localhost:9168</p>
            </div>
            <div className="text-sm">
              <p>
                <strong>Socket客户端:</strong>
              </p>
              <p className="text-gray-600">
                {socketStore.socketService ? '已创建' : '未创建'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 调试信息 */}
      <Card>
        <CardHeader>
          <CardTitle>调试信息</CardTitle>
          <CardDescription>详细的Socket和认证状态调试信息</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {debugInfo}
          </pre>
        </CardContent>
      </Card>

      {/* 操作说明 */}
      <Card>
        <CardHeader>
          <CardTitle>操作说明</CardTitle>
          <CardDescription>如何使用这个测试页面</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>确保后端Socket服务运行在端口9168</li>
            <li>如果未认证，请先登录获取认证token</li>
            <li>点击"连接"按钮尝试建立Socket连接</li>
            <li>观察状态变化和调试信息</li>
            <li>如果遇到错误，查看错误信息和调试输出</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/socket-status')({
  component: SocketStatusPage,
})
