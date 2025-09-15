
import { Node, Edge } from 'reactflow'
import { FlowCanvas } from '../components/react-flow/FlowCanvas'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 250, y: 25 },
    data: { 
      label: '开始',
      description: '工作流开始节点',
      type: 'input'
    },
  },
  {
    id: '2',
    type: 'customNode',
    position: { x: 100, y: 125 },
    data: { 
      label: '数据处理',
      description: '处理输入数据',
      type: 'process'
    },
  },
  {
    id: '3',
    type: 'customNode',
    position: { x: 400, y: 125 },
    data: { 
      label: 'AI分析',
      description: '使用AI模型分析',
      type: 'process'
    },
  },
  {
    id: '4',
    type: 'customNode',
    position: { x: 250, y: 250 },
    data: { 
      label: '结果输出',
      description: '输出最终结果',
      type: 'output'
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'customEdge',
    data: { label: '数据流', type: 'default' },
  },
  {
    id: 'e1-3', 
    source: '1',
    target: '3',
    type: 'customEdge',
    data: { label: 'AI流', type: 'success' },
  },
  {
    id: 'e2-4',
    source: '2', 
    target: '4',
    type: 'customEdge',
    data: { label: '处理结果', type: 'default' },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4', 
    type: 'customEdge',
    data: { label: 'AI结果', type: 'success' },
  },
]

export function BasicFlow() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <FlowCanvas
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        fitView={true}
        showControls={true}
        showMiniMap={true}
        showBackground={true}
      />
    </div>
  )
}