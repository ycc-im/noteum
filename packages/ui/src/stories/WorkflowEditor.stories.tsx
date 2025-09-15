import type { Meta, StoryObj } from '@storybook/react'
import { WorkflowEditor } from '../examples/WorkflowEditor'

const meta: Meta<typeof WorkflowEditor> = {
  title: 'Examples/WorkflowEditor',
  component: WorkflowEditor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '交互式工作流编辑器，提供完整的节点编辑功能。用户可以添加不同类型的节点、创建连接、导出和清空流程。'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof WorkflowEditor>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `工作流编辑器的主要功能：

**工具栏功能：**
- **+ 处理节点** - 添加数据处理节点
- **+ AI节点** - 添加AI处理节点
- **+ 输出节点** - 添加结果输出节点
- **导出** - 将当前流程导出为JSON格式
- **清空** - 清空所有节点和连接

**交互功能：**
- 拖拽节点调整位置
- 连接节点创建数据流
- 选择和删除节点/连接
- 实时状态显示（右下角）

**使用方式：**
1. 点击工具栏按钮添加节点
2. 拖拽节点进行连接
3. 调整布局和连接关系
4. 导出保存工作流配置`
      }
    }
  }
}

export const EmptyEditor: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '空白的编辑器状态，可以从零开始构建工作流。展示了编辑器的初始状态和基本界面元素。'
      }
    }
  }
}