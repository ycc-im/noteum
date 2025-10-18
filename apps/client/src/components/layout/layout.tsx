import { Outlet } from '@tanstack/react-router'
import { Header } from './header'
import { Sidebar } from './sidebar'

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
