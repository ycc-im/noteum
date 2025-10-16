import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  external: [],
  splitting: false,
  sourcemap: true,
  minify: false,
})