# @noteum/auth Implementation Plan

> Implementation plan for authentication package built with Better Auth + Drizzle ORM + React

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture Design](#architecture-design)
- [Implementation Phases](#implementation-phases)
- [Testing Strategy](#testing-strategy)
- [Build and Deployment](#build-and-deployment)
- [Timeline](#timeline)
- [Checklist](#checklist)

---

## 🎯 Project Overview

### Design Principles

1. **Single Responsibility** - Auth package only handles authentication
2. **Dependency Inversion** - Database adapters injected from outside
3. **Framework-Agnostic Core** - Core logic not bound to specific frameworks
4. **On-Demand Integration** - Provide React/NestJS integration but not required
5. **Drizzle-Focused** - Only provide Drizzle adapter
6. **Zero Business Logic** - No services layer business logic

### Key Decisions

| Decision                      | Rationale                            |
| ----------------------------- | ------------------------------------ |
| **No Prisma**                 | Pure Drizzle-focused package         |
| **No Services Integration**   | Implemented by services layer        |
| **Single-User Design**        | No multi-tenant/organization for now |
| **PostgreSQL Only**           | Focused on single database provider  |
| **95%+ Test Coverage**        | High-quality unit tests, no E2E      |
| **Simple Examples in README** | Minimal documentation                |

### Technology Stack

- **Core**: Better Auth 1.4.9+
- **ORM**: Drizzle ORM 0.29.0+ (postgres adapter)
- **Database**: PostgreSQL
- **React**: React 18+ with TanStack React Query 5.0+
- **Router**: TanStack Router 1.0+
- **Testing**: Vitest + React Testing Library
- **Build**: tsup

---

## 🏗️ Architecture Design

### Directory Structure

```
packages/auth/
├── src/
│   ├── core/                           # Core auth engine
│   │   ├── database-adapter.interface.ts  # Database adapter interface
│   │   ├── auth-config.types.ts          # Config types
│   │   └── auth-factory.ts             # Better Auth factory
│   │
│   ├── adapters/                        # Database adapters
│   │   └── drizzle.adapter.ts          # Drizzle adapter
│   │
│   ├── client/                          # Client SDK
│   │   ├── types.ts
│   │   └── index.ts                    # HTTP client
│   │
│   ├── react/                           # React integration
│   │   ├── client.ts                   # React client config
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   ├── use-login.ts
│   │   │   ├── use-logout.ts
│   │   │   ├── use-signup.ts
│   │   │   ├── use-session.ts
│   │   │   └── index.ts
│   │   ├── providers/
│   │   │   └── auth-provider.tsx
│   │   └── tanstack/
│   │       ├── before-load.ts
│   │       └── index.ts
│   │
│   └── index.ts                        # Main export
│
├── drizzle/                            # Drizzle schema
│   └── schema.ts
│
├── tests/                              # Unit tests
│   ├── core/
│   │   ├── auth-factory.test.ts
│   │   └── database-adapter.interface.test.ts
│   ├── adapters/
│   │   └── drizzle-adapter.test.ts
│   ├── client/
│   │   └── auth-client.test.ts
│   └── react/
│       ├── hooks/
│       │   ├── use-auth.test.ts
│       │   ├── use-login.test.ts
│       │   ├── use-logout.test.ts
│       │   ├── use-signup.test.ts
│       │   └── use-session.test.ts
│       └── providers/
│           └── auth-provider.test.tsx
│
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── README.md
```

### Dependency Graph

```
@noteum/auth
├── better-auth (runtime dependency)
└── peer dependencies (optional):
    ├── @tanstack/react-query
    ├── @tanstack/react-router
    ├── drizzle-orm
    └── react
```

---

## 📝 Implementation Phases

### Phase 1: Project Initialization (1-2 hours)

#### 1.1 Create Directory Structure

```bash
mkdir -p packages/auth/src/{core,adapters,client,react/{hooks,providers,tanstack}}
mkdir -p packages/auth/tests/{core,adapters,client,react/{hooks,providers}}
mkdir -p packages/auth/drizzle
```

#### 1.2 Configuration Files

**package.json** - Minimal dependencies, Better Auth only as runtime dependency

```json
{
  "name": "@noteum/auth",
  "version": "0.1.0",
  "description": "Authentication package with Better Auth - focused on Drizzle + React",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./core": {
      "types": "./dist/core/index.d.ts",
      "import": "./dist/core/index.mjs",
      "require": "./dist/core/index.js"
    },
    "./adapters": {
      "types": "./dist/adapters/index.d.ts",
      "import": "./dist/adapters/index.mjs",
      "require": "./dist/adapters/index.js"
    },
    "./client": {
      "types": "./dist/client/index.d.ts",
      "import": "./dist/client/index.mjs",
      "require": "./dist/client/index.js"
    },
    "./react": {
      "types": "./dist/react/index.d.ts",
      "import": "./dist/react/index.mjs",
      "require": "./dist/react/index.js"
    }
  },
  "files": ["dist", "README.md"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "type-check": "tsc --noEmit",
    "test": "vitest run --coverage",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  },
  "dependencies": {
    "better-auth": "^1.4.9"
  },
  "peerDependencies": {
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-router": "^1.0.0",
    "drizzle-orm": "^0.29.0",
    "react": "^18.0.0"
  },
  "peerDependenciesMeta": {
    "@tanstack/react-query": {
      "optional": true
    },
    "@tanstack/react-router": {
      "optional": true
    },
    "drizzle-orm": {
      "optional": true
    },
    "react": {
      "optional": true
    }
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/react-hooks": "^8.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "drizzle-orm": "^0.29.0",
    "happy-dom": "^12.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

**tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false,
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  },
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts",
    "**/*.test.ts",
    "**/*.test.tsx"
  ]
}
```

**tsup.config.ts**

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/core/index.ts',
    'src/adapters/index.ts',
    'src/client/index.ts',
    'src/react/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'better-auth',
    '@tanstack/react-query',
    '@tanstack/react-router',
    'drizzle-orm',
    'react',
    'react-dom',
    'postgres',
  ],
})
```

**vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.config.ts',
        '**/types.ts',
        'src/**/index.ts',
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 95,
        statements: 95,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

---

### Phase 2: Core Functionality (2-3 hours)

#### 2.1 Database Adapter Interface

**File**: `src/core/database-adapter.interface.ts`

```typescript
import type { BetterAuthOptions } from 'better-auth'

export interface DatabaseAdapter {
  getAdapter(): BetterAuthOptions['database']
  healthCheck(): Promise<boolean>
}

export interface AuthUser {
  id: string
  email: string
  emailVerified: boolean
  name?: string
  username?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  id: string
  userId: string
  token: string
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
  user: AuthUser
}
```

#### 2.2 Auth Config Types

**File**: `src/core/auth-config.types.ts`

```typescript
import type { DatabaseAdapter } from './database-adapter.interface'

export interface AuthConfig {
  databaseAdapter: DatabaseAdapter
  secret: string
  baseURL: string
  trustedOrigins?: string[]
  session?: {
    expiresIn?: number
    updateAge?: number
  }
  emailVerification?: {
    enabled?: boolean
    sendVerificationEmail?: (data: { user: any; url: string }) => Promise<void>
  }
  passwordReset?: {
    sendResetEmail?: (data: { user: any; url: string }) => Promise<void>
  }
}
```

#### 2.3 Auth Factory

**File**: `src/core/auth-factory.ts`

```typescript
import { betterAuth, type BetterAuth } from 'better-auth'
import type { AuthConfig } from './auth-config.types'

export function createAuth(config: AuthConfig): BetterAuth {
  return betterAuth({
    database: config.databaseAdapter.getAdapter(),
    secret: config.secret,
    baseURL: config.baseURL,
    trustedOrigins: config.trustedOrigins || [],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: config.emailVerification?.enabled || false,
      sendResetPassword: config.passwordReset?.sendResetEmail,
    },
    session: {
      expiresIn: config.session?.expiresIn || 60 * 60 * 24 * 7,
      updateAge: config.session?.updateAge || 60 * 60 * 24,
    },
    plugins: [],
  })
}

export type AuthInstance = ReturnType<typeof createAuth>
```

**File**: `src/core/index.ts`

```typescript
export * from './database-adapter.interface'
export * from './auth-config.types'
export { createAuth, type AuthInstance } from './auth-factory'
```

---

### Phase 3: Drizzle Adapter (1-2 hours)

#### 3.1 Drizzle Adapter Implementation

**File**: `src/adapters/drizzle.adapter.ts`

```typescript
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { sql } from 'drizzle-orm'
import type { DatabaseAdapter } from '../core/database-adapter.interface'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

export interface DrizzleAdapterConfig {
  db: PostgresJsDatabase
  schema?: any
}

export class DrizzleAdapter implements DatabaseAdapter {
  readonly type = 'drizzle' as const
  readonly provider = 'pg' as const

  private readonly db: PostgresJsDatabase
  private readonly schema?: any

  constructor(config: DrizzleAdapterConfig) {
    this.db = config.db
    this.schema = config.schema
  }

  getAdapter() {
    return drizzleAdapter(this.db, {
      provider: 'pg',
      schema: this.schema,
    })
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.db.execute(sql`SELECT 1`)
      return true
    } catch (error) {
      console.error('Drizzle health check failed:', error)
      return false
    }
  }
}
```

**File**: `src/adapters/index.ts`

```typescript
export { DrizzleAdapter } from './drizzle.adapter'
export type { DrizzleAdapterConfig } from './drizzle.adapter'
```

---

### Phase 4: Client SDK (2-3 hours)

#### 4.1 Client Types

**File**: `src/client/types.ts`

```typescript
import type { AuthUser, AuthSession } from '../core/database-adapter.interface'

export interface AuthClientConfig {
  baseURL?: string
}

export interface SignInOptions {
  email: string
  password: string
  username?: string
}

export interface SignUpOptions {
  email: string
  password: string
  username?: string
  name?: string
}

export interface SignOutOptions {
  allDevices?: boolean
}

export interface RefreshTokenOptions {
  refreshToken: string
}

export interface GetSessionOptions {
  force?: boolean
}

export interface AuthClientMethods {
  signIn(options: SignInOptions): Promise<AuthSession>
  signUp(options: SignUpOptions): Promise<AuthSession>
  signOut(options?: SignOutOptions): Promise<void>
  refreshToken(options: RefreshTokenOptions): Promise<AuthSession>
  getSession(options?: GetSessionOptions): Promise<AuthSession | null>
}
```

#### 4.2 HTTP Client Implementation

**File**: `src/client/index.ts`

```typescript
import type {
  AuthClientConfig,
  AuthClientMethods,
  SignInOptions,
  SignUpOptions,
  SignOutOptions,
  RefreshTokenOptions,
  GetSessionOptions,
} from './types'
import type { AuthSession } from '../core/database-adapter.interface'

export function createAuthClient(
  config: AuthClientConfig = {}
): AuthClientMethods {
  const baseURL =
    config.baseURL ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000')

  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${baseURL}/api/auth${path}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Request failed')
    }

    return response.json()
  }

  return {
    async signIn(options: SignInOptions): Promise<AuthSession> {
      return request<{ session: AuthSession }>('/sign-in/email', {
        method: 'POST',
        body: JSON.stringify({
          email: options.email,
          password: options.password,
          username: options.username,
        }),
      }).then((res) => res.session)
    },

    async signUp(options: SignUpOptions): Promise<AuthSession> {
      return request<{ session: AuthSession }>('/sign-up/email', {
        method: 'POST',
        body: JSON.stringify({
          email: options.email,
          password: options.password,
          username: options.username,
          name: options.name,
        }),
      }).then((res) => res.session)
    },

    async signOut(options?: SignOutOptions): Promise<void> {
      const params = new URLSearchParams()
      if (options?.allDevices) {
        params.set('all', 'true')
      }

      await request(`/sign-out${params ? `?${params}` : ''}`, {
        method: 'POST',
      })
    },

    async refreshToken(options: RefreshTokenOptions): Promise<AuthSession> {
      return request<{ session: AuthSession }>('/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: options.refreshToken,
        }),
      }).then((res) => res.session)
    },

    async getSession(options?: GetSessionOptions): Promise<AuthSession | null> {
      const params = new URLSearchParams()
      if (options?.force) {
        params.set('force', 'true')
      }

      try {
        const res = await request<{ session: AuthSession | null }>(
          `/get-session${params ? `?${params}` : ''}`
        )
        return res.session
      } catch {
        return null
      }
    },
  }
}
```

---

### Phase 5: React Integration (3-4 hours)

#### 5.1 React Client Config

**File**: `src/react/client.ts`

```typescript
import { createAuthClient } from '../client'
import type { AuthClientConfig } from '../client/types'

export function createReactAuthClient(config: AuthClientConfig = {}) {
  return createAuthClient(config)
}

export const authClient = createReactAuthClient()
```

#### 5.2 React Hooks

**File**: `src/react/hooks/use-auth.ts`

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'
import { authClient } from '../client'

export function useAuth() {
  const sessionQuery = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: () => authClient.getSession(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: {
      email: string
      password: string
      username?: string
    }) => authClient.signIn(credentials),
    onSuccess: () => {
      sessionQuery.refetch()
    },
  })

  const logoutMutation = useMutation({
    mutationFn: (options?: { allDevices?: boolean }) =>
      authClient.signOut(options),
    onSuccess: () => {
      sessionQuery.refetch()
    },
  })

  return {
    session: sessionQuery.data,
    user: sessionQuery.data?.user,
    isAuthenticated: !!sessionQuery.data,
    isLoading:
      sessionQuery.isLoading ||
      loginMutation.isPending ||
      logoutMutation.isPending,

    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    error: sessionQuery.error || loginMutation.error,
  }
}
```

**File**: `src/react/hooks/use-login.ts`

```typescript
import { useMutation } from '@tanstack/react-query'
import { authClient } from '../client'

export function useLogin() {
  const mutation = useMutation({
    mutationFn: (credentials: {
      email: string
      password: string
      username?: string
    }) => authClient.signIn(credentials),
  })

  return {
    login: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  }
}
```

**File**: `src/react/hooks/use-logout.ts`

```typescript
import { useMutation } from '@tanstack/react-query'
import { authClient } from '../client'

export function useLogout() {
  const mutation = useMutation({
    mutationFn: (options?: { allDevices?: boolean }) =>
      authClient.signOut(options),
  })

  return {
    logout: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
  }
}
```

**File**: `src/react/hooks/use-signup.ts`

```typescript
import { useMutation } from '@tanstack/react-query'
import { authClient } from '../client'

export function useSignUp() {
  const mutation = useMutation({
    mutationFn: (data: {
      email: string
      password: string
      username?: string
      name?: string
    }) => authClient.signUp(data),
  })

  return {
    signUp: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  }
}
```

**File**: `src/react/hooks/use-session.ts`

```typescript
import { useQuery } from '@tanstack/react-query'
import { authClient } from '../client'

export function useSession(options?: { force?: boolean }) {
  const query = useQuery({
    queryKey: ['auth', 'session', options],
    queryFn: () => authClient.getSession(options),
    staleTime: 1000 * 60 * 5,
  })

  return {
    session: query.data,
    user: query.data?.user,
    isAuthenticated: !!query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
```

**File**: `src/react/hooks/index.ts`

```typescript
export { useAuth } from './use-auth'
export { useLogin } from './use-login'
export { useLogout } from './use-logout'
export { useSignUp } from './use-signup'
export { useSession } from './use-session'
```

#### 5.3 React Provider

**File**: `src/react/providers/auth-provider.tsx`

```typescript
'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { authClient } from '../client'

interface AuthContextValue {
  client: typeof authClient
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({
  children,
  config
}: {
  children: ReactNode
  config?: Parameters<typeof authClient>[0]
}) {
  const client = authClient

  return (
    <AuthContext.Provider value={{ client }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthClient() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthClient must be used within AuthProvider')
  }
  return context.client
}
```

#### 5.4 TanStack Router Integration

**File**: `src/react/tanstack/before-load.ts`

```typescript
import { redirect } from '@tanstack/react-router'
import { authClient } from '../client'

export async function requireAuth({ location }: any) {
  const session = await authClient.getSession()

  if (!session) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    })
  }

  return session
}

export function optionalAuth() {
  const session = authClient.getSession()
  return session || null
}
```

**File**: `src/react/tanstack/index.ts`

```typescript
export { requireAuth, optionalAuth } from './before-load'
```

**File**: `src/react/index.ts`

```typescript
export { createReactAuthClient, authClient } from './client'
export { AuthProvider, useAuthClient } from './providers/auth-provider'
export * from './hooks'
export * from './tanstack'
```

---

### Phase 6: Drizzle Schema (1 hour)

**File**: `drizzle/schema.ts`

```typescript
import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').default(false).notNull(),
  username: text('username').unique(),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token'),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password'),
})

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
  },
  (table) => ({
    identifierValueUniqueIndex: unique(
      'verification_identifier_value_unique'
    ).on(table.identifier, table.value),
  })
)
```

---

### Phase 7: Unit Tests (4-5 hours, 95%+ coverage)

#### 7.1 Core Tests

**File**: `tests/core/auth-factory.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAuth } from '@/core/auth-factory'
import type { DatabaseAdapter } from '@/core/database-adapter.interface'

describe('createAuth', () => {
  let mockAdapter: DatabaseAdapter

  beforeEach(() => {
    mockAdapter = {
      getAdapter: vi.fn(() => ({ test: 'adapter' })),
      healthCheck: vi.fn(async () => true),
    }
  })

  it('should create auth instance with correct config', () => {
    const config = {
      databaseAdapter: mockAdapter,
      secret: 'test-secret',
      baseURL: 'http://localhost:3000',
    }

    const auth = createAuth(config)

    expect(auth).toBeDefined()
    expect(mockAdapter.getAdapter).toHaveBeenCalled()
  })

  it('should use default session config', () => {
    const config = {
      databaseAdapter: mockAdapter,
      secret: 'test-secret',
      baseURL: 'http://localhost:3000',
    }

    createAuth(config)

    expect(mockAdapter.getAdapter).toHaveBeenCalled()
  })

  it('should use custom session config', () => {
    const config = {
      databaseAdapter: mockAdapter,
      secret: 'test-secret',
      baseURL: 'http://localhost:3000',
      session: {
        expiresIn: 3600,
        updateAge: 1800,
      },
    }

    createAuth(config)

    expect(mockAdapter.getAdapter).toHaveBeenCalled()
  })

  it('should use custom trusted origins', () => {
    const config = {
      databaseAdapter: mockAdapter,
      secret: 'test-secret',
      baseURL: 'http://localhost:3000',
      trustedOrigins: ['http://localhost:3000', 'http://example.com'],
    }

    createAuth(config)

    expect(mockAdapter.getAdapter).toHaveBeenCalled()
  })

  it('should enable email verification when configured', () => {
    const config = {
      databaseAdapter: mockAdapter,
      secret: 'test-secret',
      baseURL: 'http://localhost:3000',
      emailVerification: {
        enabled: true,
      },
    }

    createAuth(config)

    expect(mockAdapter.getAdapter).toHaveBeenCalled()
  })
})
```

#### 7.2 Adapter Tests

**File**: `tests/adapters/drizzle-adapter.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DrizzleAdapter } from '@/adapters/drizzle.adapter'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'

describe('DrizzleAdapter', () => {
  let mockDb: PostgresJsDatabase

  beforeEach(() => {
    mockDb = {
      execute: vi.fn(),
    } as any
  })

  it('should create adapter with correct config', () => {
    const adapter = new DrizzleAdapter({
      db: mockDb,
    })

    expect(adapter.type).toBe('drizzle')
    expect(adapter.provider).toBe('pg')
  })

  it('should call getAdapter and return adapter config', () => {
    const adapter = new DrizzleAdapter({
      db: mockDb,
    })

    const result = adapter.getAdapter()

    expect(result).toBeDefined()
  })

  it('should pass health check', async () => {
    vi.mocked(mockDb.execute).mockResolvedValueOnce({} as any)

    const adapter = new DrizzleAdapter({
      db: mockDb,
    })

    const isHealthy = await adapter.healthCheck()

    expect(isHealthy).toBe(true)
    expect(mockDb.execute).toHaveBeenCalledWith(sql`SELECT 1`)
  })

  it('should fail health check on error', async () => {
    vi.mocked(mockDb.execute).mockRejectedValueOnce(new Error('DB Error'))

    const adapter = new DrizzleAdapter({
      db: mockDb,
    })

    const isHealthy = await adapter.healthCheck()

    expect(isHealthy).toBe(false)
  })
})
```

#### 7.3 Client Tests

**File**: `tests/client/auth-client.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createAuthClient } from '@/client'

describe('createAuthClient', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
    vi.stubGlobal('window', { location: { origin: 'http://localhost:3000' } })
  })

  it('should create client with default baseURL', () => {
    const client = createAuthClient()
    expect(client).toBeDefined()
  })

  it('should create client with custom baseURL', () => {
    const client = createAuthClient({ baseURL: 'http://api.example.com' })
    expect(client).toBeDefined()
  })

  it('should call signIn with correct endpoint', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ session: { user: { id: '1' } } }),
    }
    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const client = createAuthClient()
    await client.signIn({ email: 'test@example.com', password: 'password' })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/sign-in/email',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    )
  })

  it('should handle signOut correctly', async () => {
    const mockResponse = { ok: true, json: async () => ({ success: true }) }
    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const client = createAuthClient()
    await client.signOut()

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/sign-out',
      expect.objectContaining({ method: 'POST' })
    )
  })
})
```

#### 7.4 React Hook Tests

**File**: `tests/react/hooks/use-auth.test.tsx`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '@/react/hooks/use-auth'
import { authClient } from '@/react/client'

vi.mock('@/react/client')

describe('useAuth', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  it('should fetch session on mount', async () => {
    const mockSession = {
      user: { id: '1', email: 'test@example.com' },
      expiresAt: new Date()
    }
    vi.mocked(authClient.getSession).mockResolvedValueOnce(mockSession as any)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.session).toEqual(mockSession)
    })
  })

  it('should be authenticated when session exists', async () => {
    const mockSession = {
      user: { id: '1', email: 'test@example.com' },
      expiresAt: new Date()
    }
    vi.mocked(authClient.getSession).mockResolvedValueOnce(mockSession as any)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })
  })

  it('should not be authenticated when session is null', async () => {
    vi.mocked(authClient.getSession).mockResolvedValueOnce(null)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  it('should login with credentials', async () => {
    const mockSession = {
      user: { id: '1', email: 'test@example.com' },
      expiresAt: new Date()
    }
    vi.mocked(authClient.getSession).mockResolvedValueOnce(null)
    vi.mocked(authClient.signIn).mockResolvedValueOnce(mockSession as any)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await result.current.login({ email: 'test@example.com', password: 'password' })

    expect(authClient.signIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    })
  })

  it('should logout', async () => {
    vi.mocked(authClient.getSession).mockResolvedValueOnce({
      user: { id: '1', email: 'test@example.com' },
      expiresAt: new Date()
    })
    vi.mocked(authClient.signOut).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })

    await result.current.logout()

    expect(authClient.signOut).toHaveBeenCalled()
  })
})
```

---

### Phase 8: Documentation and Build (1-2 hours)

#### 8.1 Main Export

**File**: `src/index.ts`

```typescript
export * from './core'
export * from './adapters'
export * from './client'
export * from './react'
```

#### 8.2 README.md

````markdown
# @noteum/auth

Authentication package built with Better Auth, focused on Drizzle ORM + React integration.

## Features

- ✅ Email & Password authentication
- ✅ Session management
- ✅ Drizzle ORM adapter (PostgreSQL)
- ✅ React hooks and providers
- ✅ TanStack Router integration
- ✅ TypeScript-first
- ✅ Framework-agnostic core
- ✅ Single-user design

## Installation

\`\`\`bash
pnpm add @noteum/auth
\`\`\`

## Quick Start

### Server Side

\`\`\`typescript
import { createAuth } from '@noteum/auth'
import { DrizzleAdapter } from '@noteum/auth/adapters'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client)

const drizzleAdapter = new DrizzleAdapter({ db })

const auth = createAuth({
databaseAdapter: drizzleAdapter,
secret: process.env.JWT_SECRET,
baseURL: 'http://localhost:3000'
})
\`\`\`

Mount Better Auth handler to your server (see [Better Auth docs](https://better-auth.com)).

### Client Side (React)

\`\`\`tsx
import { AuthProvider, useAuth } from '@noteum/auth/react'

function App() {
return (
<AuthProvider>
<Dashboard />
</AuthProvider>
)
}

function Dashboard() {
const { session, user, isAuthenticated, logout } = useAuth()

if (!isAuthenticated) {
return <div>Loading...</div>
}

return (
<div>
<h1>Welcome, {user?.name || user?.email}</h1>
<button onClick={logout}>Logout</button>
</div>
)
}
\`\`\`

### With TanStack Router

\`\`\`tsx
import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@noteum/auth/react/tanstack'

export const Route = createFileRoute('/dashboard')({
beforeLoad: requireAuth,
component: Dashboard
})
\`\`\`

## API

### Core

- \`createAuth(config)\` - Create Better Auth instance
- \`DrizzleAdapter\` - Drizzle ORM adapter

### React Hooks

- \`useAuth()\` - Main auth hook with session, login, logout
- \`useLogin()\` - Login hook
- \`useLogout()\` - Logout hook
- \`useSignUp()\` - Sign up hook
- \`useSession()\` - Session hook

### Components

- \`AuthProvider\` - React context provider

### TanStack Router

- \`requireAuth()\` - Protect routes
- \`optionalAuth()\` - Optional auth

## Database Schema

Use provided Drizzle schema in \`@noteum/auth/drizzle/schema\`:

\`\`\`typescript
import { user, session, account, verification } from '@noteum/auth/drizzle/schema'
\`\`\`

Run Better Auth CLI to create tables:

\`\`\`bash
npx @better-auth/cli generate
\`\`\`

## License

MIT
\`\`\`

---

## 🧪 Testing Strategy

### Coverage Requirements

- **Minimum**: 95% coverage across all metrics
- **Target**: 98%+ for core and adapter code
- **Exclusions**: Types, index files, config files

### Test Categories

1. **Unit Tests**: All individual functions and classes
2. **Integration Tests**: React hooks with mocked dependencies
3. **No E2E Tests**: Use manual testing or integration in services layer

### Test Execution

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# UI mode
pnpm test:ui

# Coverage report
pnpm test
# Check coverage/report/index.html
```
````

---

## 🔨 Build and Deployment

### Build Commands

```bash
# Build package
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint

# Format
pnpm format
```

### Build Output

- CommonJS: `dist/*.js`
- ES Modules: `dist/*.mjs`
- Type Definitions: `dist/*.d.ts`

---

## 📊 Timeline

| Phase       | Tasks                             | Est. Time       | Dependencies |
| ----------- | --------------------------------- | --------------- | ------------ |
| **Phase 1** | Project initialization and config | 1-2 hours       | -            |
| **Phase 2** | Core functionality                | 2-3 hours       | Phase 1      |
| **Phase 3** | Drizzle adapter                   | 1-2 hours       | Phase 1, 2   |
| **Phase 4** | Client SDK                        | 2-3 hours       | Phase 2      |
| **Phase 5** | React integration                 | 3-4 hours       | Phase 4      |
| **Phase 6** | Drizzle schema                    | 1 hour          | -            |
| **Phase 7** | Unit tests (95%+ coverage)        | 4-5 hours       | All previous |
| **Phase 8** | Documentation and build           | 1-2 hours       | All previous |
| **Total**   | **All phases**                    | **15-22 hours** | -            |

---

## ✅ Checklist

### Project Structure

- [ ] All directories created
- [ ] `package.json` configured
- [ ] `tsconfig.json` configured
- [ ] `tsup.config.ts` configured
- [ ] `vitest.config.ts` configured

### Core Functionality

- [ ] `database-adapter.interface.ts` implemented
- [ ] `auth-config.types.ts` implemented
- [ ] `auth-factory.ts` implemented
- [ ] Unit tests completed (95%+ coverage)

### Drizzle Adapter

- [ ] `drizzle.adapter.ts` implemented
- [ ] Unit tests completed (95%+ coverage)

### Client SDK

- [ ] `client/types.ts` implemented
- [ ] `client/index.ts` implemented
- [ ] Unit tests completed (95%+ coverage)

### React Integration

- [ ] `react/client.ts` implemented
- [ ] All hooks implemented (`use-auth`, `use-login`, `use-logout`, `use-signup`, `use-session`)
- [ ] `AuthProvider` implemented
- [ ] TanStack Router integration (`requireAuth`, `optionalAuth`)
- [ ] All hooks unit tests (95%+ coverage)

### Drizzle Schema

- [ ] `drizzle/schema.ts` implemented (single-user design)

### Documentation and Build

- [ ] `README.md` completed with examples
- [ ] Build successful (`pnpm build`)
- [ ] Type check passed (`pnpm type-check`)
- [ ] Tests passed with coverage ≥95% (`pnpm test`)

---

## 📚 Additional Resources

- [Better Auth Documentation](https://better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Vitest Documentation](https://vitest.dev/)

---

## 📝 Notes

- This package is **not** responsible for services layer integration
- Services layer will implement its own NestJS auth module
- This package is **not** responsible for database migrations
- Use Better Auth CLI to generate migrations
- Tests should be **isolated** and fast, no external dependencies
- All code should be **well-documented** with JSDoc comments

---

_Last updated: 2025-01-XX_
