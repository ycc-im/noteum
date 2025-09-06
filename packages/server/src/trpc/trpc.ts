import { initTRPC, TRPCError } from '@trpc/server';

// Initialize tRPC
const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof Error ? error.cause : null,
      },
    };
  },
});

// Export router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// In the future, we can add middleware here for:
// - Authentication
// - Rate limiting
// - Logging
// - Context injection

// Example protected procedure (for future use)
export const protectedProcedure = publicProcedure.use(({ next }) => {
  // TODO: Add authentication middleware
  // For now, just pass through
  return next();
});

export { TRPCError };