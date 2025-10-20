# Design Document: Remove UI Package and Add Complete shadcn/ui

## 架构决策

### 当前架构问题

1. **依赖复杂性**：`@apps/client` 依赖 `@packages/ui`，增加构建复杂性
2. **维护负担**：需要维护两个独立的 UI 包
3. **版本同步**：UI 包和客户端需要版本同步
4. **开发效率**：跨包开发影响开发体验

### 新架构优势

1. **简化依赖**：客户端直接管理所有 UI 组件
2. **完整生态**：利用 shadcn/ui 完整的 CLI 和工具链
3. **主题统一**：shadcn/ui 提供完整的主题系统
4. **开发体验**：更好的 TypeScript 支持和开发工具

## 技术方案

### 1. shadcn/ui 集成

- 使用 `shadcn-ui` CLI 进行组件管理
- 配置 `components.json` 文件
- 设置完整的主题系统

### 2. 组件迁移策略

- **阶段 1**：移除 `@noteum/ui` 依赖
- **阶段 2**：安装和配置 shadcn/ui
- **阶段 3**：逐个迁移现有组件
- **阶段 4**：清理旧的 UI 包

### 3. 主题配置

- 基于现有设计配置 shadcn/ui 主题
- 保持与现有视觉风格的一致性
- 支持深色/浅色模式切换

## 实现细节

### shadcn/ui 配置文件

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### 主题变量配置

- 使用 CSS 变量系统
- 支持动态主题切换
- 保持品牌色彩一致性

### 组件组织结构

```
src/components/
├── ui/              # shadcn/ui 组件
├── forms/           # 表单组件
├── layout/          # 布局组件
└── features/        # 功能组件
```

## 风险评估

### 高风险项

1. **视觉一致性**：shadcn/ui 默认样式可能与现有设计不符
2. **组件功能**：现有自定义组件功能可能需要重新实现

### 中风险项

1. **构建配置**：需要调整 Tailwind 和构建配置
2. **类型定义**：组件类型定义可能需要更新

### 低风险项

1. **依赖管理**：简化依赖关系，风险较低
2. **开发工具**：shadcn/ui CLI 提供良好支持

## 成功指标

1. **构建时间**：减少 20% 以上的构建时间
2. **包大小**：优化最终打包大小
3. **开发体验**：提升组件开发和维护效率
4. **视觉一致性**：保持现有用户体验不变

## 后续考虑

1. **组件库扩展**：基于 shadcn/ui 扩展自定义组件
2. **主题系统**：支持更多主题选项
3. **性能优化**：利用 shadcn/ui 的性能优化特性
