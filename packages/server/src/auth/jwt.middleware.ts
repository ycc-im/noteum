import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { JwtValidator, AuthInfo } from './jwt-validator';

export interface AuthenticatedRequest extends Request {}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private jwtValidator: JwtValidator;

  constructor(private configService: ConfigService) {
    this.jwtValidator = new JwtValidator(configService);
  }

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const payload = await this.jwtValidator.validateJwt(token);
      req.user = this.jwtValidator.createAuthInfo(payload);
      next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}