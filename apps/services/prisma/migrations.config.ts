/**
 * Database Migration Configuration
 * 配置数据库迁移的行为和选项
 */

export const migrationConfig = {
  // 迁移文件命名规则
  naming: {
    // 使用时间戳前缀
    timestamp: true,
    // 格式: YYYYMMDD_HHMMSS_migration_name
    format: 'datetime_name',
    // 分隔符
    separator: '_',
  },

  // 迁移策略
  strategy: {
    // 自动应用迁移（生产环境应为 false）
    autoApply: false,
    // 在应用启动前验证迁移
    validateOnStart: true,
    // 自动生成迁移（开发环境）
    autoGenerate: false,
  },

  // 数据库配置
  database: {
    // 迁移表名
    migrationsTable: '_prisma_migrations',
    // 迁移文件路径
    migrationsPath: './prisma/migrations',
    // 是否启用迁移锁
    enableLock: true,
  },

  // 种子数据配置
  seeding: {
    // 自动运行种子（开发环境）
    autoSeed: false,
    // 种子数据文件路径
    seedFilePath: './prisma/seed.ts',
    // 是否在生产环境运行种子
    seedInProduction: false,
  },

  // 回滚配置
  rollback: {
    // 是否启用回滚功能
    enabled: true,
    // 最大回滚步数
    maxRollbackSteps: 10,
    // 回滚备份表
    backupTable: '_prisma_migrations_backup',
  },

  // 验证配置
  validation: {
    // 验证迁移文件语法
    validateSyntax: true,
    // 检查迁移顺序
    checkOrder: true,
    // 验证数据库连接
    checkConnection: true,
  },

  // 日志配置
  logging: {
    // 记录迁移执行时间
    logExecutionTime: true,
    // 记录 SQL 语句
    logSql: false,
    // 记录详细的迁移信息
    verbose: false,
  },

  // 环境特定配置
  environments: {
    development: {
      autoApply: true,
      autoGenerate: true,
      autoSeed: true,
      logSql: true,
      verbose: true,
    },
    test: {
      autoApply: true,
      autoSeed: true,
      validateOnStart: true,
      logSql: false,
      verbose: false,
    },
    staging: {
      autoApply: false,
      autoGenerate: false,
      autoSeed: false,
      validateOnStart: true,
      logSql: false,
      verbose: false,
    },
    production: {
      autoApply: false,
      autoGenerate: false,
      autoSeed: false,
      validateOnStart: true,
      logSql: false,
      verbose: false,
    },
  },

  // 错误处理
  errorHandling: {
    // 迁移失败时是否回滚
    rollbackOnFailure: false,
    // 重试次数
    retryAttempts: 3,
    // 重试间隔（毫秒）
    retryDelay: 1000,
  },

  // 性能配置
  performance: {
    // 批处理大小
    batchSize: 1000,
    // 超时时间（毫秒）
    timeout: 30000,
    // 并发连接数
    maxConnections: 5,
  },
}

/**
 * 获取当前环境的配置
 */
export function getEnvironmentConfig() {
  const env = process.env.NODE_ENV || 'development'
  return (
    migrationConfig.environments[
      env as keyof typeof migrationConfig.environments
    ] || migrationConfig.environments.development
  )
}

/**
 * 验证迁移配置
 */
export function validateMigrationConfig(): boolean {
  try {
    const config = getEnvironmentConfig()

    // 基本验证
    if (!migrationConfig.database.migrationsPath) {
      throw new Error('Migrations path is required')
    }

    if (!migrationConfig.database.migrationsTable) {
      throw new Error('Migrations table name is required')
    }

    return true
  } catch (error) {
    console.error('Migration configuration validation failed:', error)
    return false
  }
}
