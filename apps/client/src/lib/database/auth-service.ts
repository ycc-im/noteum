import type { User } from '@/types/user'
import { getDatabase, handleDatabaseError, isIndexedDBSupported } from './index'
import type { AuthTable } from './types'

export interface AuthStorageData {
  accessToken: string
  refreshToken: string
  user: User
  expiresAt: Date
}

export class AuthService {
  private db = getDatabase()

  async storeAuthData(
    accessToken: string,
    refreshToken: string,
    user: User
  ): Promise<void> {
    try {
      if (!isIndexedDBSupported()) {
        throw new Error('IndexedDB is not supported in this browser')
      }

      const db = await this.db
      const now = new Date()

      // Calculate token expiration (JWT tokens typically expire in 1 hour)
      const tokenPayload = this.parseJWT(accessToken)
      const expiresAt = tokenPayload.exp
        ? new Date(tokenPayload.exp * 1000)
        : new Date(now.getTime() + 60 * 60 * 1000)

      // Clear existing auth data
      await db.auth.clear()

      // Store new auth data
      await db.auth.add({
        accessToken,
        refreshToken,
        user,
        expiresAt,
        createdAt: now,
        updatedAt: now,
      } as AuthTable)

      console.log('Auth data stored successfully in IndexedDB')
    } catch (error) {
      console.error('Failed to store auth data:', error)
      throw handleDatabaseError(error)
    }
  }

  async getAuthData(): Promise<AuthStorageData | null> {
    try {
      if (!isIndexedDBSupported()) {
        console.warn('IndexedDB is not supported, returning null')
        return null
      }

      const db = await this.db
      const authRecords = await db.auth.limit(1).toArray()

      if (authRecords.length === 0) {
        return null
      }

      const authRecord = authRecords[0] as AuthTable

      // Check if token has expired
      if (authRecord.expiresAt < new Date()) {
        console.log('Auth token has expired, cleaning up')
        await this.clearAuthData()
        return null
      }

      return {
        accessToken: authRecord.accessToken,
        refreshToken: authRecord.refreshToken,
        user: authRecord.user,
        expiresAt: authRecord.expiresAt,
      }
    } catch (error) {
      console.error('Failed to get auth data:', error)
      throw handleDatabaseError(error)
    }
  }

  async updateAuthData(
    accessToken: string,
    refreshToken: string,
    user: User
  ): Promise<void> {
    try {
      if (!isIndexedDBSupported()) {
        throw new Error('IndexedDB is not supported in this browser')
      }

      const db = await this.db
      const now = new Date()

      // Calculate token expiration
      const tokenPayload = this.parseJWT(accessToken)
      const expiresAt = tokenPayload.exp
        ? new Date(tokenPayload.exp * 1000)
        : new Date(now.getTime() + 60 * 60 * 1000)

      // Update existing auth data
      const existingRecords = await db.auth.limit(1).toArray()

      if (existingRecords.length > 0) {
        const existingRecord = existingRecords[0] as AuthTable
        await db.auth.update(existingRecord.id!, {
          accessToken,
          refreshToken,
          user,
          expiresAt,
          updatedAt: now,
        })
      } else {
        // If no existing record, create new one
        await db.auth.add({
          accessToken,
          refreshToken,
          user,
          expiresAt,
          createdAt: now,
          updatedAt: now,
        } as AuthTable)
      }

      console.log('Auth data updated successfully in IndexedDB')
    } catch (error) {
      console.error('Failed to update auth data:', error)
      throw handleDatabaseError(error)
    }
  }

  async clearAuthData(): Promise<void> {
    try {
      if (!isIndexedDBSupported()) {
        console.warn('IndexedDB is not supported, skipping cleanup')
        return
      }

      const db = await this.db
      await db.auth.clear()
      console.log('Auth data cleared from IndexedDB')
    } catch (error) {
      console.error('Failed to clear auth data:', error)
      throw handleDatabaseError(error)
    }
  }

  async isTokenExpired(): Promise<boolean> {
    try {
      const authData = await this.getAuthData()
      return authData ? authData.expiresAt < new Date() : true
    } catch (error) {
      console.error('Failed to check token expiration:', error)
      return true // Assume expired if we can't check
    }
  }

  async refreshTokenIfNeeded(): Promise<AuthStorageData | null> {
    try {
      const authData = await this.getAuthData()

      if (!authData) {
        return null
      }

      // Check if token is expired or will expire within 5 minutes
      const now = new Date()
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)

      if (authData.expiresAt < fiveMinutesFromNow) {
        console.log('Token is expired or will expire soon, refresh needed')
        // The actual refresh logic should be handled by the API client
        return null
      }

      return authData
    } catch (error) {
      console.error('Failed to check token refresh need:', error)
      return null
    }
  }

  // Utility method to parse JWT payload
  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Failed to parse JWT token:', error)
      return {}
    }
  }

  // Method to get database size for monitoring
  async getDatabaseSize(): Promise<number> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate()
        return estimate.usage || 0
      }
      return 0
    } catch (error) {
      console.error('Failed to get database size:', error)
      return 0
    }
  }

  // Method to cleanup expired data
  async cleanupExpiredData(): Promise<void> {
    try {
      const db = await this.db
      const now = new Date()

      // Clean up expired auth records
      await db.auth.where('expiresAt').below(now).delete()

      // Clean up expired cache records
      await db.cache.where('expiresAt').below(now).delete()

      console.log('Expired data cleanup completed')
    } catch (error) {
      console.error('Failed to cleanup expired data:', error)
      throw handleDatabaseError(error)
    }
  }
}

// Create singleton instance
export const authService = new AuthService()
