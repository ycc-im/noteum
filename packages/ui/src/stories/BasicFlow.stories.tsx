import type { Meta, StoryObj } from '@storybook/react'
import { BasicFlow } from '../examples/BasicFlow'

const meta: Meta<typeof BasicFlow> = {
  title: 'Examples/BasicFlow',
  component: BasicFlow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '基础流程示例，展示了一个简单的4节点工作流，包含开始、两个处理节点和输出节点。演示了基本的节点连接和数据流向。'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof BasicFlow>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '默认的基础流程展示，包含输入、处理、AI分析和输出四个节点。展示了基本的分支和汇聚流程结构。'
      }
    }
  }
}