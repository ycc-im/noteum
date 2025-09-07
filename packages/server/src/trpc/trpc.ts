import { initTRPC, TRPCError } from '@trpc/server';
import { AuthInfo } from '../auth/jwt-validator';

// Define the context type
export interface Context {
  user?: AuthInfo;
}

// Initialize tRPC with context
const t = initTRPC.context<Context>().create({
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

// Authentication middleware
const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Protected procedure that requires authentication
export const protectedProcedure = publicProcedure.use(authMiddleware);

export { TRPCError };