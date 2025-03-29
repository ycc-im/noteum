import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './trpc/router'

// 创建 tRPC 客户端
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:9157/trpc',
    }),
  ],
})

async function main() {
  try {
    // 测试 hello 查询
    const helloResult = await trpc.hello.query({ name: '张三' })
    console.log('Hello 查询结果:', helloResult)

    const pingResult = await trpc.ping.query()
    console.log('Ping 查询结果:', pingResult)
  } catch (error) {
    console.error('tRPC 请求错误:', error)
  }
}

// 运行测试
main()
