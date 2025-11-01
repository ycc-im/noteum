import { TrpcService } from './trpc.service'
import { AuthService } from '../auth/auth.service'
import { CacheService } from '../cache/cache.service'
import { z } from 'zod'

// 创建认证相关的路由器
export function createAuthRouter(trpc: TrpcService, authService: AuthService) {
  return trpc.router({
    // 用户名登录
    login: trpc.publicProcedure
      .input(
        z.object({
          username: z.string().min(3).max(30),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await authService.loginWithUsername(
            input.username,
            input.password
          )
          return {
            success: true,
            data: result,
          }
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : 'Login failed'
          )
        }
      }),

    // Token 刷新
    refreshToken: trpc.publicProcedure
      .input(
        z.object({
          refreshToken: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await authService.refreshToken(input.refreshToken)
          return {
            success: true,
            data: result,
          }
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : 'Token refresh failed'
          )
        }
      }),

    // 获取当前用户信息
    me: trpc.authProcedure.query(({ ctx }) => {
      return {
        user: {
          id: ctx.user.id,
          email: ctx.user.email,
          username: ctx.user.username,
          displayName: ctx.user.profile?.displayName,
          role: ctx.user.role,
        },
      }
    }),

    // 登出 (使会话失效)
    logout: trpc.authProcedure.mutation(async ({ ctx }) => {
      // TODO: 实现具体的登出逻辑，使 token 失效
      return {
        success: true,
        message: 'Logged out successfully',
      }
    }),
  })
}

// 创建笔记相关的路由器
export function createNotesRouter(
  trpc: TrpcService,
  cacheService: CacheService
) {
  return trpc.router({
    // 创建笔记
    create: trpc.authProcedure
      .input(
        z.object({
          id: z.string().ulid(),
          title: z.string().min(1).max(500),
          notebookId: z.string().default('default'),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // 验证用户权限
          if (!ctx.user) {
            throw new Error('Unauthorized')
          }

          // 添加到Redis Stream
          const streamId = await cacheService.xadd(
            'notes:stream',
            '*', // 自动生成stream ID
            {
              noteId: input.id,
              title: input.title,
              notebookId: input.notebookId,
              createdBy: ctx.user.id,
              createdAt: new Date().toISOString(),
              operation: 'CREATE',
            }
          )

          return {
            success: true,
            noteId: input.id,
            streamId: streamId,
            timestamp: new Date().toISOString(),
          }
        } catch (error: any) {
          throw new Error(
            `Failed to create note: ${error instanceof Error ? error.message : String(error)}`
          )
        }
      }),

    // 获取笔记列表（简化版本）
    list: trpc.authProcedure
      .input(
        z.object({
          notebookId: z.string().optional(),
          limit: z.number().min(1).max(100).default(50),
        })
      )
      .query(async ({ input, ctx }) => {
        try {
          // 从Redis Stream读取最近的笔记
          const entries = await cacheService.xrange(
            'notes:stream',
            '-', // 开始
            '+', // 结束
            input.limit
          )

          // 转换格式
          const notes = entries.map(
            ([id, fields]: [string, Record<string, string>]) => ({
              id: fields.noteId,
              title: fields.title,
              notebookId: fields.notebookId,
              createdBy: fields.createdBy,
              createdAt: fields.createdAt,
              streamId: id,
            })
          )

          return {
            success: true,
            notes,
            total: notes.length,
          }
        } catch (error: any) {
          throw new Error(
            `Failed to fetch notes: ${error instanceof Error ? error.message : String(error)}`
          )
        }
      }),
  })
}

// 创建主路由器
export function createTrpcRouter(
  trpc: TrpcService,
  authService?: AuthService,
  cacheService?: CacheService
) {
  if (!authService) {
    return trpc.router({
      health: trpc.publicProcedure.query(() => ({
        status: 'healthy',
        timestamp: new Date().toISOString(),
      })),

      user: trpc.publicProcedure.query(() => ({
        message: 'User endpoint working',
      })),
    })
  }

  const authRouter = createAuthRouter(trpc, authService)
  const notesRouter = cacheService
    ? createNotesRouter(trpc, cacheService)
    : null

  const baseRouter = {
    health: trpc.publicProcedure.query(() => ({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    })),

    // 认证相关路由
    auth: authRouter,

    // 受保护的用户端点
    profile: trpc.authProcedure.query(({ ctx }) => ({
      user: {
        id: ctx.user.id,
        email: ctx.user.email,
        username: ctx.user.username,
        displayName: ctx.user.profile?.displayName,
        role: ctx.user.role,
        profile: ctx.user.profile,
      },
    })),

    // 管理员端点示例
    admin: trpc.adminProcedure.query(() => ({
      message: 'Admin access granted',
      timestamp: new Date().toISOString(),
    })),
  }

  // 如果有笔记路由，添加到基础路由器
  if (notesRouter) {
    return trpc.router({
      ...baseRouter,
      // 笔记相关路由
      notes: notesRouter,
    })
  }

  return trpc.router(baseRouter)
}

// 为模块导出创建一个默认路由器实例
export const TrpcRouter = createTrpcRouter(new TrpcService({} as any))
