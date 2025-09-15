import { useState, useCallback } from 'react'
import { Node, Edge } from 'reactflow'
import { FlowCanvas } from '../components/react-flow/FlowCanvas'

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'customNode',
    position: { x: 250, y: 25 },
    data: {
      label: '工作流开始',
      description: '拖拽添加新节点',
      type: 'input'
    },
  },
]

const initialEdges: Edge[] = []

export function WorkflowEditor() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [nodeId, setNodeId] = useState(1)

  const addNode = useCallback((type: 'process' | 'ai' | 'output') => {
    const newNode: Node = {
      id: `node-${nodeId}`,
      type: type === 'ai' ? 'aiNode' : 'customNode',
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 100 },
      data: type === 'ai' ? {
        title: '新AI节点',
        content: '请配置AI处理逻辑和参数设置。',
        aiModel: 'GPT-4',
        status: 'idle' as const,
        confidence: 0
      } : {
        label: type === 'process' ? '处理节点' : '输出节点',
        description: `新的${type === 'process' ? '处理' : '输出'}节点`,
        type: type as any
      },
    }
    
    setNodes((nds) => [...nds, newNode])
    setNodeId((id) => id + 1)
  }, [nodeId])

  const clearFlow = useCallback(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
    setNodeId(1)
  }, [])

  const exportFlow = useCallback(() => {
    const flowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString()
    }
    console.log('导出工作流:', flowData)
    // 这里可以添加实际的导出逻辑
    alert('工作流数据已输出到控制台')
  }, [nodes, edges])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* 工具栏 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 10,
        display: 'flex',
        gap: '8px',
        padding: '8px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <button
          onClick={() => addNode('process')}
          style={{
            padding: '6px 12px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          + 处理节点
        </button>
        <button
          onClick={() => addNode('ai')}
          style={{
            padding: '6px 12px',
            background: '#10b981',
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          + AI节点
        </button>
        <button
          onClick={() => addNode('output')}
          style={{
            padding: '6px 12px',
            background: '#ef4444',
            color: 'white',
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          + 输出节点
        </button>
        <div style={{ borderLeft: '1px solid #e5e7eb', margin: '0 4px' }} />
        <button
          onClick={exportFlow}
          style={{
            padding: '6px 12px',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          导出
        </button>
        <button
          onClick={clearFlow}
          style={{
            padding: '6px 12px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          清空
        </button>
      </div>

      {/* 流程画布 */}
      <FlowCanvas
        initialNodes={nodes}
        initialEdges={edges}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        fitView={false}
        showControls={true}
        showMiniMap={true}
        showBackground={true}
      />

      {/* 状态信息 */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        padding: '8px 12px',
        background: 'white',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        节点: {nodes.length} | 连接: {edges.length}
      </div>
    </div>
  )
}