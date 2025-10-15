import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { HealthService } from './health.service'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthService: HealthService
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check application health' })
  async check() {
    return this.healthService.check()
  }

  @Get('simple')
  @ApiOperation({ summary: 'Simple health check' })
  async simpleCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
    }
  }
}
