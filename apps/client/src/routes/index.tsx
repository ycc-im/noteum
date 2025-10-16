import { createRootRoute, Outlet } from '@tanstack/react-router'

export const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <h1 className="text-lg font-semibold">Noteum</h1>
          <nav className="flex items-center space-x-6 text-sm font-medium ml-6">
            <a href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Dashboard</a>
            <a href="/notebooks" className="transition-colors hover:text-foreground/80 text-foreground/60">Notebooks</a>
            <a href="/notes" className="transition-colors hover:text-foreground/80 text-foreground/60">Notes</a>
            <a href="/settings" className="transition-colors hover:text-foreground/80 text-foreground/60">Settings</a>
          </nav>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  ),
})