# Convex Concepts & Best Practices

## Execution Model

Convex functions run in a specialized environment.

- **Queries**: Must be deterministic. They are cached and re-run automatically when underlying data changes.
- **Mutations**: Atomic transactions. All changes are committed at once or not at all.
- **Actions**: Run in a standard Node.js environment. Used for side effects like calling external APIs. Actions cannot directly read/write the database; they must call queries or mutations.

## Data Modeling

- **Document IDs**: Every document has a unique `_id` and `_creationTime`.
- **Relationships**: Store the `_id` of the related document. Use indexes to query the "many" side of a relationship.

## Common Patterns

- **Pagination**: Use `.paginate(opts)` for large lists.
- **Search**: Define search indexes in schema and use `withSearchIndex`.
- **Vector Search**: Essential for AI/RAG applications.
