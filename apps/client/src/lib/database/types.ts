import { User } from '@/types/user'

export interface AuthTable {
  id?: number
  accessToken: string
  refreshToken: string
  user: User
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface CacheTable {
  id?: number
  key: string
  data: any
  expiresAt?: Date
  createdAt: Date
}

export interface ConfigTable {
  id?: number
  key: string
  value: any
  type: 'string' | 'number' | 'boolean' | 'object'
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseSchema {
  auth: AuthTable
  cache: CacheTable
  config: ConfigTable
}

export interface DatabaseConnectionOptions {
  retryAttempts?: number
  retryDelay?: number
  timeout?: number
}

export interface DatabaseError extends Error {
  name: 'DatabaseError'
  code: string
  originalError?: Error
}
