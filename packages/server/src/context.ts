import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export type Context = {
  req: CreateFastifyContextOptions['req'];
};

export function createContext({ req }: CreateFastifyContextOptions): Context {
  return { req };
}
