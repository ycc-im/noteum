import { createContext, useContext, ReactNode } from 'react'
import { LogtoProvider } from '@logto/react'
import { logtoConfig } from '../lib/logto'

interface AuthProviderProps {
  children: ReactNode
}

// Create a context for additional auth state if needed
const AuthContext = createContext<{}>({})

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <LogtoProvider config={logtoConfig}>
      <AuthContext.Provider value={{}}>
        {children}
      </AuthContext.Provider>
    </LogtoProvider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}