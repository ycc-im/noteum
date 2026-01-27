# @noteum/auth 技能包

## 概述

基于 Better Auth 构建的身份验证包，专注于 Drizzle ORM + React 集成，提供完整的身份验证解决方案。

## 核心架构

- **Core**: 框架无关的核心认证功能
- **Adapters**: 数据库适配器层（目前支持 Drizzle ORM）
- **Client**: 客户端 SDK，用于前端身份验证操作
- **React**: React 集成，包括 Hooks 和组件
- **TanStack Router**: 路由级别认证保护

## 主要功能

### 1. 服务端初始化

```typescript
import { createAuth } from '@noteum/auth/core'
import { DrizzleAdapter } from '@noteum/auth/adapters'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client)
const drizzleAdapter = new DrizzleAdapter({ db })

const auth = createAuth({
  databaseAdapter: drizzleAdapter,
  secret: process.env.JWT_SECRET,
  baseURL: 'http://localhost:3000',
  trustedOrigins: ['http://localhost:5173'],
})
```

### 2. React 集成

```typescript
import { AuthProvider, useAuth } from '@noteum/auth/react'

// App 组件
function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  )
}

// 使用认证 Hook
function Dashboard() {
  const { session, user, isAuthenticated, login, logout, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <Login />

  return <div>Welcome, {user?.name}</div>
}
```

### 3. 认证 Hooks

- `useAuth()`: 主认证 hook，提供 session、login、logout
- `useLogin()`: 专门用于登录的 hook
- `useLogout()`: 专门用于登出的 hook
- `useSignUp()`: 注册 hook
- `useSession()`: Session 管理 hook

### 4. TanStack Router 集成

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { requireAuth, optionalAuth } from '@noteum/auth/react/tanstack'

// 需要认证的路由
export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAuth,
  component: Dashboard,
})

// 可选认证的路由
export const ProfileRoute = createFileRoute('/profile')({
  beforeLoad: optionalAuth,
  component: Profile,
})
```

### 5. 数据库架构

使用 Drizzle schema：

```typescript
import {
  user,
  session,
  account,
  verification,
} from '@noteum/auth/drizzle/schema'
```

运行 Better Auth CLI 生成表：

```bash
npx @better-auth/cli generate
```

## 特性

- ✅ 邮箱密码认证
- ✅ Session 管理
- ✅ Drizzle ORM 适配器（PostgreSQL）
- ✅ React hooks 和 providers
- ✅ TanStack Router 集成
- ✅ TypeScript 优先
- ✅ 框架无关的核心
- ✅ 单用户设计

## 配置选项

- `session.expiresIn`: Session 过期时间（默认 7 天）
- `session.updateAge`: Session 更新年龄（默认 1 天）
- `emailVerification.enabled`: 启用邮箱验证
- `passwordReset.sendResetEmail`: 自定义密码重置邮件处理

## 测试

```bash
npm run test              # 运行测试
npm run test:watch        # 监视模式
npm run test:ui          # UI 测试界面
```

## 构建

```bash
npm run build        # 构建生产版本
npm run dev          # 开发模式（监听文件变化）
npm run type-check   # 类型检查
```

## 导出结构

- `@noteum/auth`: 主入口
- `@noteum/auth/core`: 核心认证功能
- `@noteum/auth/adapters`: 数据库适配器
- `@noteum/auth/client`: 客户端 SDK
- `@noteum/auth/react`: React 集成

## 注意事项

- 使用 Better Auth 作为底层认证库
- Drizzle 适配器目前支持 PostgreSQL
- React hooks 基于 TanStack Query 构建
- 所有认证操作通过客户端 SDK 进行
