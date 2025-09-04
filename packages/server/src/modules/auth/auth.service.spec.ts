import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: Fix tests to work with new gRPC types
  /*
  describe('login', () => {
    it('should return login response with token', async () => {
      const loginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await service.login(loginRequest);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(loginRequest.email);
    });
  });

  describe('register', () => {
    it('should return registration response with user data', async () => {
      const registerRequest = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = await service.register(registerRequest);

      expect(result.success).toBe(true);
      expect(result.user.email).toBe(registerRequest.email);
      expect(result.user.name).toBe(registerRequest.name);
    });
  });

  describe('logout', () => {
    it('should return logout success response', async () => {
      const logoutRequest = {
        token: 'mock_token',
      };

      const result = await service.logout(logoutRequest);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Logout successful');
    });
  });
  */
});