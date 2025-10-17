import { TrpcService } from './trpc.service'
import { AuthService } from '../auth/auth.service'
import { z } from 'zod'

// 创建认证相关的路由器
export function createAuthRouter(trpc: TrpcService, authService: AuthService) {
  return trpc.router({
    // 用户名登录
    login: trpc.publicProcedure
      .input(z.object({
        username: z.string().min(3).max(30),
        password: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await authService.loginWithUsername(input.username, input.password)
          return {
            success: true,
            data: result,
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Login failed')
        }
      }),

    // Token 刷新
    refreshToken: trpc.publicProcedure
      .input(z.object({
        refreshToken: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await authService.refreshToken(input.refreshToken)
          return {
            success: true,
            data: result,
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Token refresh failed')
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

// 创建主路由器
export function createTrpcRouter(trpc: TrpcService, authService?: AuthService) {
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

  return trpc.router({
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
  })
}

// 为模块导出创建一个默认路由器实例
export const TrpcRouter = createTrpcRouter(new TrpcService({} as any))