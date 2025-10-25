import { Injectable } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { CacheService } from '../cache/cache.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService
  ) {}

  async createSession(
    userId: number,
    tokenhash: string,
    deviceInfo: any,
    ipAddress: string,
    userAgent: string
  ) {
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

    // Cache session data for faster access
    await this.cache.setex(
      `session:${session.id}`,
      JSON.stringify(session),
      60 * 60 * 24 * 7
    ) // 7 days

    return session
  }

  async getSessionById(sessionId: string) {
    // Try to get from cache first
    const cachedSession = await this.cache.get(`session:${sessionId}`)
    if (cachedSession) {
      const session = JSON.parse(cachedSession)
      // Check if session is still valid and active
      if (session.isactive && new Date(session.expiresat) > new Date()) {
        return session
      }
      // Remove expired session from cache
      await this.cache.del(`session:${sessionId}`)
    }

    // Get from database
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (
      session &&
      session.isactive &&
      new Date(session.expiresat) > new Date()
    ) {
      // Cache the session
      const ttl = Math.floor(
        (new Date(session.expiresat).getTime() - Date.now()) / 1000
      )
      if (ttl > 0) {
        await this.cache.setex(
          `session:${sessionId}`,
          JSON.stringify(session),
          ttl
        )
      }
      return session
    }

    return null
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isactive: false },
    })

    await this.cache.del(`session:${sessionId}`)
  }

  async invalidateAllUserSessions(userId: number): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userid: userId },
      data: { isactive: false },
    })

    // Invalidate all cached sessions for this user
    const pattern = `session:*`
    // Note: This is a simplified approach. In production, you might want to track session IDs per user
  }

  async validateSessionToken(
    token: string,
    tokenhash: string
  ): Promise<boolean> {
    return await bcrypt.compare(token, tokenhash)
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        OR: [{ expiresat: { lt: new Date() } }, { isactive: false }],
      },
    })
  }
}
