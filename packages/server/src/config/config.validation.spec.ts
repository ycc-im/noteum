import 'reflect-metadata';
import { validate } from './config.validation';

describe('Config Validation', () => {
  it('should validate default configuration', () => {
    const config = {};
    const result = validate(config);

    expect(result.NODE_ENV).toBe('development');
    expect(result.PORT).toBe(3001);
    expect(result.GRPC_HOST).toBe('0.0.0.0');
    expect(result.GRPC_PORT).toBe(5001);
  });

  it('should validate custom configuration', () => {
    const config = {
      NODE_ENV: 'production',
      PORT: '8080',
      GRPC_HOST: 'localhost',
      GRPC_PORT: '9090',
    };

    const result = validate(config);

    expect(result.NODE_ENV).toBe('production');
    expect(result.PORT).toBe(8080);
    expect(result.GRPC_HOST).toBe('localhost');
    expect(result.GRPC_PORT).toBe(9090);
  });

  it('should throw error for invalid NODE_ENV', () => {
    const config = {
      NODE_ENV: 'invalid',
    };

    expect(() => validate(config)).toThrow();
  });

  it('should convert string ports to numbers', () => {
    const config = {
      PORT: '3000',
      GRPC_PORT: '5000',
    };

    const result = validate(config);

    expect(result.PORT).toBe(3000);
    expect(result.GRPC_PORT).toBe(5000);
    expect(typeof result.PORT).toBe('number');
    expect(typeof result.GRPC_PORT).toBe('number');
  });
});
