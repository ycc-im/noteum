import { Outlet } from '@tanstack/react-router'

export function App() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}