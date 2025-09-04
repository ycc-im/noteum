import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { User, IUserService } from '../common/interfaces/user.interface';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../common/dto/user.dto';

@Injectable()
export class UserService implements IUserService {
  // In-memory storage for demonstration
  // In a real application, this would be replaced with database integration
  private users: Map<string, User> = new Map();
  private userCounter = 1;

  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    displayName?: string;
  }): Promise<User> {
    // Check if user already exists
    const existingUserByUsername = await this.getUserByUsername(userData.username);
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    const existingUserByEmail = await this.getUserByEmail(userData.email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    const userId = this.userCounter.toString();
    this.userCounter++;

    const user: User = {
      id: userId,
      username: userData.username,
      email: userData.email,
      password: userData.password, // In real app, this should be hashed
      displayName: userData.displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(userId, user);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id: string, updateData: {
    username?: string;
    email?: string;
    displayName?: string;
  }): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    // Check for conflicts if username or email is being updated
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await this.getUserByUsername(updateData.username);
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
    }

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.getUserByEmail(updateData.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    const updatedUser: User = {
      ...user,
      ...updateData,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Helper method to convert User to UserResponseDto (excluding password)
  toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}