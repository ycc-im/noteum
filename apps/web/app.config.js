import { createApp } from 'vinxi'
import reactRefresh from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default createApp({
  server: {
    preset: 'bun', // change to 'netlify' or 'bun' or anyof the supported presets for nitro (nitro.unjs.io)
    experimental: {
      asyncContext: true,
    },
  },
  routers: [
    {
      type: 'static',
      name: 'public',
      dir: './public',
    },
    {
      type: 'spa',
      name: 'client',
      handler: './index.html',
      target: 'browser',
      plugins: () => [
        TanStackRouterVite({
          target: 'react',
          autoCodeSplitting: true,
          routesDirectory: './app/routes',
          generatedRouteTree: './app/routeTree.gen.ts',
          fileExtensions: ['.tsx', '.ts'],
          disableExtensions: ['.js', '.jsx'],
        }),
        reactRefresh(),
      ],
    },
  ],
})
