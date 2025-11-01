import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ShortcutProvider } from '@/components/shortcuts/shortcut-provider'
import { TrpcProvider } from '@/providers/trpc-provider'
import { Layout } from '@/components/layout/layout'

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
