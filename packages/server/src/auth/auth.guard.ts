import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtValidator, AuthInfo } from './jwt-validator';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtValidator: JwtValidator;

  constructor(private configService: ConfigService) {
    this.jwtValidator = new JwtValidator(configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const payload = await this.jwtValidator.validateJwt(token);
      request.user = this.jwtValidator.createAuthInfo(payload);
      return true;
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
