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
