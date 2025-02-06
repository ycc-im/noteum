import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { CreateContextOptions } from '@noteum/core/types';

export function createContext({ req }: CreateFastifyContextOptions) {
  const ctx: CreateContextOptions = { req };
  return ctx;
}
