import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { JwtMiddleware } from './jwt.middleware';

@Module({
  providers: [AuthService, AuthGuard, JwtMiddleware],
  exports: [AuthService, AuthGuard, JwtMiddleware],
})
export class AuthModule {}
