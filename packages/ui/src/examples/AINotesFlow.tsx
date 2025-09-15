
import { Node, Edge } from 'reactflow'
import { FlowCanvas } from '../components/react-flow/FlowCanvas'

const initialNodes: Node[] = [
  {
    id: 'input',
    type: 'customNode',
    position: { x: 100, y: 50 },
    data: {
      label: '用户输入',
      description: '用户输入笔记内容',
      type: 'input'
    },
  },
  {
    id: 'ai-summarize',
    type: 'aiNode',
    position: { x: 300, y: 50 },
    data: {
      title: 'AI摘要生成',
      content: '基于用户输入的笔记内容，生成简洁的摘要。使用先进的自然语言处理技术，提取关键信息点。',
      aiModel: 'GPT-4',
      status: 'completed',
      confidence: 0.92
    },
  },
  {
    id: 'ai-tags',
    type: 'aiNode', 
    position: { x: 600, y: 50 },
    data: {
      title: '智能标签',
      content: '自动为笔记生成相关标签，包括主题分类、关键词提取等。',
      aiModel: 'BERT',
      status: 'processing',
      confidence: 0.85
    },
  },
  {
    id: 'ai-relations',
    type: 'aiNode',
    position: { x: 300, y: 250 },
    data: {
      title: '关系分析',
      content: '分析当前笔记与已有笔记的关联关系，建议相关链接。',
      aiModel: 'Embedding Model',
      status: 'completed',
      confidence: 0.78
    },
  },
  {
    id: 'ai-suggestions',
    type: 'aiNode',
    position: { x: 600, y: 250 },
    data: {
      title: '内容建议', 
      content: '基于笔记内容，提供扩展建议和相关资源推荐。',
      aiModel: 'Claude-3',
      status: 'idle',
      confidence: 0.0
    },
  },
  {
    id: 'output',
    type: 'customNode',
    position: { x: 400, y: 450 },
    data: {
      label: '增强笔记',
      description: '包含AI生成内容的完整笔记',
      type: 'output'
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'input-summarize',
    source: 'input',
    target: 'ai-summarize',
    type: 'customEdge',
    data: { label: '原始内容', type: 'default' },
  },
  {
    id: 'input-tags',
    source: 'input', 
    target: 'ai-tags',
    type: 'customEdge',
    data: { label: '内容分析', type: 'default' },
  },
  {
    id: 'summarize-relations',
    source: 'ai-summarize',
    target: 'ai-relations',
    type: 'customEdge', 
    data: { label: '摘要内容', type: 'success' },
  },
  {
    id: 'tags-suggestions',
    source: 'ai-tags',
    target: 'ai-suggestions', 
    type: 'customEdge',
    data: { label: '标签信息', type: 'warning' },
  },
  {
    id: 'relations-output',
    source: 'ai-relations',
    target: 'output',
    type: 'customEdge',
    data: { label: '关系数据', type: 'success' },
  },
  {
    id: 'suggestions-output',
    source: 'ai-suggestions',
    target: 'output',
    type: 'customEdge', 
    data: { label: '建议内容', type: 'default' },
  },
  {
    id: 'summarize-output',
    source: 'ai-summarize',
    target: 'output',
    type: 'customEdge',
    data: { label: '摘要', type: 'success' },
  },
  {
    id: 'tags-output',
    source: 'ai-tags',
    target: 'output',
    type: 'customEdge',
    data: { label: '标签', type: 'warning' },
  },
]

export function AINotesFlow() {
  const handleNodesChange = (nodes: Node[]) => {
    console.log('Nodes changed:', nodes)
  }

  const handleEdgesChange = (edges: Edge[]) => {
    console.log('Edges changed:', edges)
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <FlowCanvas
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        fitView={true}
        showControls={true}
        showMiniMap={true}
        showBackground={true}
      />
    </div>
  )
}