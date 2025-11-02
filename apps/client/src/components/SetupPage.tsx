import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { configService } from '@/lib/database/config-service'
import { useNavigate } from '@tanstack/react-router'

export const SetupPage: React.FC = () => {
  const [apiBaseUrl, setApiBaseUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setIsLoading(true)
      const url = await configService.getApiBaseUrl()
      setApiBaseUrl(url)
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

      await configService.setApiBaseUrl(apiBaseUrl.trim())
      setSuccess('配置保存成功！即将跳转到主页...')

      // 2秒后跳转到主页
      setTimeout(() => {
        navigate({ to: '/' })
      }, 2000)
    } catch (err) {
      setError('保存配置失败')
      console.error('Failed to save config:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestConnection = async () => {
    try {
      setError('')
      setSuccess('')

      if (!apiBaseUrl.trim()) {
        setError('请先输入API地址')
        return
      }

      // 测试连接 - 简单的可达性检查
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      let response
      try {
        response = await fetch(`${apiBaseUrl.trim()}/api/v1/trpc`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            json: {},
          }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
      } catch (err) {
        clearTimeout(timeoutId)
        if (err.name === 'AbortError') {
          setError('连接超时，请检查地址是否正确')
        } else {
          throw err
        }
        return
      }

      if (response.ok) {
        setSuccess('连接测试成功！')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(`连接测试失败: ${response.status}`)
      }
    } catch (err) {
      setError('连接测试失败，请检查地址是否正确')
      console.error('Failed to test connection:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="text-sm text-muted-foreground">正在加载配置...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo和标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            欢迎使用 Noteum
          </h1>
          <p className="text-muted-foreground">请配置后端API服务器地址</p>
        </div>

        {/* 配置卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">初始配置</CardTitle>
            <CardDescription className="text-center">
              输入您的后端API服务器地址以继续
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                className="w-full p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
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

            <div className="space-y-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full"
                size="lg"
              >
                {isSaving ? '保存中...' : '保存并继续'}
              </Button>

              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isSaving}
                className="w-full"
              >
                测试连接
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 帮助信息 */}
        <div className="text-center space-y-2 text-sm text-muted-foreground">
          <p>• 默认地址为 http://localhost:9168</p>
          <p>• 如果后端服务在其他服务器上，请输入相应的地址</p>
          <p>• 首次使用需要配置后才能正常使用应用</p>
        </div>
      </div>
    </div>
  )
}

export default SetupPage
