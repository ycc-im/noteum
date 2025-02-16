import { z } from 'zod';
export interface RouterDefinition {
    example: {
        hello: {
            input?: ExampleInput;
            output: ExampleResponse;
        };
        secretData: {
            input?: void;
            output: ExampleResponse;
        };
    };
}
export declare const exampleInputSchema: z.ZodDefault<z.ZodOptional<z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>>>;
export interface ExampleInput {
    name?: string;
}
export interface ExampleResponse {
    message: string;
    timestamp: string;
}
export type CreateRouter = () => RouterDefinition;
//# sourceMappingURL=router.d.ts.map