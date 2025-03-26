'use client'

import { type ReactNode } from 'react'
import { ReactFlow, addEdge, useNodesState, useEdgesState } from '@xyflow/react'
import type { Connection, Edge, Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: '输入节点' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: '默认节点' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: '输出节点' },
    position: { x: 250, y: 250 },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
]

export function FlowDemoClient(): ReactNode {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // 处理新连接线的创建
  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge({ ...params, id: `e${params.source}-${params.target}` }, eds))
  }

  if (typeof window === 'undefined') {
    return null
  }

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 8rem)' }}>
      <div className="bg-white/80 p-4 rounded-lg shadow absolute top-4 left-4 z-10">
        <h3 className="text-lg font-semibold mb-2">流程图控制面板</h3>
        <p className="text-sm text-gray-600 mb-2">可以拖拽节点和创建连接</p>
        <ul className="text-sm text-gray-600">
          <li>• 拖动节点改变位置</li>
          <li>• 从节点连接点拖动创建新连接</li>
          <li>• 使用鼠标滚轮缩放画布</li>
        </ul>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-right"
      />
    </div>
  )
}
