import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtValidator, AuthInfo } from './jwt-validator';

@Injectable()
export class AuthService {
  private jwtValidator: JwtValidator;

  constructor(private configService: ConfigService) {
    this.jwtValidator = new JwtValidator(configService);
  }

  async verifyToken(token: string): Promise<AuthInfo> {
    const payload = await this.jwtValidator.validateJwt(token);
    return this.jwtValidator.createAuthInfo(payload);
  }

  async validateUser(authInfo: AuthInfo): Promise<any> {
    // Here you can add additional user validation logic
    // For example, check if user exists in your database
    return {
      sub: authInfo.sub,
      client_id: authInfo.client_id,
      organization_id: authInfo.organization_id,
      scopes: authInfo.scopes,
    };
  }
}
