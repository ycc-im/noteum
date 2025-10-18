## Why

为了在 Noteum 应用中提供统一的弹窗交互体验，需要引入基于 shadcn/ui 的 modal 组件系统，支持高度定制的弹窗设计并在 Storybook 中展示组件示例。

## What Changes

- 引入 shadcn/ui 依赖和配置到 @noteum/ui 包
- 实现 Modal 弹窗组件，支持多种尺寸和样式变体
- 添加相关的基础 UI 组件：Button、Radio、Checkbox
- 配置 Storybook 以展示和测试 UI 组件
- 建立组件库的构建和导出机制

## Impact

- **Affected specs**: ui-components (新建)
- **Affected code**:
  - packages/ui/ (新增组件库)
  - apps/client/ (集成新的 UI 组件)
  - Storybook 配置和文档
