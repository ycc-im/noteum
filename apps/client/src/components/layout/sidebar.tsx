import { Link } from '@tanstack/react-router'
import { useAppStore } from '@/stores'

export function Sidebar() {
  const { sidebarOpen } = useAppStore()

  if (!sidebarOpen) {
    return null
  }

  return (
    <aside className="w-64 border-r border-border bg-background">
      <div className="flex h-full flex-col">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Navigation</h2>
          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center p-2 rounded-md hover:bg-accent text-sm"
              activeProps={{
                className: 'bg-accent text-accent-foreground',
              }}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>

            <Link
              to="/notebooks"
              className="flex items-center p-2 rounded-md hover:bg-accent text-sm"
              activeProps={{
                className: 'bg-accent text-accent-foreground',
              }}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Notebooks
            </Link>

            <Link
              to="/notes"
              className="flex items-center p-2 rounded-md hover:bg-accent text-sm"
              activeProps={{
                className: 'bg-accent text-accent-foreground',
              }}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Notes
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            <p>Quick Actions</p>
          </div>
          <div className="mt-2 space-y-2">
            <button className="w-full flex items-center p-2 rounded-md hover:bg-accent text-sm">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </button>
            <button className="w-full flex items-center p-2 rounded-md hover:bg-accent text-sm">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Notebook
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}