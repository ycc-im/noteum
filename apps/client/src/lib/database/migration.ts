import type { User } from '@/types/user'
import { authService } from './auth-service'
import { isIndexedDBSupported } from './index'

export interface LocalStorageAuthData {
  accessToken: string
  refreshToken: string
  user: User
}

export class MigrationService {
  private readonly AUTH_TOKEN_KEY = 'auth_token'
  private readonly REFRESH_TOKEN_KEY = 'refresh_token'
  private readonly USER_KEY = 'user'

  async checkAndMigrateAuthData(): Promise<boolean> {
    try {
      // Check if IndexedDB is supported
      if (!isIndexedDBSupported()) {
        console.warn('IndexedDB is not supported, skipping migration')
        return false
      }

      // Check if auth data already exists in IndexedDB
      const existingAuthData = await authService.getAuthData()
      if (existingAuthData) {
        console.log('Auth data already exists in IndexedDB, skipping migration')
        return true
      }

      // Check if there's auth data in localStorage
      const localStorageData = this.getLocalStorageAuthData()
      if (!localStorageData) {
        console.log('No auth data found in localStorage to migrate')
        return false
      }

      // Validate the localStorage data
      if (!this.validateAuthData(localStorageData)) {
        console.warn('Invalid auth data in localStorage, cleaning up')
        this.clearLocalStorageAuthData()
        return false
      }

      // Migrate data to IndexedDB
      await this.migrateToIndexedDB(localStorageData)

      // Clear localStorage after successful migration
      this.clearLocalStorageAuthData()

      console.log('Auth data migration completed successfully')
      return true
    } catch (error) {
      console.error('Migration failed:', error)
      return false
    }
  }

  private getLocalStorageAuthData(): LocalStorageAuthData | null {
    try {
      const accessToken = localStorage.getItem(this.AUTH_TOKEN_KEY)
      const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY)
      const userStr = localStorage.getItem(this.USER_KEY)

      if (!accessToken || !refreshToken || !userStr) {
        return null
      }

      const user = JSON.parse(userStr) as User

      return {
        accessToken,
        refreshToken,
        user,
      }
    } catch (error) {
      console.error('Failed to read auth data from localStorage:', error)
      return null
    }
  }

  private validateAuthData(data: LocalStorageAuthData): boolean {
    try {
      // Check basic structure
      if (!data.accessToken || !data.refreshToken || !data.user) {
        return false
      }

      // Check user object structure
      const user = data.user
      if (!user.id || !user.username || !user.email) {
        return false
      }

      // Check if tokens look like JWT (basic validation)
      const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
      if (!jwtRegex.test(data.accessToken)) {
        return false
      }

      return true
    } catch (error) {
      console.error('Auth data validation failed:', error)
      return false
    }
  }

  private async migrateToIndexedDB(data: LocalStorageAuthData): Promise<void> {
    try {
      await authService.storeAuthData(
        data.accessToken,
        data.refreshToken,
        data.user
      )
      console.log('Auth data migrated to IndexedDB successfully')
    } catch (error) {
      console.error('Failed to migrate auth data to IndexedDB:', error)
      throw error
    }
  }

  private clearLocalStorageAuthData(): void {
    try {
      localStorage.removeItem(this.AUTH_TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
      console.log('LocalStorage auth data cleared')
    } catch (error) {
      console.error('Failed to clear localStorage auth data:', error)
    }
  }

  // Method to rollback migration (for testing or error recovery)
  async rollbackMigration(): Promise<boolean> {
    try {
      const authData = await authService.getAuthData()
      if (!authData) {
        console.log('No auth data in IndexedDB to rollback')
        return false
      }

      // Store data back to localStorage
      localStorage.setItem(this.AUTH_TOKEN_KEY, authData.accessToken)
      localStorage.setItem(this.REFRESH_TOKEN_KEY, authData.refreshToken)
      localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user))

      // Clear IndexedDB
      await authService.clearAuthData()

      console.log('Migration rollback completed')
      return true
    } catch (error) {
      console.error('Migration rollback failed:', error)
      return false
    }
  }

  // Method to get migration status
  async getMigrationStatus(): Promise<{
    hasLocalStorageData: boolean
    hasIndexedDBData: boolean
    localStorageValid: boolean
    indexedDBValid: boolean
    needsMigration: boolean
  }> {
    const localStorageData = this.getLocalStorageAuthData()
    const indexedDBData = await authService.getAuthData()

    const localStorageValid = localStorageData
      ? this.validateAuthData(localStorageData)
      : false
    const indexedDBValid = !!indexedDBData

    const needsMigration = localStorageValid && !indexedDBValid

    return {
      hasLocalStorageData: !!localStorageData,
      hasIndexedDBData: !!indexedDBData,
      localStorageValid,
      indexedDBValid,
      needsMigration,
    }
  }

  // Method to log migration status for debugging
  async logMigrationStatus(): Promise<void> {
    const status = await this.getMigrationStatus()
    console.log('Migration Status:', {
      'Has localStorage data': status.hasLocalStorageData,
      'Has IndexedDB data': status.hasIndexedDBData,
      'LocalStorage data valid': status.localStorageValid,
      'IndexedDB data valid': status.indexedDBValid,
      'Needs migration': status.needsMigration,
    })
  }
}

// Create singleton instance
export const migrationService = new MigrationService()
