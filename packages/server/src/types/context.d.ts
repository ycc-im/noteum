import { FastifyRequest } from 'fastify';
export interface Context {
    req: FastifyRequest;
    user?: {
        id: string;
    };
}
export interface CreateContextOptions {
    req: FastifyRequest;
}
//# sourceMappingURL=context.d.ts.map