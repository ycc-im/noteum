import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface AuthInfo {
  sub: string;
  client_id?: string;
  organization_id?: string;
  scopes: string[];
  audience: string[];
  email?: string;
  name?: string;
  picture?: string;
}

export class AuthorizationError extends Error {
  constructor(
    message: string,
    public status: number = 401,
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

@Injectable()
export class JwtValidator {
  private jwks: ReturnType<typeof createRemoteJWKSet>;
  private issuer: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('logto.endpoint');
    if (!endpoint) {
      throw new Error('Logto endpoint not configured');
    }

    // Construct JWKS URI and issuer from endpoint
    const jwksUri = new URL('/oidc/jwks', endpoint);
    this.issuer = `${endpoint}/oidc`;
    this.jwks = createRemoteJWKSet(jwksUri);
  }

  async validateJwt(token: string): Promise<JWTPayload> {
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
      });

      this.verifyPayload(payload);
      return payload;
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  createAuthInfo(payload: JWTPayload): AuthInfo {
    const scopes = (payload.scope as string)?.split(' ') ?? [];
    const audience = Array.isArray(payload.aud)
      ? payload.aud
      : payload.aud
        ? [payload.aud]
        : [];

    return {
      sub: payload.sub!,
      client_id: payload.client_id as string,
      organization_id: payload.organization_id as string,
      scopes,
      audience,
      email: payload.email as string,
      name: payload.name as string,
      picture: payload.picture as string,
    };
  }

  private verifyPayload(payload: JWTPayload): void {
    // Basic validation - can be extended based on your requirements
    if (!payload.sub) {
      throw new AuthorizationError('Token missing subject claim');
    }

    // Add additional verification logic here based on your permission model
    // For example, checking required scopes or audience claims
  }
}
