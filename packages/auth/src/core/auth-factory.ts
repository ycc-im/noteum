import { betterAuth } from 'better-auth'
import type { DatabaseAdapter } from './database-adapter.interface'

export interface AuthConfig {
  databaseAdapter: DatabaseAdapter
  secret: string
  baseURL: string
  trustedOrigins?: string[]
  session?: {
    expiresIn?: number
    updateAge?: number
  }
  emailVerification?: {
    enabled?: boolean
    sendVerificationEmail?: (data: { user: any; url: string }) => Promise<void>
  }
  passwordReset?: {
    sendResetEmail?: (data: { user: any; url: string }) => Promise<void>
  }
}

export function createAuth(config: AuthConfig) {
  return betterAuth({
    database: config.databaseAdapter.getAdapter(),
    secret: config.secret,
    baseURL: config.baseURL,
    trustedOrigins: config.trustedOrigins || [],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: config.emailVerification?.enabled || false,
      sendResetPassword: config.passwordReset?.sendResetEmail,
    },
    session: {
      expiresIn: config.session?.expiresIn || 60 * 60 * 24 * 7,
      updateAge: config.session?.updateAge || 60 * 60 * 24,
    },
    plugins: [],
  })
}

export type AuthInstance = ReturnType<typeof createAuth>
