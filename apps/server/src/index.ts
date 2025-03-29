import { Hono } from 'hono'
import { trpcServer } from '@hono/trpc-server'
import { appRouter } from './trpc/router'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

// 创建 Hono 应用实例
const app = new Hono()

// 定义基础路由
app.get('/', (c) => {
  return c.text('Hello Hono with tRPC!')
})

// 添加一个测试路由
app.get('/test', (c) => {
  return c.json({ message: 'Test route works!' })
})

app.use(cors())
app.use(logger())
// 集成 tRPC 路由
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
  }),
)

const port = process.env.PORT ? parseInt(process.env.PORT) : 9157

// 导出 Hono 应用实例
export default {
  port,
  fetch: app.fetch,
}
