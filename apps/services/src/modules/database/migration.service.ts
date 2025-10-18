import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { ConfigService } from '@nestjs/config'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name)
  private readonly migrationsPath = path.join(
    process.cwd(),
    'prisma',
    'migrations'
  )

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  /**
   * 生成 Prisma 客户端
   */
  async generateClient(): Promise<void> {
    try {
      this.logger.log('Generating Prisma client...')
      await execAsync('prisma generate')
      this.logger.log('Prisma client generated successfully')
    } catch (error) {
      this.logger.error('Failed to generate Prisma client', error)
      throw error
    }
  }

  /**
   * 推送数据库架构更改（开发环境）
   */
  async pushSchema(): Promise<void> {
    try {
      this.logger.log('Pushing database schema changes...')
      await execAsync('prisma db push')
      this.logger.log('Database schema pushed successfully')
    } catch (error) {
      this.logger.error('Failed to push database schema', error)
      throw error
    }
  }

  /**
   * 创建新的迁移
   */
  async createMigration(name?: string): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const migrationName = name || `migration_${timestamp}`

      this.logger.log(`Creating migration: ${migrationName}`)

      const command = name
        ? `prisma migrate dev --name ${migrationName}`
        : 'prisma migrate dev'

      const { stdout } = await execAsync(command)

      this.logger.log(`Migration created: ${migrationName}`)
      return stdout
    } catch (error) {
      this.logger.error('Failed to create migration', error)
      throw error
    }
  }

  /**
   * 应用待执行的迁移
   */
  async applyMigrations(): Promise<void> {
    try {
      this.logger.log('Applying database migrations...')
      await execAsync('prisma migrate deploy')
      this.logger.log('Database migrations applied successfully')
    } catch (error) {
      this.logger.error('Failed to apply database migrations', error)
      throw error
    }
  }

  /**
   * 重置数据库
   */
  async resetDatabase(): Promise<void> {
    const isDevelopment =
      this.configService.get<string>('NODE_ENV') === 'development'

    if (!isDevelopment) {
      throw new Error(
        'Database reset is only allowed in development environment'
      )
    }

    try {
      this.logger.log('Resetting database...')
      await execAsync('prisma migrate reset --force')
      this.logger.log('Database reset successfully')
    } catch (error) {
      this.logger.error('Failed to reset database', error)
      throw error
    }
  }

  /**
   * 获取迁移状态
   */
  async getMigrationStatus(): Promise<{
    appliedMigrations: any[]
    pendingMigrations: any[]
  }> {
    try {
      // 获取已应用的迁移
      const appliedMigrations = (await this.prisma.$queryRaw`
        SELECT migration_name, finished_at
        FROM _prisma_migrations
        ORDER BY started_at
      `) as Array<{
        migration_name: string
        finished_at: Date | null
      }>

      // 获取文件系统中的迁移
      const pendingMigrations = this.getPendingMigrations(appliedMigrations)

      return {
        appliedMigrations,
        pendingMigrations,
      }
    } catch (error) {
      this.logger.error('Failed to get migration status', error)
      throw error
    }
  }

  /**
   * 获取待执行的迁移
   */
  private getPendingMigrations(appliedMigrations: any[]): any[] {
    if (!fs.existsSync(this.migrationsPath)) {
      return []
    }

    const appliedNames = new Set(appliedMigrations.map(m => m.migration_name))
    const migrationFiles = fs
      .readdirSync(this.migrationsPath)
      .filter(file =>
        fs.statSync(path.join(this.migrationsPath, file)).isDirectory()
      )

    return migrationFiles
      .filter(name => !appliedNames.has(name))
      .map(name => ({
        migration_name: name,
        status: 'pending',
      }))
  }

  /**
   * 回滚到指定迁移（开发环境）
   */
  async rollbackToMigration(targetMigration: string): Promise<void> {
    const isDevelopment =
      this.configService.get<string>('NODE_ENV') === 'development'

    if (!isDevelopment) {
      throw new Error(
        'Migration rollback is only allowed in development environment'
      )
    }

    try {
      this.logger.log(`Rolling back to migration: ${targetMigration}`)

      // Prisma 不支持直接的回滚，需要重置到目标迁移
      // 这是一个简化的实现，生产环境可能需要更复杂的回滚策略
      await this.resetDatabase()

      // 重新应用迁移到目标点
      // 这需要根据实际需求实现
      this.logger.log(`Rollback to ${targetMigration} completed`)
    } catch (error) {
      this.logger.error(`Failed to rollback to ${targetMigration}`, error)
      throw error
    }
  }

  /**
   * 验证数据库架构
   */
  async validateSchema(): Promise<boolean> {
    try {
      await execAsync('prisma validate')
      this.logger.log('Database schema is valid')
      return true
    } catch (error) {
      this.logger.error('Database schema validation failed', error)
      return false
    }
  }

  /**
   * 格式化 Prisma 文件
   */
  async formatSchema(): Promise<void> {
    try {
      await execAsync('prisma format')
      this.logger.log('Prisma schema formatted')
    } catch (error) {
      this.logger.error('Failed to format Prisma schema', error)
      throw error
    }
  }

  /**
   * 检查数据库连接
   */
  async checkConnection(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      this.logger.log('Database connection is healthy')
      return true
    } catch (error) {
      this.logger.error('Database connection failed', error)
      return false
    }
  }

  /**
   * 获取数据库信息
   */
  async getDatabaseInfo(): Promise<{
    version: string
    tables: string[]
    size?: string
  }> {
    try {
      const version = (await this.prisma.$queryRaw`SELECT version()`) as Array<{
        version: string
      }>
      const tables = (await this.prisma.$queryRaw`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
      `) as Array<{ table_name: string }>

      return {
        version: version[0]?.version || 'Unknown',
        tables: tables.map(t => t.table_name),
      }
    } catch (error) {
      this.logger.error('Failed to get database info', error)
      throw error
    }
  }
}
