import type { AuthUser, AuthSession } from '../core/database-adapter.interface'

export interface AuthClientConfig {
  baseURL?: string
}

export interface SignInOptions {
  email: string
  password: string
  username?: string
}

export interface SignUpOptions {
  email: string
  password: string
  username?: string
  name?: string
}

export interface SignOutOptions {
  allDevices?: boolean
}

export interface RefreshTokenOptions {
  refreshToken: string
}

export interface GetSessionOptions {
  force?: boolean
}

export interface AuthClientMethods {
  signIn(options: SignInOptions): Promise<AuthSession>
  signUp(options: SignUpOptions): Promise<AuthSession>
  signOut(options?: SignOutOptions): Promise<void>
  refreshToken(options: RefreshTokenOptions): Promise<AuthSession>
  getSession(options?: GetSessionOptions): Promise<AuthSession | null>
}
