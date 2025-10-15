import { Injectable } from '@nestjs/common'
import type { HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus'
import {
  HealthCheckService,
  HealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(
    private health: HealthCheckService,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private databaseService: DatabaseService
  ) {
    super()
  }

  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.checkDatabase('database'),
      () => this.checkMemory('memory'),
      () => this.checkDisk('disk'),
    ])
  }

  private async checkDatabase(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.databaseService.query('SELECT 1')
      return this.getStatus(key, true, {
        responseTime: Date.now(),
        message: 'Database connection is healthy',
      })
    } catch (error) {
      return this.getStatus(key, false, {
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  private checkMemory(key: string): Promise<HealthIndicatorResult> {
    return this.memory.checkHeap('memory_heap', 150 * 1024 * 1024) // 150MB
  }

  private checkDisk(key: string): Promise<HealthIndicatorResult> {
    return this.disk.checkStorage('disk_storage', {
      thresholdPercent: 0.9, // 90%
      path: '/',
    })
  }
}
