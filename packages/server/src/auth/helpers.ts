import { TRPCError } from '@trpc/server';
import { Context } from '../trpc/trpc';

/**
 * Extract user ID from tRPC context
 * Throws UNAUTHORIZED error if user is not authenticated
 */
export function getUserIdFromContext(ctx: Context): string {
  const userId = ctx.user?.sub;

  if (!userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User ID not found in token',
    });
  }

  return userId;
}

/**
 * Extract user email from tRPC context
 * Returns null if email is not available
 */
export function getUserEmailFromContext(ctx: Context): string | null {
  return ctx.user?.email || null;
}

/**
 * Extract user information from tRPC context
 * Throws UNAUTHORIZED error if user is not authenticated
 */
export function getUserFromContext(ctx: Context) {
  const user = ctx.user;

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found in token',
    });
  }

  return {
    id: user.sub,
    email: user.email,
    name: user.name,
    picture: user.picture,
    logtoId: user.sub,
  };
}
