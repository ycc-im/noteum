import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../src/modules/router';
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type { AppRouter } from '../src/modules/router';
export type { RouterDefinition, ExampleResponse, ExampleInput, CreateRouter } from '../src/types/router';
export { exampleInputSchema } from '../src/types/router';
export type { Context, CreateContextOptions } from '../src/types/context';
//# sourceMappingURL=index.d.ts.map