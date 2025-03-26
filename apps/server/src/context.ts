import type { inferAsyncReturnType } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

/**
 * 创建上下文
 * @param opts - 上下文选项
 * @returns 上下文对象
 */
export async function createContext(_opts?: FetchCreateContextFnOptions) {
  return {
    // 这里可以添加用户认证信息
    user: null, // 默认为 null，表示未登录
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
