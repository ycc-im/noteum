import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  sourcemap: true,
  external: ['ai', 'zod', '@ai-sdk/openai', '@ai-sdk/anthropic'],
  treeshake: true,
})
