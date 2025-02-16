import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../src/modules/router.js';

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export type { AppRouter } from '../src/modules/router.js';
export type { RouterDefinition, ExampleResponse, ExampleInput, CreateRouter } from '../src/types/router.js';
export { exampleInputSchema } from '../src/types/router.js';
export type { Context, CreateContextOptions } from '../src/types/context.js';
