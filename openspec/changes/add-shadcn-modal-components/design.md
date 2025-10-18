## Context

Noteum 是一个基于 React 18.2+ 和 TypeScript 5.0+ 的协作笔记应用，使用 Tailwind CSS 进行样式设计。目前项目有基本的 UI 包结构但缺乏完整的组件库。为了提供一致的用户界面体验，需要引入业界成熟的 shadcn/ui 组件系统。

## Goals / Non-Goals

**Goals:**

- 提供统一的、可访问的弹窗组件
- 支持多种弹窗尺寸和样式变体
- 建立可扩展的组件库架构
- 在 Storybook 中提供完整的组件文档和示例
- 保持与现有设计系统的兼容性

**Non-Goals:**

- 重新实现完整的 shadcn/ui 组件库
- 修改现有的 Tailwind 配置
- 破坏现有的组件结构

## Decisions

### Decision 1: 使用 shadcn/ui 作为基础组件库

**Why**: shadcn/ui 提供了基于 Radix UI 的高质量、可访问的组件，与现代 React 生态系统完美集成，使用 Tailwind CSS 进行样式设计，与项目技术栈匹配。

**Alternatives considered:**

- 自建组件库：开发成本高，可访问性难以保证
- Material-UI：与现有 Tailwind 配置冲突
- Ant Design：过于重量级，定制性差

### Decision 2: 组件库架构设计

**Why**: 采用模块化设计，每个组件独立导出，支持按需导入和 tree-shaking。

**Structure:**

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx (modal)
│   │   │   ├── radio.tsx
│   │   │   └── checkbox.tsx
│   │   └── index.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── cn.ts
│   └── index.ts
```

### Decision 3: Storybook 集成

**Why**: Storybook 是业界标准的组件开发环境，提供独立的组件测试和文档展示。

**Features:**

- 组件状态演示
- 交互式 props 控制
- 可访问性测试
- 设计令牌文档

## Risks / Trade-offs

**Risk**: shadcn/ui 依赖可能导致包体积增加
**Mitigation**: 使用 tree-shaking 和按需导入，监控构建大小

**Risk**: 样式冲突风险
**Mitigation**: 使用 CSS 变量和前缀隔离，逐步迁移策略

**Trade-off**: 初始设置复杂度 vs 长期维护成本
选择接受初始复杂度以获得更好的长期可维护性

## Migration Plan

1. **Phase 1**: 基础设施设置
   - 配置 @noteum/ui 包依赖
   - 设置 shadcn/ui CLI 和配置
   - 创建 Storybook 环境

2. **Phase 2**: 核心组件实现
   - 实现 Modal/Dialog 组件
   - 添加 Button、Radio、Checkbox 组件
   - 编写组件测试

3. **Phase 3**: 集成和文档
   - 在客户端应用中集成组件
   - 完善 Storybook 文档
   - 性能优化和验证

## Open Questions

- 是否需要支持自定义主题系统？
- 组件库版本发布策略？
- 如何处理 SSR 兼容性？
