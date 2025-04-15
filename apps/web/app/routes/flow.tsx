import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { FlowDemoClient } from './-components/flow/FlowDemo.client'

function FlowPage(): ReactNode {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">工作流程图演示</h1>
      {typeof window !== 'undefined' && <FlowDemoClient />}
    </div>
  )
}

export const Route = createFileRoute('/flow')({
  component: FlowPage,
})
