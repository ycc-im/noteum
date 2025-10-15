import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { MigrationService } from './migration.service'
import { SeedingService } from './seeding.service'

@ApiTags('Database Management')
@Controller('database')
export class MigrationController {
  constructor(
    private readonly migrationService: MigrationService,
    private readonly seedingService: SeedingService,
  ) {}

  @Get('status')
  @ApiOperation({ summary: 'Get migration status' })
  @ApiResponse({ status: 200, description: 'Migration status retrieved successfully' })
  async getMigrationStatus() {
    return this.migrationService.getMigrationStatus()
  }

  @Post('migrate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Apply database migrations' })
  @ApiResponse({ status: 200, description: 'Migrations applied successfully' })
  async applyMigrations() {
    await this.migrationService.applyMigrations()
    return { message: 'Migrations applied successfully' }
  }

  @Post('generate-client')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate Prisma client' })
  @ApiResponse({ status: 200, description: 'Prisma client generated successfully' })
  async generateClient() {
    await this.migrationService.generateClient()
    return { message: 'Prisma client generated successfully' }
  }

  @Post('push')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Push schema changes to database (development only)' })
  @ApiResponse({ status: 200, description: 'Schema pushed successfully' })
  async pushSchema() {
    await this.migrationService.pushSchema()
    return { message: 'Schema pushed successfully' }
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset database (development only)' })
  @ApiResponse({ status: 200, description: 'Database reset successfully' })
  async resetDatabase() {
    await this.migrationService.resetDatabase()
    return { message: 'Database reset successfully' }
  }

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Run database seeding' })
  @ApiResponse({ status: 200, description: 'Database seeded successfully' })
  async runSeeding() {
    await this.seedingService.runSeeding()
    return { message: 'Database seeded successfully' }
  }

  @Get('seed/check')
  @ApiOperation({ summary: 'Check if seed data exists' })
  @ApiResponse({ status: 200, description: 'Seed data status retrieved successfully' })
  async checkSeedData() {
    return this.seedingService.checkSeedData()
  }

  @Post('seed/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh seed data' })
  @ApiResponse({ status: 200, description: 'Seed data refreshed successfully' })
  async refreshSeedData() {
    await this.seedingService.refreshSeedData()
    return { message: 'Seed data refreshed successfully' }
  }

  @Get('health')
  @ApiOperation({ summary: 'Check database connection health' })
  @ApiResponse({ status: 200, description: 'Database connection is healthy' })
  async checkHealth() {
    const isHealthy = await this.migrationService.checkConnection()
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    }
  }

  @Get('info')
  @ApiOperation({ summary: 'Get database information' })
  @ApiResponse({ status: 200, description: 'Database information retrieved successfully' })
  async getDatabaseInfo() {
    return this.migrationService.getDatabaseInfo()
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate database schema' })
  @ApiResponse({ status: 200, description: 'Schema validation completed' })
  async validateSchema() {
    const isValid = await this.migrationService.validateSchema()
    return {
      valid: isValid,
      message: isValid ? 'Schema is valid' : 'Schema validation failed',
    }
  }

  @Post('rollback/:migration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rollback to specific migration (development only)' })
  @ApiResponse({ status: 200, description: 'Rollback completed successfully' })
  async rollbackMigration(@Param('migration') migration: string) {
    await this.migrationService.rollbackToMigration(migration)
    return { message: `Rolled back to migration: ${migration}` }
  }
}