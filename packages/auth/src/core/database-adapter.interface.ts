export interface DatabaseAdapter {
  getAdapter(): any
  healthCheck(): Promise<boolean>
}

export interface AuthUser {
  id: string
  email: string
  emailVerified: boolean
  name?: string
  username?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  id: string
  userId: string
  token: string
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
  user: AuthUser
}
