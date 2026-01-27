## Skill: convex

**Base directory**: /Users/jia.xia/development/noteum/.claude/skills/convex

# Convex Skill

Comprehensive assistance with Convex development, covering real-time queries, mutations, actions, and schema management.

## When to Use This Skill

This skill should be triggered when:

- **Developing with Convex**: Creating or modifying backend functions (queries, mutations, actions).
- **Database Schema Management**: Defining or updating the database structure in `schema.ts`.
- **Real-time UI Requirements**: Implementing reactive UI components that need to sync with the database automatically.
- **Type-safe Full-stack Development**: Ensuring end-to-end type safety between backend and frontend.
- **Transactional Logic**: Implementing atomic database operations.

## Quick Reference

### Core Backend Functions

**1. Schema Definition (`convex/schema.ts`)**

```typescript
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    author: v.string(),
  }).index('by_author', ['author']),
})
```

**2. Query (Read - Reactive)**

```typescript
import { query } from './_generated/server'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('messages').collect()
  },
})
```

**3. Mutation (Write - Atomic)**

```typescript
import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert('messages', { body: args.body, author: args.author })
  },
})
```

**4. Action (Side Effects - Third-party APIs)**

```typescript
import { action } from './_generated/server'
import { v } from 'convex/values'
import { api } from './_generated/api'

export const doSomething = action({
  args: { input: v.string() },
  handler: async (ctx, args) => {
    // Call external API
    const response = await fetch('https://api.example.com')
    const data = await response.json()

    // Call a mutation to save the result
    await ctx.runMutation(api.messages.send, {
      body: data.message,
      author: 'AI Assistant',
    })
  },
})
```

### Frontend Hooks (React)

```tsx
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'

function App() {
  const messages = useQuery(api.messages.list)
  const sendMessage = useMutation(api.messages.send)

  const handleClick = async () => {
    await sendMessage({ body: 'Hello!', author: 'User' })
  }

  return (
    <div>
      {messages?.map((msg) => (
        <div key={msg._id}>
          {msg.author}: {msg.body}
        </div>
      ))}
      <button onClick={handleClick}>Send</button>
    </div>
  )
}
```

## Reference Files

Detailed guides are available in `references/`:

- **`concepts.md`**: Deep dive into Queries, Mutations, Actions, and the Convex execution model.
- **`schema_and_types.md`**: Best practices for schema design, validation, and using `v` (Convex values).
- **`auth_and_security.md`**: Integrating authentication (Clerk, Auth0) and defining Row-Level Security.
- **`storage_and_search.md`**: Handling file uploads and implementing vector/full-text search.

## Working with This Skill

### For Beginners

1. Start by defining your data in `convex/schema.ts`.
2. Write a `query` to fetch data and a `mutation` to change it.
3. Use the `useQuery` hook in your React component to see real-time updates without `useEffect`.

### For Advanced Users

- Use **Actions** for non-deterministic code (AI, webhooks).
- Utilize **Internal Functions** (`internalQuery`, `internalMutation`) for logic that shouldn't be exposed to the frontend.
- Implement **Optimistic Updates** to make the UI feel instantaneous.
- Use **Scheduled Functions** and **Cron Jobs** for background processing.

## Best Practices

- **Deterministic Queries**: Keep queries pure. No `Math.random()` or `Date.now()` inside them.
- **Indexing**: Always use indexes for large table scans.
- **ACID Transactions**: Mutations are atomic; if one part fails, the whole mutation rolls back.
- **Validation**: Use `v` to strictly type all function arguments.
