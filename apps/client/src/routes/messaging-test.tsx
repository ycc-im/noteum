import { createFileRoute } from '@tanstack/react-router'
import MessagingTestDashboard from '@/components/messaging-test-dashboard'
import MessagingCharts from '@/components/messaging-charts'

export const Route = createFileRoute('/messaging-test')({
  component: function MessagingTest() {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <MessagingTestDashboard />
          <div className="mt-8">
            <MessagingCharts />
          </div>
        </div>
      </div>
    )
  },
})