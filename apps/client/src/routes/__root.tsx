import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ShortcutProvider } from '@/components/shortcuts/shortcut-provider'
import { TrpcProvider } from '@/providers/trpc-provider'

export const Route = createFileRoute('/')({
  component: () => (
    <TrpcProvider>
      <ShortcutProvider>
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
          <header
            style={{
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: 'white',
            }}
          >
            <div
              style={{
                display: 'flex',
                height: '56px',
                alignItems: 'center',
                padding: '0 16px',
              }}
            >
              <h1
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0,
                }}
              >
                Noteum
              </h1>
              <nav
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  marginLeft: '24px',
                }}
              >
                <a
                  href="/today"
                  style={{
                    textDecoration: 'none',
                    color: '#6b7280',
                    fontSize: '14px',
                  }}
                >
                  Today
                </a>
                <a
                  href="/dashboard"
                  style={{
                    textDecoration: 'none',
                    color: '#6b7280',
                    fontSize: '14px',
                  }}
                >
                  Dashboard
                </a>
                <a
                  href="/notebooks"
                  style={{
                    textDecoration: 'none',
                    color: '#6b7280',
                    fontSize: '14px',
                  }}
                >
                  Notebooks
                </a>
                <a
                  href="/notes"
                  style={{
                    textDecoration: 'none',
                    color: '#6b7280',
                    fontSize: '14px',
                  }}
                >
                  Notes
                </a>
                <a
                  href="/socket-status"
                  style={{
                    textDecoration: 'none',
                    color: '#6b7280',
                    fontSize: '14px',
                  }}
                >
                  Socket Status
                </a>
                <a
                  href="/settings"
                  style={{
                    textDecoration: 'none',
                    color: '#6b7280',
                    fontSize: '14px',
                  }}
                >
                  Settings
                </a>
              </nav>
            </div>
          </header>
          <main style={{ padding: '24px' }}>
            <Outlet />
          </main>
        </div>
      </ShortcutProvider>
    </TrpcProvider>
  ),
})
