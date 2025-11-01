import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Res,
  Param,
  All,
} from '@nestjs/common'
import { TrpcService } from './trpc.service'
import { AuthService } from '../auth/auth.service'
import { CacheService } from '../cache/cache.service'
import { createTrpcRouter } from './trpc.router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

@Controller({
  path: 'trpc',
})
export class TrpcController {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService
  ) {}

  private router = createTrpcRouter(
    this.trpcService,
    this.authService,
    this.cacheService
  )

  @Get()
  async getProcedure() {
    return {
      message: 'tRPC endpoint',
      availableRoutes: [
        'health',
        'auth.login',
        'auth.refreshToken',
        'auth.me',
        'auth.logout',
        'profile',
        'admin',
        'notes.create',
        'notes.list',
      ],
    }
  }

  @Post()
  async handleTrpcRequest(@Req() req: any, @Res() res: any) {
    try {
      // 获取原始请求体
      const body = req.body || req.rawBody

      // 创建一个新的 Request 对象给 tRPC 处理
      const trpcRequest = new Request('http://localhost:9168/api/v1/trpc', {
        method: 'POST',
        headers: {
          'content-type': req.headers['content-type'] || 'application/json',
          authorization: req.headers.authorization || '',
          'user-agent': req.headers['user-agent'] || '',
        },
        body: typeof body === 'string' ? body : JSON.stringify(body),
      })

      // 使用 tRPC 的 fetchRequestHandler 处理请求
      const trpcResponse = await fetchRequestHandler({
        endpoint: '/api/v1/trpc',
        req: trpcRequest,
        router: this.router,
        createContext: ({ req }) => this.createContext(req),
      })

      // 获取响应数据
      const responseData = await trpcResponse.json()

      // 设置响应头并返回
      res.status(200)
      res.setHeader('Content-Type', 'application/json')
      return res.json(responseData)
    } catch (error: any) {
      console.error('tRPC request error:', error)
      return res.status(500).json({
        error: {
          message: error?.message || 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR',
        },
      })
    }
  }

  @Post('*')
  async handleTrpcPathRequest(
    @Param('0') path: string,
    @Req() req: any,
    @Res() res: any
  ) {
    try {
      // 获取原始请求体
      const body = req.body || req.rawBody

      // 调试日志
      console.log('tRPC Request path:', path)
      console.log('tRPC Request headers:', req.headers)
      console.log('tRPC Request body (req.body):', req.body)
      console.log('tRPC Request body (req.rawBody):', req.rawBody)
      console.log('tRPC Request body (combined):', body)

      // 创建一个新的 Request 对象给 tRPC 处理
      const url = `http://localhost:9168/api/v1/trpc/${path}`
      const trpcRequest = new Request(url, {
        method: 'POST',
        headers: {
          'content-type': req.headers['content-type'] || 'application/json',
          authorization: req.headers.authorization || '',
          'user-agent': req.headers['user-agent'] || '',
        },
        body: typeof body === 'string' ? body : JSON.stringify(body),
      })

      // 使用 tRPC 的 fetchRequestHandler 处理请求
      const trpcResponse = await fetchRequestHandler({
        endpoint: '/api/v1/trpc',
        req: trpcRequest,
        router: this.router,
        createContext: ({ req }) => this.createContext(req),
      })

      // 设置响应头
      res.status(trpcResponse.status)

      // 复制响应头
      trpcResponse.headers.forEach((value, key) => {
        res.setHeader(key, value)
      })

      // 直接返回 tRPC 的响应体
      const responseText = await trpcResponse.text()
      return res.send(responseText)
    } catch (error: any) {
      console.error('tRPC request error:', error)
      return res.status(500).json({
        error: {
          message: error?.message || 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR',
        },
      })
    }
  }

  @Get('*')
  async handleTrpcGetRequest(
    @Param('0') path: string,
    @Req() req: any,
    @Res() res: any
  ) {
    try {
      // 创建一个新的 Request 对象给 tRPC 处理
      const url = `http://localhost:9168/api/v1/trpc/${path}`
      const trpcRequest = new Request(url, {
        method: 'GET',
        headers: {
          'content-type': req.headers['content-type'] || 'application/json',
          authorization: req.headers.authorization || '',
          'user-agent': req.headers['user-agent'] || '',
        },
      })

      // 使用 tRPC 的 fetchRequestHandler 处理请求
      const trpcResponse = await fetchRequestHandler({
        endpoint: '/api/v1/trpc',
        req: trpcRequest,
        router: this.router,
        createContext: ({ req }) => this.createContext(req),
      })

      // 获取响应数据
      const responseData = await trpcResponse.json()

      // 设置响应头并返回
      res.status(200)
      res.setHeader('Content-Type', 'application/json')
      return res.json(responseData)
    } catch (error: any) {
      console.error('tRPC request error:', error)
      return res.status(500).json({
        error: {
          message: error?.message || 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR',
        },
      })
    }
  }

  private createContext(req: Request): any {
    // 从请求头中提取认证信息
    const authorization = req.headers.get('authorization')

    if (authorization && authorization.startsWith('Bearer ')) {
      try {
        // 这里应该验证 JWT token，暂时返回模拟用户
        return {
          user: {
            id: 'user-123',
            email: 'user@example.com',
            username: 'user',
            role: 'USER',
          },
        }
      } catch (error) {
        // Token 无效
        return {}
      }
    }

    return {}
  }
}
