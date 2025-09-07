import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthInfo } from './jwt-validator';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthInfo => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);