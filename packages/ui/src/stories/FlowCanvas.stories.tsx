import type { Meta, StoryObj } from '@storybook/react'
import { FlowCanvas } from '../components/react-flow/FlowCanvas'
import { Node, Edge } from 'reactflow'

const meta: Meta<typeof FlowCanvas> = {
  title: 'Components/FlowCanvas',
  component: FlowCanvas,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '主要的 React Flow 画布组件，支持节点拖拽、连接、缩放等交互功能。'
      }
    }
  },
  argTypes: {
    fitView: {
      control: 'boolean',
      description: '是否自动适应视口'
    },
    interactive: {
      control: 'boolean', 
      description: '是否允许交互操作'
    },
    showControls: {
      control: 'boolean',
      description: '是否显示控制按钮'
    },
    showMiniMap: {
      control: 'boolean',
      description: '是否显示缩略图'
    },
    showBackground: {
      control: 'boolean',
      description: '是否显示背景'
    }
  }
}

export default meta
type Story = StoryObj<typeof FlowCanvas>

const basicNodes: Node[] = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 250, y: 25 },
    data: { 
      label: '开始节点',
      description: '流程开始',
      type: 'input'
    },
  },
  {
    id: '2',
    type: 'customNode',
    position: { x: 100, y: 125 },
    data: { 
      label: '处理节点',
      description: '数据处理',
      type: 'process'
    },
  },
  {
    id: '3',
    type: 'customNode',
    position: { x: 400, y: 125 },
    data: { 
      label: '输出节点',
      description: '结果输出',
      type: 'output'
    },
  },
]

const basicEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'customEdge',
    data: { label: '处理流程' },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'customEdge',
    data: { label: '直接输出' },
  },
]

export const Default: Story = {
  args: {
    initialNodes: basicNodes,
    initialEdges: basicEdges,
    fitView: true,
    interactive: true,
    showControls: true,
    showMiniMap: true,
    showBackground: true,
  }
}

export const ReadOnly: Story = {
  args: {
    initialNodes: basicNodes,
    initialEdges: basicEdges,
    fitView: true,
    interactive: false,
    showControls: false,
    showMiniMap: false,
    showBackground: true,
  }
}

export const MinimalView: Story = {
  args: {
    initialNodes: basicNodes,
    initialEdges: basicEdges,
    fitView: true,
    interactive: true,
    showControls: false,
    showMiniMap: false,
    showBackground: false,
  }
}

export const Empty: Story = {
  args: {
    initialNodes: [],
    initialEdges: [],
    fitView: true,
    interactive: true,
    showControls: true,
    showMiniMap: true,
    showBackground: true,
  }
}