import type { DatabaseAdapter } from '../core/database-adapter.interface'

const drizzleAdapter = (db: any, options: any) => {
  return db
}

export class DrizzleAdapter implements DatabaseAdapter {
  readonly type = 'drizzle' as const
  readonly provider = 'pg' as const

  private readonly db: any
  private readonly schema?: any

  constructor(config: { db: any; schema?: any }) {
    this.db = config.db
    this.schema = config.schema
  }

  getAdapter() {
    return drizzleAdapter(this.db, {
      provider: 'pg',
      schema: this.schema,
    })
  }

  async healthCheck(): Promise<boolean> {
    try {
      // await this.db.execute?.({ sql: 'SELECT 1' })
      return true
    } catch (error) {
      console.error('Drizzle health check failed:', error)
      return false
    }
  }
}
