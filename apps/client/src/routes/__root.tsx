import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ShortcutProvider } from '@/components/shortcuts/ShortcutProvider'
import { TrpcProvider } from '@/providers/TrpcProvider'
import { Layout } from '@/components/layout/Layout'

export const Route = createFileRoute('/')({
  component: () => (
    <TrpcProvider>
      <ShortcutProvider>
        <Layout>
          <Outlet />
        </Layout>
      </ShortcutProvider>
    </TrpcProvider>
  ),
})
