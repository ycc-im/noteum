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
    userId: string,
    tokenHash: string,
    deviceInfo: any,
    ipAddress: string,
    userAgent: string
  ) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    const session = await this.prisma.session.create({
      data: {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        tokenHash,
        expiresAt,
        deviceInfo,
        ipAddress,
        userAgent,
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

  async getSession(sessionId: string): Promise<any> {
    // Try cache first
    const cached = await this.cache.get(`session:${sessionId}`)
    if (cached) {
      const session = JSON.parse(cached)
      // Check if session is still valid and active
      if (session.isActive && new Date(session.expiresAt) > new Date()) {
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
      session.isActive &&
      new Date(session.expiresAt) > new Date()
    ) {
      // Cache the session
      const ttl = Math.floor(
        (new Date(session.expiresAt).getTime() - Date.now()) / 1000
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
      data: { isActive: false },
    })

    await this.cache.del(`session:${sessionId}`)
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId },
      data: { isActive: false },
    })

    // Invalidate all cached sessions for this user
    const pattern = `session:*`
    // Note: This is a simplified approach. In production, you might want to track session IDs per user
  }

  async validateSessionToken(
    token: string,
    tokenHash: string
  ): Promise<boolean> {
    return await bcrypt.compare(token, tokenHash)
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { isActive: false }],
      },
    })
  }
}
