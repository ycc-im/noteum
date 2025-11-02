import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import { configService } from '@/lib/database/config-service'
import { useNavigate } from '@tanstack/react-router'

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const [apiBaseUrl, setApiBaseUrl] = useState('')
  const [currentConfigUrl, setCurrentConfigUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingUrl, setPendingUrl] = useState('')
  const [isClearingData, setIsClearingData] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setIsLoading(true)
      const url = await configService.getApiBaseUrl()
      setApiBaseUrl(url)
      setCurrentConfigUrl(url)
      setError('')
    } catch (err) {
      setError('加载配置失败')
      console.error('Failed to load config:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError('')
      setSuccess('')

      // 验证URL格式
      if (!apiBaseUrl.trim()) {
        setError('API地址不能为空')
        return
      }

      // 简单的URL格式验证
      const urlPattern = /^https?:\/\/.+/
      if (!urlPattern.test(apiBaseUrl.trim())) {
        setError('请输入有效的URL地址，格式如：http://localhost:9168')
        return
      }

      // 检查是否与当前配置不同
      const currentUrl = await configService.getApiBaseUrl()
      if (currentUrl !== apiBaseUrl.trim()) {
        // URL发生变化，显示确认弹窗
        setPendingUrl(apiBaseUrl.trim())
        setShowConfirmDialog(true)
      }
    } catch (err) {
      setError('保存配置失败')
      console.error('Failed to save config:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirmSave = async () => {
    try {
      setIsClearingData(true)
      setError('')
      setSuccess('')

      // 清空所有数据
      await configService.clearAllData()

      // 保存新的API配置
      await configService.setApiBaseUrl(pendingUrl)

      // 更新本地状态
      setApiBaseUrl(pendingUrl)
      setCurrentConfigUrl(pendingUrl)
      setSuccess('配置已更新，所有本地数据已清空')
      setShowConfirmDialog(false)
      setPendingUrl('')

      // 3秒后清除成功消息
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('更新配置失败')
      console.error('Failed to update config:', err)
    } finally {
      setIsClearingData(false)
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground">加载配置中...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">设置</h1>
        <p className="text-muted-foreground">配置应用程序设置</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API配置</CardTitle>
          <CardDescription>配置后端API服务器地址</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiBaseUrl" className="text-sm font-medium">
              API服务器地址
            </label>
            <input
              id="apiBaseUrl"
              type="url"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              placeholder="http://localhost:9168"
              className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <p className="text-xs text-muted-foreground">
              请输入完整的API服务器地址，包括协议（http://或https://）
            </p>
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md border border-green-200">
              {success}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving || apiBaseUrl.trim() === currentConfigUrl}
              className="flex-1"
            >
              {isSaving ? '保存中...' : '保存配置'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• API服务器地址是后端服务的完整URL</p>
          <p>• 修改配置后，需要刷新页面才能生效</p>
          <p>• 默认地址为 http://localhost:9168</p>
          <p>• 如果后端服务在其他服务器上，请输入相应的地址</p>
        </CardContent>
      </Card>

      {/* 确认弹窗 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>⚠️ 确认更改 API 配置</DialogTitle>
            <DialogDescription>
              您即将更改 API 服务器地址，此操作将清空所有本地数据，包括：
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="font-medium text-yellow-800 mb-2">
                将清空的数据：
              </h4>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li>用户认证信息</li>
                <li>缓存数据</li>
                <li>配置设置</li>
                <li>其他本地存储的数据</li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700">
                <strong>新地址：</strong> {pendingUrl}
              </p>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">
                <strong>⚠️ 注意：</strong>
                此操作不可撤销，请确认您已备份重要数据。
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false)
                setPendingUrl('')
                setIsSaving(false)
              }}
              disabled={isClearingData}
            >
              取消
            </Button>
            <Button
              onClick={handleConfirmSave}
              disabled={isClearingData}
              className="bg-red-600 hover:bg-red-700"
            >
              {isClearingData ? '处理中...' : '确认更改'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SettingsPage
