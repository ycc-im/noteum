import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService, TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLiveness', () => {
    it('should return liveness status', () => {
      const result = controller.getLiveness();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    });
  });

  describe('getReadiness', () => {
    it('should return readiness status', () => {
      const result = controller.getReadiness();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    });
  });

  describe('check', () => {
    it('should perform health check', async () => {
      const mockHealthResult = {
        status: 'ok' as any,
        info: {},
        error: {},
        details: {},
      };

      jest.spyOn(healthCheckService, 'check').mockResolvedValue(mockHealthResult);

      const result = await controller.check();
      expect(result).toEqual(mockHealthResult);
      expect(healthCheckService.check).toHaveBeenCalledWith([]);
    });
  });
});