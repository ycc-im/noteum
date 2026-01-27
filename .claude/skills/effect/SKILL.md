## Skill: effect

**Base directory**: /Users/jia.xia/development/noteum/.claude/skills/effect

# Effect Skill

Comprehensive assistance with Effect development, covering the ecosystem for building robust, type-safe, and observable applications in TypeScript.

## When to Use This Skill

This skill should be triggered when:

- **Functional Programming in TS**: Implementing complex logic using functional patterns.
- **Error Handling**: Managing expected and unexpected errors with type-safety (instead of try/catch).
- **Dependency Injection**: Using `Layer` and `Context` for modular and testable code.
- **Concurrency & Parallelism**: Managing fibers, interruptions, and parallel execution.
- **Resource Management**: Ensuring resources (files, sockets) are safely acquired and released using `Scope`.
- **Schema & Validation**: Using `@effect/schema` for data parsing and transformation.

## Quick Reference

### Core Building Blocks

**1. The Effect Type: `Effect<Success, Error, Requirements>`**

```typescript
import { Effect, Console } from 'effect'

// A simple effect that requires nothing, might fail with nothing, and returns void
const program = Console.log('Hello, Effect!')

// Running the effect
Effect.runSync(program)
```

**2. Error Management (`Effect.fail`, `Effect.catchTag`)**

```typescript
const divide = (a: number, b: number) =>
  b === 0
    ? Effect.fail({ _tag: 'DivideByZero' as const })
    : Effect.succeed(a / b)

const recovered = pipe(
  divide(10, 0),
  Effect.catchTag('DivideByZero', () => Effect.succeed(0))
)
```

**3. Dependency Injection (Services & Layers)**

```typescript
import { Context, Layer, Effect } from 'effect'

// 1. Define Service Interface
class Database extends Context.Tag('Database')<
  Database,
  { readonly getUsers: Effect.Effect<string[], Error> }
>() {}

// 2. Implementation
const DatabaseLive = Layer.succeed(
  Database,
  Database.of({ getUsers: Effect.succeed(['Alice', 'Bob']) })
)

// 3. Usage
const main = Effect.gen(function* (_) {
  const db = yield* _(Database)
  const users = yield* _(db.getUsers)
  return users
})

const runnable = Effect.provide(main, DatabaseLive)
```

**4. Concurrency**

```typescript
// Parallel execution
const results =
  yield * _(Effect.all([task1, task2], { concurrency: 'unbounded' }))

// Racing effects
const winner = yield * _(Effect.race(effectA, effectB))
```

## Reference Files

Detailed guides are available in `references/`:

- **`core_types.md`**: Understanding Effect, Option, Either, and Exit.
- **`services_layers.md`**: Deep dive into Context, Tags, and modular architecture.
- **`error_management.md`**: Handling failures, defects, and retries.
- **`resource_management.md`**: Using Scope and localized resources.
- **`schema.md`**: Data modeling and validation with `@effect/schema`.

## Working with This Skill

### For Beginners

1. Use `Effect.gen` (Generators) for a cleaner, async/await-like syntax.
2. Replace `throw` with `Effect.fail` to track errors in types.
3. Start with simple functions before moving to `Layer` and `Context`.

### For Advanced Users

- Use **Fibers** for manual concurrency control.
- Implement **Runtime** customization for specialized execution environments.
- Use **PubSub** or **Queue** for inter-fiber communication.
- Leverage **Metrics** and **Tracing** for observability.

## Best Practices

- **Pipe vs Gen**: Use `pipe` for simple transformations, `Effect.gen` for complex logic flow.
- **Tag Naming**: Use unique strings for `Context.Tag` to avoid collisions.
- **Composition**: Build small, focused Layers and compose them using `Layer.provide` or `Layer.merge`.
- **Tracing**: Always add `.pipe(Effect.withSpan("name"))` for better debugging.
