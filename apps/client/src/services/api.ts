import { LoginRequest, LoginResponse, RefreshTokenRequest } from '@/types/user'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9168'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      )
    }

    return response.json()
  }

  // 认证相关 API - 使用 tRPC
  async login(data: LoginRequest): Promise<LoginResponse> {
    // 将用户名转换为用户名格式，因为 tRPC 支持用户名登录
    const username = data.username.includes('@')
      ? data.username.split('@')[0]
      : data.username

    const response = await this.request<{
      result: {
        data: {
          json: {
            success: boolean
            data: LoginResponse
          }
        }
      }
    }>('/api/v1/trpc/auth.login', {
      method: 'POST',
      body: JSON.stringify({
        json: {
          username,
          password: data.password,
        },
      }),
    })

    if (!response.result.data.json.success) {
      throw new Error('Login failed')
    }

    return response.result.data.json.data
  }

  async refreshToken(data: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await this.request<{
      result: {
        data: {
          json: {
            success: boolean
            data: LoginResponse
          }
        }
      }
    }>('/api/v1/trpc/auth.refreshToken', {
      method: 'POST',
      body: JSON.stringify({
        json: {
          refreshToken: data.refreshToken,
        },
      }),
    })

    if (!response.result.data.json.success) {
      throw new Error('Token refresh failed')
    }

    return response.result.data.json.data
  }

  async getCurrentUser(_accessToken: string): Promise<any> {
    // 暂时返回一个简单的用户信息，后续可以实现获取当前用户的 API
    return Promise.resolve({})
  }

  async logout(accessToken: string): Promise<void> {
    await this.request('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }

  // 健康检查
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/trpc/health')
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export default apiClient
