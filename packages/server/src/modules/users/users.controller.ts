import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { 
  GetUserRequest, 
  GetUserResponse, 
  UpdateUserRequest, 
  UpdateUserResponse 
} from '@noteum/shared';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'GetUser')
  async getUser(data: GetUserRequest): Promise<GetUserResponse> {
    return this.usersService.getUser(data);
  }

  @GrpcMethod('UsersService', 'UpdateUser')
  async updateUser(data: UpdateUserRequest): Promise<UpdateUserResponse> {
    return this.usersService.updateUser(data);
  }
}