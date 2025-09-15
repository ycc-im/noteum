import type { Meta, StoryObj } from '@storybook/react'
import { AINode } from '../components/react-flow/nodes/AINode'
import { NodeProps } from 'reactflow'
import { AINodeData } from '../components/react-flow/nodes/AINode'

const meta: Meta<typeof AINode> = {
  title: 'Components/Nodes/AINode',
  component: AINode,
  parameters: {
    docs: {
      description: {
        component: 'AI 专用节点组件，显示 AI 模型信息、处理状态和置信度。支持内容展开/收起功能。'
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
      description: 'AI节点数据'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ 
        width: '400px', 
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AINode>

const defaultProps: Partial<NodeProps<AINodeData>> = {
  id: 'test-ai-node',
  selected: false,
  type: 'aiNode',
  position: { x: 0, y: 0 },
  dragging: false,
  isConnectable: true,
  zIndex: 1,
  xPos: 0,
  yPos: 0,
}

export const IdleState: Story = {
  args: {
    ...defaultProps,
    data: {
      title: 'AI 文本分析',
      content: '等待处理用户输入的文本内容，准备进行智能分析和处理。',
      aiModel: 'GPT-4',
      status: 'idle',
      confidence: 0
    },
    selected: false,
  }
}

export const ProcessingState: Story = {
  args: {
    ...defaultProps,
    data: {
      title: 'AI 图像识别',
      content: '正在使用深度学习模型分析上传的图像，识别其中的对象和场景。',
      aiModel: 'Vision Transformer',
      status: 'processing',
      confidence: 0.65
    },
    selected: false,
  }
}

export const CompletedState: Story = {
  args: {
    ...defaultProps,
    data: {
      title: 'AI 内容生成',
      content: '基于用户需求成功生成了高质量的内容。生成的内容符合预期，准确性和相关性都很好。',
      aiModel: 'Claude-3',
      status: 'completed',
      confidence: 0.92
    },
    selected: false,
  }
}

export const ErrorState: Story = {
  args: {
    ...defaultProps,
    data: {
      title: 'AI 数据处理',
      content: '处理过程中遇到错误，可能是由于输入数据格式不正确或模型服务暂时不可用。',
      aiModel: 'BERT Base',
      status: 'error',
      confidence: 0
    },
    selected: false,
  }
}

export const HighConfidence: Story = {
  args: {
    ...defaultProps,
    data: {
      title: '高置信度预测',
      content: '模型对这个预测结果非常有信心，建议直接采用这个结果。',
      aiModel: 'Custom Model',
      status: 'completed',
      confidence: 0.98
    },
    selected: true,
  }
}

export const LowConfidence: Story = {
  args: {
    ...defaultProps,
    data: {
      title: '低置信度结果',
      content: '模型的预测置信度较低，建议人工review或使用其他模型进行验证。',
      aiModel: 'Experimental Model',
      status: 'completed',
      confidence: 0.32
    },
    selected: false,
  }
}

export const LongContent: Story = {
  args: {
    ...defaultProps,
    data: {
      title: 'AI 长文本分析',
      content: '这是一段非常长的文本内容，用于测试AI节点在处理大量文本时的显示效果。当内容超过一定长度时，节点会自动截断显示，并提供展开/收起功能。用户可以点击文本区域来查看完整内容。这个功能对于在有限的节点空间内展示详细信息非常有用，既保持了界面的整洁，又确保了信息的可访问性。在实际应用中，这类长文本可能来自AI模型的详细分析报告、处理日志或者复杂的业务逻辑说明。',
      aiModel: 'GPT-4 Turbo',
      status: 'completed',
      confidence: 0.87
    },
    selected: false,
  }
}

export const NoModel: Story = {
  args: {
    ...defaultProps,
    data: {
      title: '未指定模型',
      content: '这个AI节点没有指定具体的模型信息。',
      status: 'idle',
      confidence: 0
    },
    selected: false,
  }
}