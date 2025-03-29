import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { pingService } from '../services/dataService'

export const Route = createFileRoute('/ping')({
  component: PingComponent,
})

function PingComponent() {
  // 使用 React Query 调用 ping 服务
  const pingQuery = useQuery({
    queryKey: ['serverPing'],
    queryFn: async () => {
      try {
        const result = await pingService.ping()
        return {
          success: true,
          message: result || 'pong',
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        console.error('Ping error:', error)
        return {
          success: false,
          message: '无法连接到服务器',
          timestamp: new Date().toISOString(),
        }
      }
    },
    refetchOnWindowFocus: false,
  })

  return (
    <div className={`p-2`}>
      <div className={`text-lg`}>Welcome Home!</div>
      <hr className={`my-2`} />
      <a
        href="/dashboard/posts/3"
        className="py-1 px-2 text-xs bg-blue-500 text-white rounded-full"
      >
        1 New Invoice
      </a>

      <div className="my-4 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Ping Server Status:</h2>
        {pingQuery.isLoading ? (
          <div className="text-gray-500">Loading server status...</div>
        ) : pingQuery.isError ? (
          <div className="text-red-500">Error: {pingQuery.error.message}</div>
        ) : (
          <div className="space-y-2">
            <div
              className={`font-medium ${
                pingQuery.data?.success ? 'text-green-600' : 'text-red-600'
              }`}
            >
              Status: {pingQuery.data?.success ? 'Online' : 'Offline'}
            </div>
            <div>Message: {pingQuery.data?.message || 'No message available'}</div>
            <div className="text-sm text-gray-500">
              Timestamp: {pingQuery.data?.timestamp || new Date().toISOString()}
            </div>
          </div>
        )}
      </div>

      <hr className={`my-2`} />
      <div className={`max-w-xl`}>
        As you navigate around take note of the UX. It should feel suspense-like, where routes are
        only rendered once all of their data and elements are ready.
        <hr className={`my-2`} />
        To exaggerate async effects, play with the artificial request delay slider in the
        bottom-left corner.
        <hr className={`my-2`} />
        The last 2 sliders determine if link-hover preloading is enabled (and how long those
        preloads stick around) and also whether to cache rendered route data (and for how long).
        Both of these default to 0 (or off).
      </div>
    </div>
  )
}
