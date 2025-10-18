#!/usr/bin/env node

/**
 * Database Migration CLI
 * 使用方法: node scripts/migration-cli.ts [command] [options]
 */

import { NestFactory } from '@nestjs/core'
import { AppModule } from '../src/app.module'
import { MigrationService } from '../src/modules/database/migration.service'
import { SeedingService } from '../src/modules/database/seeding.service'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'

const logger = new Logger('MigrationCLI')

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'], // 只显示重要日志
  })

  const migrationService = app.get(MigrationService)
  const seedingService = app.get(SeedingService)
  const configService = app.get(ConfigService)

  return { app, migrationService, seedingService, configService }
}

async function shutdown(app: any) {
  await app.close()
  process.exit(0)
}

async function main() {
  const command = process.argv[2]
  const args = process.argv.slice(3)

  if (!command) {
    showHelp()
    process.exit(1)
  }

  let app: any

  try {
    const context = await bootstrap()
    app = context.app
    const { migrationService, seedingService, configService } = context

    logger.log(`Executing command: ${command}`)

    switch (command) {
      case 'generate':
        await migrationService.generateClient()
        logger.log('✅ Prisma client generated')
        break

      case 'push':
        await migrationService.pushSchema()
        logger.log('✅ Schema pushed to database')
        break

      case 'migrate':
        const migrationName = args[0]
        const output = await migrationService.createMigration(migrationName)
        logger.log('✅ Migration created:')
        console.log(output)
        break

      case 'deploy':
        await migrationService.applyMigrations()
        logger.log('✅ Migrations deployed')
        break

      case 'reset':
        if (configService.get<string>('NODE_ENV') !== 'development') {
          logger.error(
            '❌ Database reset is only allowed in development environment'
          )
          process.exit(1)
        }
        await migrationService.resetDatabase()
        logger.log('✅ Database reset')
        break

      case 'seed':
        await seedingService.runSeeding()
        logger.log('✅ Database seeded')
        break

      case 'seed-check':
        const seedStatus = await seedingService.checkSeedData()
        logger.log('📊 Seed Data Status:')
        console.log(JSON.stringify(seedStatus, null, 2))
        break

      case 'status':
        const migrationStatus = await migrationService.getMigrationStatus()
        logger.log('📊 Migration Status:')
        console.log(JSON.stringify(migrationStatus, null, 2))
        break

      case 'validate':
        const isValid = await migrationService.validateSchema()
        if (isValid) {
          logger.log('✅ Schema is valid')
        } else {
          logger.error('❌ Schema validation failed')
          process.exit(1)
        }
        break

      case 'format':
        await migrationService.formatSchema()
        logger.log('✅ Schema formatted')
        break

      case 'health':
        const isHealthy = await migrationService.checkConnection()
        if (isHealthy) {
          logger.log('✅ Database connection is healthy')
        } else {
          logger.error('❌ Database connection failed')
          process.exit(1)
        }
        break

      case 'info':
        const dbInfo = await migrationService.getDatabaseInfo()
        logger.log('📊 Database Information:')
        console.log(JSON.stringify(dbInfo, null, 2))
        break

      case 'setup':
        logger.log('🚀 Setting up database...')
        await migrationService.validateSchema()
        await migrationService.applyMigrations()
        await migrationService.generateClient()
        await seedingService.runSeeding()
        logger.log('✅ Database setup completed')
        break

      case 'refresh':
        logger.log('🔄 Refreshing database...')
        await migrationService.resetDatabase()
        await migrationService.applyMigrations()
        await seedingService.runSeeding()
        logger.log('✅ Database refreshed')
        break

      default:
        logger.error(`❌ Unknown command: ${command}`)
        showHelp()
        process.exit(1)
    }

    await shutdown(app)
  } catch (error) {
    logger.error(`❌ Command failed: ${command}`, error)
    if (app) {
      await shutdown(app)
    }
    process.exit(1)
  }
}

function showHelp() {
  console.log(`
📦 Noteum Database Migration CLI

Usage: node scripts/migration-cli.ts [command] [options]

Commands:
  generate              Generate Prisma client
  push                  Push schema changes to database (development only)
  migrate [name]        Create new migration with optional name
  deploy                Apply pending migrations (production safe)
  reset                 Reset database (development only)
  seed                  Run database seeding
  seed-check            Check seed data status
  status                Show migration status
  validate              Validate Prisma schema
  format                Format Prisma schema file
  health                Check database connection
  info                  Show database information
  setup                 Complete database setup (validate + migrate + seed)
  refresh               Reset and reseed database

Examples:
  node scripts/migration-cli.ts setup              # Complete setup
  node scripts/migration-cli.ts migrate init       # Create named migration
  node scripts/migration-cli.ts deploy             # Apply migrations
  node scripts/migration-cli.ts seed               # Seed database
  node scripts/migration-cli.ts status             # Check status

Environment:
  NODE_ENV=development    # Enable development-only commands
  DATABASE_URL           # Database connection string

⚠️  Warning: Use caution with reset and refresh commands in production!
`)
}

// 处理未捕获的异常
process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// 运行主函数
main()
