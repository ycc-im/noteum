import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../modules/router';

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export type { AppRouter } from '../modules/router';
export type { RouterDefinition, ExampleResponse, ExampleInput, CreateRouter } from '../types/router';
export { exampleInputSchema } from '../types/router';
export type { Context, CreateContextOptions } from '../types/context';

