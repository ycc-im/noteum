import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { migrationService } from '@/lib/database/migration'

interface AppInitProps {
  children: React.ReactNode
}

export function AppInit({ children }: AppInitProps) {
  const { initializeAuth, isInitialized } = useAuthStore()

  useEffect(() => {
    // Initialize the app on mount
    const initApp = async () => {
      try {
        // Log migration status for debugging
        await migrationService.logMigrationStatus()

        // Initialize authentication (includes migration)
        if (!isInitialized) {
          await initializeAuth()
        }
      } catch (error) {
        console.error('App initialization failed:', error)
      }
    }

    initApp()
  }, [initializeAuth, isInitialized])

  // Show loading during initialization
  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div style={{ fontSize: '16px', color: '#666' }}>
          Initializing application...
        </div>
        <style>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    )
  }

  return <>{children}</>
}
