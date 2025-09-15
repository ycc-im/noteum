import React, { useCallback } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { CustomNode } from './nodes/CustomNode'
import { AINode } from './nodes/AINode'
import { CustomEdge } from './edges/CustomEdge'

const nodeTypes = {
  customNode: CustomNode,
  aiNode: AINode,
}

const edgeTypes = {
  customEdge: CustomEdge,
}

export interface FlowCanvasProps {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onNodesChange?: (nodes: Node[]) => void
  onEdgesChange?: (edges: Edge[]) => void
  className?: string
  style?: React.CSSProperties
  fitView?: boolean
  interactive?: boolean
  showControls?: boolean
  showMiniMap?: boolean
  showBackground?: boolean
  backgroundVariant?: BackgroundVariant
}

export function FlowCanvas({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
  className,
  style,
  fitView = true,
  interactive = true,
  showControls = true,
  showMiniMap = true,
  showBackground = true,
  backgroundVariant = BackgroundVariant.Dots,
}: FlowCanvasProps) {
  const [nodes, , onNodesStateChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesStateChange] = useEdgesState(initialEdges)

  // 处理节点变化
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesStateChange(changes)
      if (onNodesChange) {
        // 获取变化后的节点
        const updatedNodes = nodes // 这里需要根据changes计算新的nodes
        onNodesChange(updatedNodes)
      }
    },
    [onNodesStateChange, onNodesChange, nodes]
  )

  // 处理边变化  
  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesStateChange(changes)
      if (onEdgesChange) {
        const updatedEdges = edges // 这里需要根据changes计算新的edges
        onEdgesChange(updatedEdges)
      }
    },
    [onEdgesStateChange, onEdgesChange, edges]
  )

  // 处理连接
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        ...connection,
        id: `${connection.source}-${connection.target}`,
        type: 'customEdge',
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges]
  )

  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView={fitView}
        nodesDraggable={interactive}
        nodesConnectable={interactive}
        elementsSelectable={interactive}
      >
        {showControls && <Controls />}
        {showMiniMap && (
          <MiniMap
            nodeStrokeColor="#374151"
            nodeColor="#f3f4f6"
            nodeBorderRadius={8}
            position="top-right"
          />
        )}
        {showBackground && <Background variant={backgroundVariant} gap={12} size={1} />}
      </ReactFlow>
    </div>
  )
}