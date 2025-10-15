import { Module } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { PrismaService } from './prisma.service'
import { MigrationService } from './migration.service'
import { SeedingService } from './seeding.service'
import { DatabaseHealthService } from './health.service'
import { MigrationController } from './migration.controller'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  controllers: [MigrationController],
  providers: [
    DatabaseService,
    PrismaService,
    MigrationService,
    SeedingService,
    DatabaseHealthService,
  ],
  exports: [
    DatabaseService,
    PrismaService,
    MigrationService,
    SeedingService,
    DatabaseHealthService,
  ],
})
export class DatabaseModule {}
