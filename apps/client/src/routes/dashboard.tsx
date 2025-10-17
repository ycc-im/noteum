import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/dashboard')({
  component: function Dashboard() {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
      // 从 localStorage 获取用户信息
      const userStr = localStorage.getItem('user')
      if (userStr) {
        setUser(JSON.parse(userStr))
      } else {
        // 如果没有用户信息，重定向到登录页
        window.location.href = '/login'
      }
    }, [])

    const handleLogout = () => {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    if (!user) {
      return <div>Loading...</div>
    }

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Dashboard
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Welcome, {user.displayName || user.username}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
            Welcome to Noteum Dashboard
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '8px' }}>
            🎉 You are successfully logged in!
          </p>
          <div style={{
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            padding: '16px',
            marginTop: '16px'
          }}>
            <p style={{ fontSize: '14px', color: '#374151', margin: '0' }}>
              <strong>User Details:</strong>
            </p>
            <ul style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 16px', paddingLeft: '20px' }}>
              <li>ID: {user.id}</li>
              <li>Username: {user.username}</li>
              <li>Email: {user.email}</li>
              <li>Role: {user.role}</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
})