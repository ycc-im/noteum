import Dexie, { type Table } from 'dexie'
import type {
  DatabaseSchema,
  DatabaseConnectionOptions,
  DatabaseError,
} from './types'

export class NoteumDatabase extends Dexie {
  auth!: Table<DatabaseSchema['auth']>
  cache!: Table<DatabaseSchema['cache']>

  constructor(_options: DatabaseConnectionOptions = {}) {
    super('noteum_database')

    // Define database schema
    this.version(1).stores({
      auth: '++id, accessToken, refreshToken, expiresAt, createdAt, updatedAt',
      cache: '++id, key, expiresAt, createdAt',
    })

    // Handle connection errors
    this.on('blocked', () => {
      console.warn('Database blocked - another connection might be open')
    })

    this.on('versionchange', () => {
      console.warn('Database version changed - closing connection')
      this.close()
    })
  }
}

// Create a singleton database instance
let dbInstance: NoteumDatabase | null = null

export const getDatabase = async (
  options?: DatabaseConnectionOptions
): Promise<NoteumDatabase> => {
  if (dbInstance) {
    return dbInstance
  }

  const { retryAttempts = 3, retryDelay = 1000 } = options || {}

  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      const db = new NoteumDatabase(options)
      await db.open()
      dbInstance = db
      return db
    } catch (error) {
      const dbError: DatabaseError = {
        name: 'DatabaseError',
        code: 'CONNECTION_FAILED',
        message: `Failed to connect to database (attempt ${attempt}/${retryAttempts})`,
        originalError:
          error instanceof Error ? error : new Error(String(error)),
      }

      console.error(dbError.message, error)

      if (attempt === retryAttempts) {
        throw dbError
      }

      // Exponential backoff
      const delay = retryDelay * Math.pow(2, attempt - 1)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new Error('Unexpected error in database connection')
}

export const closeDatabase = (): void => {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

// Utility function to check IndexedDB support
export const isIndexedDBSupported = (): boolean => {
  return (
    'indexedDB' in window &&
    indexedDB !== null &&
    typeof indexedDB.open === 'function'
  )
}

// Utility function to handle database errors consistently
export const handleDatabaseError = (error: unknown): DatabaseError => {
  if (error instanceof Error) {
    return {
      name: 'DatabaseError',
      code: 'OPERATION_FAILED',
      message: error.message,
      stack: error.stack,
      originalError: error,
    }
  }

  return {
    name: 'DatabaseError',
    code: 'UNKNOWN_ERROR',
    message: String(error),
    originalError: new Error(String(error)),
  }
}
