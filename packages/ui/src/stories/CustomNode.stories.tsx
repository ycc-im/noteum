import type { Meta, StoryObj } from '@storybook/react'
import { CustomNode } from '../components/react-flow/nodes/CustomNode'
import { NodeProps } from 'reactflow'
import { CustomNodeData } from '../components/react-flow/nodes/CustomNode'

const meta: Meta<typeof CustomNode> = {
  title: 'Components/Nodes/CustomNode',
  component: CustomNode,
  parameters: {
    docs: {
      description: {
        component: '自定义节点组件，支持不同类型：input、process、output、default。'
      }
    }
  },
  argTypes: {
    selected: {
      control: 'boolean',
      description: '节点是否被选中'
    },
    data: {
      control: 'object',
      description: '节点数据'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ 
        width: '300px', 
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CustomNode>

const defaultProps: Partial<NodeProps<CustomNodeData>> = {
  id: 'test-node',
  selected: false,
  type: 'customNode',
  position: { x: 0, y: 0 },
  dragging: false,
  isConnectable: true,
  zIndex: 1,
  xPos: 0,
  yPos: 0,
}

export const InputNode: Story = {
  args: {
    ...defaultProps,
    data: {
      label: '输入节点',
      description: '数据输入端点',
      type: 'input'
    },
    selected: false,
  }
}

export const ProcessNode: Story = {
  args: {
    ...defaultProps,
    data: {
      label: '处理节点',
      description: '数据处理和转换',
      type: 'process'
    },
    selected: false,
  }
}

export const OutputNode: Story = {
  args: {
    ...defaultProps,
    data: {
      label: '输出节点',
      description: '结果输出端点',
      type: 'output'
    },
    selected: false,
  }
}

export const DefaultNode: Story = {
  args: {
    ...defaultProps,
    data: {
      label: '默认节点',
      description: '通用节点类型',
      type: 'default'
    },
    selected: false,
  }
}

export const SelectedNode: Story = {
  args: {
    ...defaultProps,
    data: {
      label: '选中的节点',
      description: '当前被选中的节点',
      type: 'process'
    },
    selected: true,
  }
}

export const LongLabelNode: Story = {
  args: {
    ...defaultProps,
    data: {
      label: '非常长的节点标题用于测试换行效果',
      description: '这是一个非常长的描述文本，用于测试节点在包含大量文本时的显示效果和布局适应性',
      type: 'process'
    },
    selected: false,
  }
}

export const NoDescriptionNode: Story = {
  args: {
    ...defaultProps,
    data: {
      label: '无描述节点',
      type: 'input'
    },
    selected: false,
  }
}