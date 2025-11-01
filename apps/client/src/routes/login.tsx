import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import apiClient from '@/services/api'
import { authService } from '@/lib/database/auth-service'
import { User } from '@/types/user'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    // 检查用户是否已登录
    const authData = await authService.getAuthData()
    if (authData?.accessToken) {
      // 如果已登录，重定向到 notes 页面
      throw redirect({
        to: '/notes',
      })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await apiClient.login(formData)

      // 存储认证信息到 IndexedDB - 转换为完整的 User 类型
      const fullUser: User = {
        ...response.user,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }

      await authService.storeAuthData(
        response.accessToken,
        response.refreshToken,
        fullUser
      )

      // 使用 TanStack Router 导航到 notes 页面
      router.navigate({ to: '/notes' })
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '8px',
            }}
          >
            登录到 Noteum
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            使用您的账户访问笔记应用
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <input
              name="username"
              type="text"
              placeholder="用户名"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px 6px 0 0',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <input
              name="password"
              type="password"
              placeholder="密码"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '0 0 6px 6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading ? '#9ca3af' : '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>
              测试账号: choufeng@noteum.dev / password
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
