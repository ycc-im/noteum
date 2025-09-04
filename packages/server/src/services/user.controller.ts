import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, GetUserDto, UserResponseDto } from '../common/dto/user.dto';
import { NotFoundException } from '@nestjs/common';

interface UserServiceGrpc {
  createUser(data: CreateUserDto): Promise<UserResponseDto>;
  getUser(data: GetUserDto): Promise<UserResponseDto>;
  updateUser(data: { id: string } & UpdateUserDto): Promise<UserResponseDto>;
  deleteUser(data: GetUserDto): Promise<{ success: boolean }>;
}

@Controller()
export class UserController implements UserServiceGrpc {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.createUser({
      username: data.username,
      email: data.email,
      password: data.password,
      displayName: data.displayName,
    });

    return this.userService.toResponseDto(user);
  }

  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: GetUserDto): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(data.id);
    
    if (!user) {
      throw new NotFoundException(`User with ID ${data.id} not found`);
    }

    return this.userService.toResponseDto(user);
  }

  @GrpcMethod('UserService', 'UpdateUser')
  async updateUser(data: { id: string } & UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.updateUser(data.id, {
      username: data.username,
      email: data.email,
      displayName: data.displayName,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${data.id} not found`);
    }

    return this.userService.toResponseDto(user);
  }

  @GrpcMethod('UserService', 'DeleteUser')
  async deleteUser(data: GetUserDto): Promise<{ success: boolean }> {
    const success = await this.userService.deleteUser(data.id);
    return { success };
  }
}