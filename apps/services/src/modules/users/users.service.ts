import { Injectable } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    })
  }

  async create(userData: {
    email: string
    username?: string
    passwordHash: string
    profile?: {
      firstName: string
      lastName: string
      displayName: string
    }
  }) {
    return this.prisma.user.create({
      data: {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        username: userData.username || userData.email.split('@')[0], // 使用指定 username 或 email 前缀
        passwordHash: userData.passwordHash,
        profile: userData.profile
          ? {
              create: {
                id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                firstName: userData.profile.firstName,
                lastName: userData.profile.lastName,
                displayName: userData.profile.displayName,
              },
            }
          : undefined,
      },
      include: { profile: true },
    })
  }
}
