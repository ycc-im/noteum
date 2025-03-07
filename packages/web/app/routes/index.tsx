import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  // 使用直接的fetch调用服务器的ping接口
  const pingQuery = useQuery({
    queryKey: ['serverPing'],
    queryFn: async () => {
      try {
        // 调用外部服务器的ping接口
        const response = await fetch('http://localhost:9157/trpc/ping')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        return {
          success: true,
          message: data.result?.data || 'pong',
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        console.error('Fetch error:', error)
        return {
          success: false,
          message: 'Could not connect to server',
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
              className={`font-medium ${pingQuery.data.success ? 'text-green-600' : 'text-red-600'}`}
            >
              Status: {pingQuery.data.success ? 'Online' : 'Offline'}
            </div>
            <div>Message: {pingQuery.data.message}</div>
            <div className="text-sm text-gray-500">Timestamp: {pingQuery.data.timestamp}</div>
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
