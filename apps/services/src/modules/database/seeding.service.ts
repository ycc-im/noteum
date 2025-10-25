import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { ConfigService } from '@nestjs/config'
import { UserRole } from '@/config/constants'
import { hash } from 'bcrypt'
import { ulid } from 'ulid'

@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  /**
   * 清空所有数据（保留表结构）
   */
  async clearDatabase(): Promise<void> {
    const isDevelopment =
      this.configService.get<string>('NODE_ENV') === 'development'

    if (!isDevelopment) {
      throw new Error(
        'Database clearing is only allowed in development environment'
      )
    }

    this.logger.log('Clearing database...')

    // 按照外键依赖顺序删除数据
    const tablenames = (await this.prisma
      .$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`) as Array<{
      tablename: string
    }>

    for (const { tablename } of tablenames) {
      if (tablename !== '_prisma_migrations') {
        try {
          await this.prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
          )
          this.logger.log(`Cleared table: ${tablename}`)
        } catch (error) {
          this.logger.error(`Failed to clear table ${tablename}:`, error)
        }
      }
    }

    this.logger.log('Database cleared successfully')
  }

  /**
   * 创建基础种子数据
   */
  async createBasicSeedData(): Promise<void> {
    this.logger.log('Creating basic seed data...')

    await this.createDefaultUser()
    await this.createSampleDocuments()

    this.logger.log('Basic seed data created successfully')
  }

  /**
   * 创建默认用户
   */
  private async createDefaultUser(): Promise<void> {
    const defaultEmail = 'admin@noteum.dev'
    const existingUser = await this.prisma.user.findUnique({
      where: { email: defaultEmail },
    })

    if (existingUser) {
      this.logger.log('Default user already exists')
      return
    }

    const hashedPassword = await hash('admin123456', 12)

    const user = await this.prisma.user.create({
      data: {
        // id: Auto-increment number, no need to set
        email: defaultEmail,
        username: 'admin',
        passwordhash: hashedPassword,
        role: UserRole.ADMIN,
        isactive: true,
        profile: {
          create: {
            id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            firstname: 'Admin',
            lastname: 'User',
            displayname: 'Admin',
          },
        },
      },
    })

    this.logger.log(`Created default user: ${user.email}`)
  }

  /**
   * 创建示例文档
   */
  private async createSampleDocuments(): Promise<void> {
    // 这里会在后续实现文档功能时添加
    // 目前作为占位符
    this.logger.log(
      'Sample documents creation skipped (Document model not implemented yet)'
    )
  }

  /**
   * 创建测试数据
   */
  async createTestData(): Promise<void> {
    this.logger.log('Creating test data...')

    await this.createTestUsers()
    await this.createTestSessions()

    this.logger.log('Test data created successfully')
  }

  /**
   * 创建测试用户
   */
  private async createTestUsers(): Promise<void> {
    const testUsers = [
      {
        email: 'user1@noteum.dev',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        role: UserRole.USER,
      },
      {
        email: 'user2@noteum.dev',
        firstName: 'Jane',
        lastName: 'Smith',
        displayName: 'Jane Smith',
        role: UserRole.USER,
      },
      {
        email: 'guest@noteum.dev',
        firstName: 'Guest',
        lastName: 'User',
        displayName: 'Guest',
        role: UserRole.USER,
      },
    ]

    for (const userData of testUsers) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userData.email },
      })

      if (existingUser) {
        this.logger.log(`Test user ${userData.email} already exists`)
        continue
      }

      const hashedPassword = await hash('password123', 12)

      const user = await this.prisma.user.create({
        data: {
          // id: Auto-increment number, no need to set
          email: userData.email,
          username: userData.email.split('@')[0], // 使用 email 前缀作为 username
          passwordhash: hashedPassword,
          role: userData.role as any,
          isactive: true,
          profile: {
            create: {
              id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              firstname: userData.firstName,
              lastname: userData.lastName,
              displayname: userData.displayName,
            },
          },
        },
      })

      this.logger.log(`Created test user: ${user.email}`)
    }
  }

  /**
   * 创建测试会话
   */
  private async createTestSessions(): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: {
        email: {
          in: ['user1@noteum.dev', 'user2@noteum.dev'],
        },
      },
    })

    for (const user of users) {
      const sessionExists = await this.prisma.session.findFirst({
        where: {
          userid: user.id,
        },
      })

      if (sessionExists) {
        this.logger.log(`Session for user ${user.email} already exists`)
        continue
      }

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      const session = await this.prisma.session.create({
        data: {
          id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userid: user.id,
          tokenhash: 'test_token_hash_' + ulid(),
          isactive: true,
          expiresat: expiresAt,
          deviceinfo: {
            type: 'web',
            os: 'Linux',
            browser: 'Chrome',
          },
          ipaddress: '127.0.0.1',
          useragent: 'Test User Agent',
        },
      })

      this.logger.log(`Created test session for user: ${user.email}`)
    }
  }

  /**
   * 运行完整的种子流程
   */
  async runSeeding(): Promise<void> {
    try {
      await this.clearDatabase()
      await this.createBasicSeedData()
      this.logger.log('Seeding completed successfully')
    } catch (error) {
      this.logger.error('Seeding failed', error)
      throw error
    }
  }

  /**
   * 检查种子数据是否存在
   */
  async checkSeedData(): Promise<{
    hasUsers: boolean
    hasDocuments: boolean
    userCount: number
    documentCount: number
  }> {
    const userCount = await this.prisma.user.count()
    const documentCount = 0 // 当文档模型实现后更新

    return {
      hasUsers: userCount > 0,
      hasDocuments: documentCount > 0,
      userCount,
      documentCount,
    }
  }

  /**
   * 验证种子数据
   */
  async validateSeedData(): Promise<boolean> {
    try {
      const seedData = await this.checkSeedData()

      if (!seedData.hasUsers) {
        this.logger.warn('No users found in database')
        return false
      }

      const adminUser = await this.prisma.user.findFirst({
        where: { role: UserRole.ADMIN },
      })

      if (!adminUser) {
        this.logger.warn('No admin user found in database')
        return false
      }

      this.logger.log('Seed data validation passed')
      return true
    } catch (error) {
      this.logger.error('Seed data validation failed', error)
      return false
    }
  }

  /**
   * 刷新种子数据（删除并重新创建）
   */
  async refreshSeedData(): Promise<void> {
    this.logger.log('Refreshing seed data...')
    await this.runSeeding()
    this.logger.log('Seed data refreshed successfully')
  }
}
