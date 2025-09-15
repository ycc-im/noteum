# @noteum/ui

React Flow UI 组件库，提供可复用的图形化界面组件和展示案例。

## 功能特性

- 🎨 **自定义节点** - 支持多种类型的节点组件
- 🤖 **AI节点** - 专门为AI应用设计的智能节点
- 🔗 **自定义边** - 可配置的连接线样式和标签
- 📱 **响应式画布** - 适配不同屏幕尺寸的流程画布
- 🛠 **工具函数** - 布局、验证、导入导出等实用工具
- 📚 **示例案例** - 基础流程、AI笔记流程、工作流编辑器

## 安装

```bash
pnpm install @noteum/ui
```

## 基础使用

```tsx
import { FlowCanvas, BasicFlow } from '@noteum/ui'

function App() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <BasicFlow />
    </div>
  )
}
```

## 组件

### FlowCanvas

主要的流程画布组件：

```tsx
import { FlowCanvas } from '@noteum/ui'

<FlowCanvas
  initialNodes={nodes}
  initialEdges={edges}
  onNodesChange={handleNodesChange}
  onEdgesChange={handleEdgesChange}
  showControls={true}
  showMiniMap={true}
  showBackground={true}
/>
```

### 自定义节点

#### CustomNode

```tsx
import { CustomNode } from '@noteum/ui'

const nodeData = {
  label: '处理节点',
  description: '数据处理步骤',
  type: 'process'
}
```

#### AINode

```tsx
import { AINode } from '@noteum/ui'

const aiNodeData = {
  title: 'AI分析',
  content: '使用机器学习模型进行数据分析',
  aiModel: 'GPT-4',
  status: 'completed',
  confidence: 0.92
}
```

## 示例

### 基础流程

```tsx
import { BasicFlow } from '@noteum/ui'

<BasicFlow />
```

### AI笔记流程

```tsx
import { AINotesFlow } from '@noteum/ui'

<AINotesFlow />
```

### 工作流编辑器

```tsx
import { WorkflowEditor } from '@noteum/ui'

<WorkflowEditor />
```

## Hooks

### useFlowState

状态管理 Hook：

```tsx
import { useFlowState } from '@noteum/ui'

function MyComponent() {
  const {
    nodes,
    edges,
    addNode,
    removeNode,
    addConnection,
    clearFlow,
    getFlowData
  } = useFlowState(initialNodes, initialEdges)
  
  // 使用状态管理功能
}
```

## 工具函数

### 自动布局

```tsx
import { autoLayout } from '@noteum/ui'

const layoutedNodes = autoLayout(nodes, edges, {
  direction: 'TB',
  spacing: { x: 200, y: 100 }
})
```

### 流程验证

```tsx
import { validateFlow } from '@noteum/ui'

const validation = validateFlow(nodes, edges)
if (!validation.isValid) {
  console.log('错误:', validation.errors)
}
```

### 导入导出

```tsx
import { exportFlowToJSON, importFlowFromJSON } from '@noteum/ui'

// 导出
const jsonData = exportFlowToJSON(nodes, edges)

// 导入
const { nodes, edges } = importFlowFromJSON(jsonData)
```

## Storybook

查看组件文档和交互示例：

```bash
# 启动 Storybook
pnpm storybook

# 构建 Storybook 静态站点
pnpm build-storybook
```

Storybook 将在 http://localhost:6006 启动，包含：

- 📖 **组件文档** - 详细的API参考和使用指南
- 🎮 **交互示例** - 可调整参数的实时预览
- 📱 **响应式测试** - 不同设备尺寸的显示效果
- 🎨 **视觉变化** - 不同状态和配置的对比

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 类型检查
pnpm typecheck

# 构建
pnpm build

# Storybook 开发
pnpm storybook
```

## 许可证

Apache-2.0