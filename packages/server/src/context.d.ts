import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
export type Context = {
    req: CreateFastifyContextOptions['req'];
};
export declare function createContext({ req }: CreateFastifyContextOptions): Context;
//# sourceMappingURL=context.d.ts.map