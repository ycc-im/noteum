import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtValidator, AuthInfo } from '../auth/jwt-validator';
import { Context } from './trpc';

@Injectable()
export class TrpcContextService {
  private jwtValidator: JwtValidator;

  constructor(private configService: ConfigService) {
    this.jwtValidator = new JwtValidator(configService);
  }

  async createContext(req: any): Promise<Context> {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: undefined };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const payload = await this.jwtValidator.validateJwt(token);
      const authInfo = this.jwtValidator.createAuthInfo(payload);
      return { user: authInfo };
    } catch (error) {
      console.error('JWT verification failed in tRPC context:', error);
      return { user: undefined };
    }
  }
}
