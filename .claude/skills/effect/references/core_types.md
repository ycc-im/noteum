# Effect Core: Gen, Errors, and Services

## Why Effect?

Effect provides a unified toolkit for things that are usually fragmented in TS:

- **Async/Await**: Replaced by a more powerful fiber-based model.
- **Inversify/NestJS**: Replaced by type-safe `Layer` system.
- **Zod**: Replaced by `@effect/schema`.
- **Axios/Fetch**: Replaced by `@effect/platform/HttpClient`.

## Effect.gen

The generator syntax is the recommended way to write Effect code. It allows you to "yield" effects, automatically handling the requirements and errors.

```typescript
const program = Effect.gen(function* (_) {
  const config = yield* _(ConfigService)
  const data = yield* _(fetchData(config.url))
  return data
})
```

## Error Handling

Effect distinguishes between:

1. **Expected Errors**: Part of the `Error` type parameter (e.g., `ValidationError`).
2. **Defects**: Unexpected crashes (e.g., `DivisionByZero`, `OutOfMemory`).

Use `Effect.catchAll`, `Effect.catchTag`, or `Effect.retry` to manage these.
