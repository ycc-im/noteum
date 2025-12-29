import type {
  AuthClientConfig,
  AuthClientMethods,
  SignInOptions,
  SignUpOptions,
  SignOutOptions,
  RefreshTokenOptions,
  GetSessionOptions,
} from './types'
import type { AuthSession } from '../core/database-adapter.interface'

export function createAuthClient(
  config: AuthClientConfig = {}
): AuthClientMethods {
  const baseURL =
    config.baseURL ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000')

  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${baseURL}/api/auth${path}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Request failed')
    }

    return response.json()
  }

  return {
    async signIn(options: SignInOptions): Promise<AuthSession> {
      return request<{ session: AuthSession }>('/sign-in/email', {
        method: 'POST',
        body: JSON.stringify({
          email: options.email,
          password: options.password,
          username: options.username,
        }),
      }).then((res) => res.session)
    },

    async signUp(options: SignUpOptions): Promise<AuthSession> {
      return request<{ session: AuthSession }>('/sign-up/email', {
        method: 'POST',
        body: JSON.stringify({
          email: options.email,
          password: options.password,
          username: options.username,
          name: options.name,
        }),
      }).then((res) => res.session)
    },

    async signOut(options?: SignOutOptions): Promise<void> {
      const params = new URLSearchParams()
      if (options?.allDevices) {
        params.set('all', 'true')
      }

      await request(`/sign-out${params ? `?${params}` : ''}`, {
        method: 'POST',
      })
    },

    async refreshToken(options: RefreshTokenOptions): Promise<AuthSession> {
      return request<{ session: AuthSession }>('/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: options.refreshToken,
        }),
      }).then((res) => res.session)
    },

    async getSession(options?: GetSessionOptions): Promise<AuthSession | null> {
      const params = new URLSearchParams()
      if (options?.force) {
        params.set('force', 'true')
      }

      try {
        const res = await request<{ session: AuthSession | null }>(
          `/get-session${params ? `?${params}` : ''}`
        )
        return res.session
      } catch {
        return null
      }
    },
  }
}
