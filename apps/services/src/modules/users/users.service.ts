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

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    })
  }

  async create(userData: {
    email: string
    username?: string
    passwordhash: string
    profile?: {
      firstname: string
      lastname: string
      displayname: string
    }
  }) {
    return this.prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username || userData.email.split('@')[0], // 使用指定 username 或 email 前缀
        passwordhash: userData.passwordhash,
        profile: userData.profile
          ? {
              create: {
                id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                firstname: userData.profile.firstname,
                lastname: userData.profile.lastname,
                displayname: userData.profile.displayname,
              },
            }
          : undefined,
      },
      include: { profile: true },
    })
  }
}
