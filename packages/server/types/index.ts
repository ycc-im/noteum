import { FastifyRequest } from 'fastify';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../src/modules/router';

export interface Context {
  req: FastifyRequest;
}

export type CreateContextOptions = {
  req: FastifyRequest;
};

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export type { AppRouter } from '../src/modules/router';
