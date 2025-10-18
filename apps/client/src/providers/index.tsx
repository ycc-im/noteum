import React from 'react'
import { ThemeProvider } from './theme-provider'
import { RouterProviders } from './router-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="noteum-ui-theme">
      <RouterProviders />
      {children}
    </ThemeProvider>
  )
}
