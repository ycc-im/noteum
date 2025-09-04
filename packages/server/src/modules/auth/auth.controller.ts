import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { 
  AuthenticateUserRequest, 
  AuthenticateUserResponse,
  CreateUserRequest,
  CreateUserResponse
} from '@noteum/shared';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'AuthenticateUser')
  async authenticateUser(data: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    return this.authService.authenticateUser(data);
  }

  @GrpcMethod('AuthService', 'Register')
  async register(data: CreateUserRequest): Promise<CreateUserResponse> {
    return this.authService.register(data);
  }
}