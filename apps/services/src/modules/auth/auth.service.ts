import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { PrismaService } from '../database/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)
    if (!user) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordhash)
    if (!isPasswordValid) {
      return null
    }

    return user
  }

  async validateUserByUsername(
    username: string,
    password: string
  ): Promise<any> {
    const user = await this.usersService.findByUsername(username)
    if (!user) {
      return null
    }

    if (!user.isactive) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordhash)
    if (!isPasswordValid) {
      return null
    }

    return user
  }

  async loginWithUsername(username: string, password: string) {
    const user = await this.validateUserByUsername(username, password)
    if (!user) {
      throw new Error('Invalid username or password')
    }

    return this.login(user)
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    }

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      }),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.profile?.displayName,
        role: user.role,
      },
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken)
      const user = await this.usersService.findById(payload.sub)

      if (!user || !user.isactive) {
        throw new Error('Invalid refresh token')
      }

      return this.login(user)
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
  }

  async createSession(
    userId: number,
    token: string,
    deviceInfo: any,
    ipAddress: string,
    userAgent: string
  ) {
    const tokenhash = await bcrypt.hash(token, 10)
    const expiresat = new Date()
    expiresat.setDate(expiresat.getDate() + 7) // 7 days

    const session = await this.prisma.session.create({
      data: {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userid: userId,
        tokenhash,
        expiresat,
        deviceinfo: deviceInfo,
        ipaddress: ipAddress,
        useragent: userAgent,
      },
    })

    return session
  }

  async invalidateSession(tokenhash: string) {
    await this.prisma.session.updateMany({
      where: { tokenhash },
      data: { isactive: false },
    })
  }

  async invalidateAllUserSessions(userId: number) {
    await this.prisma.session.updateMany({
      where: { userid: userId },
      data: { isactive: false },
    })
  }

  async cleanupExpiredSessions() {
    await this.prisma.session.deleteMany({
      where: {
        OR: [{ expiresat: { lt: new Date() } }, { isactive: false }],
      },
    })
  }
}
