import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/core/index.ts',
    'src/adapters/index.ts',
    'src/client/index.ts',
    'src/react/index.ts',
  ],
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'better-auth',
    '@tanstack/react-query',
    '@tanstack/react-router',
    'drizzle-orm',
    'react',
    'react-dom',
    'postgres',
  ],
  tsupOptions: {
    noExternal: ['react'],
  },
})
