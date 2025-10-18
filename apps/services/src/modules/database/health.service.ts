import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { MigrationService } from './migration.service'
import { ConfigService } from '@nestjs/config'

export interface DatabaseHealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: Date
  connection: {
    status: 'connected' | 'disconnected' | 'error'
    responseTime?: number
    error?: string
  }
  migrations: {
    status: 'up-to-date' | 'pending' | 'error'
    pendingCount?: number
    lastMigration?: string
  }
  performance: {
    queryTime: number
    memoryUsage?: number
  }
}

@Injectable()
export class DatabaseHealthService {
  private readonly logger = new Logger(DatabaseHealthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly migrationService: MigrationService,
    private readonly configService: ConfigService
  ) {}

  /**
   * 执行完整的数据库健康检查
   */
  async checkHealth(): Promise<DatabaseHealthCheck> {
    const startTime = Date.now()

    const result: DatabaseHealthCheck = {
      status: 'healthy',
      timestamp: new Date(),
      connection: {
        status: 'connected',
      },
      migrations: {
        status: 'up-to-date',
      },
      performance: {
        queryTime: 0,
      },
    }

    try {
      // 检查数据库连接
      await this.checkConnection(result)

      // 检查迁移状态
      await this.checkMigrations(result)

      // 检查性能指标
      await this.checkPerformance(result, startTime)

      // 确定整体健康状态
      this.determineOverallHealth(result)

      return result
    } catch (error) {
      this.logger.error('Database health check failed', error)
      result.status = 'unhealthy'
      result.connection.status = 'error'
      result.connection.error =
        error instanceof Error ? error.message : String(error)
      return result
    }
  }

  /**
   * 检查数据库连接
   */
  private async checkConnection(result: DatabaseHealthCheck): Promise<void> {
    try {
      const startTime = Date.now()
      await this.prisma.$queryRaw`SELECT 1`
      const responseTime = Date.now() - startTime

      result.connection.status = 'connected'
      result.connection.responseTime = responseTime

      // 如果响应时间过长，标记为降级
      if (responseTime > 5000) {
        result.status = 'degraded'
      }
    } catch (error) {
      result.connection.status = 'error'
      result.connection.error =
        error instanceof Error ? error.message : String(error)
      result.status = 'unhealthy'
      throw error
    }
  }

  /**
   * 检查迁移状态
   */
  private async checkMigrations(result: DatabaseHealthCheck): Promise<void> {
    try {
      const migrationStatus = await this.migrationService.getMigrationStatus()

      if (migrationStatus.pendingMigrations.length > 0) {
        result.migrations.status = 'pending'
        result.migrations.pendingCount =
          migrationStatus.pendingMigrations.length

        // 在生产环境中，待执行的迁移会使数据库状态降级
        if (this.configService.get<string>('NODE_ENV') === 'production') {
          result.status =
            result.status === 'healthy' ? 'degraded' : result.status
        }
      } else {
        result.migrations.status = 'up-to-date'
        const lastMigration =
          migrationStatus.appliedMigrations[
            migrationStatus.appliedMigrations.length - 1
          ]
        if (lastMigration) {
          result.migrations.lastMigration = lastMigration.migration_name
        }
      }
    } catch (error) {
      result.migrations.status = 'error'
      this.logger.error('Migration status check failed', error)
    }
  }

  /**
   * 检查性能指标
   */
  private async checkPerformance(
    result: DatabaseHealthCheck,
    overallStartTime: number
  ): Promise<void> {
    try {
      const queryStartTime = Date.now()

      // 执行一些测试查询来检查性能
      await this.prisma.$queryRaw`
        SELECT COUNT(*) as user_count FROM "User" WHERE "isActive" = true
      `

      result.performance.queryTime = Date.now() - queryStartTime

      // 获取内存使用情况（如果可用）
      try {
        const memoryQuery = (await this.prisma.$queryRaw`
          SELECT pg_size_pretty(pg_database_size(current_database())) as database_size
        `) as Array<{ database_size: string }>

        // 这个信息主要用于日志记录
        if (memoryQuery[0]) {
          this.logger.debug(`Database size: ${memoryQuery[0].database_size}`)
        }
      } catch (memoryError) {
        // 内存查询失败不是致命错误
        this.logger.warn(
          'Could not fetch database size information',
          memoryError
        )
      }

      // 如果查询时间过长，标记为降级
      if (result.performance.queryTime > 2000) {
        result.status = result.status === 'healthy' ? 'degraded' : result.status
      }
    } catch (error) {
      this.logger.error('Performance check failed', error)
      result.status = 'unhealthy'
    }
  }

  /**
   * 确定整体健康状态
   */
  private determineOverallHealth(result: DatabaseHealthCheck): void {
    if (
      result.connection.status === 'error' ||
      result.migrations.status === 'error'
    ) {
      result.status = 'unhealthy'
    } else if (
      result.connection.status === 'disconnected' ||
      result.migrations.status === 'pending' ||
      result.performance.queryTime > 5000
    ) {
      result.status = 'degraded'
    } else {
      result.status = 'healthy'
    }
  }

  /**
   * 快速健康检查（用于负载均衡器）
   */
  async quickHealthCheck(): Promise<{ status: string; timestamp: Date }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return {
        status: 'healthy',
        timestamp: new Date(),
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date(),
      }
    }
  }

  /**
   * 获取数据库指标
   */
  async getMetrics(): Promise<{
    connectionCount: number
    activeConnections: number
    databaseSize: string
    cacheHitRatio?: number
  }> {
    try {
      const metrics = (await this.prisma.$queryRaw`
        SELECT
          COUNT(*) as connection_count,
          SUM(CASE WHEN state = 'active' THEN 1 ELSE 0 END) as active_connections
        FROM pg_stat_activity
        WHERE datname = current_database()
      `) as Array<{
        connection_count: bigint
        active_connections: bigint
      }>

      const sizeQuery = (await this.prisma.$queryRaw`
        SELECT pg_size_pretty(pg_database_size(current_database())) as database_size
      `) as Array<{ database_size: string }>

      return {
        connectionCount: Number(metrics[0]?.connection_count || 0),
        activeConnections: Number(metrics[0]?.active_connections || 0),
        databaseSize: sizeQuery[0]?.database_size || 'Unknown',
      }
    } catch (error) {
      this.logger.error('Failed to get database metrics', error)
      return {
        connectionCount: 0,
        activeConnections: 0,
        databaseSize: 'Unknown',
      }
    }
  }

  /**
   * 检查数据库是否就绪（用于启动检查）
   */
  async isReady(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      await this.migrationService.validateSchema()

      const migrationStatus = await this.migrationService.getMigrationStatus()
      return migrationStatus.pendingMigrations.length === 0
    } catch (error) {
      this.logger.error('Database readiness check failed', error)
      return false
    }
  }

  /**
   * 检查数据库是否存活（简单连接测试）
   */
  async isAlive(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      return false
    }
  }
}
