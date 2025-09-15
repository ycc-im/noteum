import type { Meta, StoryObj } from '@storybook/react'
import { AINotesFlow } from '../examples/AINotesFlow'

const meta: Meta<typeof AINotesFlow> = {
  title: 'Examples/AINotesFlow',
  component: AINotesFlow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'AI 笔记流程示例，展示了一个完整的 AI 驱动的笔记处理工作流。包含多个 AI 节点：摘要生成、智能标签、关系分析、内容建议等。'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof AINotesFlow>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `AI 笔记处理流程的完整示例：
        
- **用户输入** → 原始笔记内容
- **AI摘要生成** → 自动提取关键信息点
- **智能标签** → 自动分类和关键词提取  
- **关系分析** → 分析与已有笔记的关联
- **内容建议** → 提供扩展建议和资源推荐
- **增强笔记** → 包含所有AI增强内容的最终笔记

每个AI节点都显示了不同的处理状态（idle、processing、completed）和置信度评分。`
      }
    }
  }
}

export const InteractiveMode: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '交互模式下的AI笔记流程，支持节点拖拽、连接线调整等操作。可以观察到节点和边的变化事件在控制台中的输出。'
      }
    }
  }
}