# Remove UI Package and Add Complete shadcn/ui

## Why

当前项目使用自定义的 `@packages/ui/` 包来管理 UI 组件，这导致了一系列维护和开发体验问题：

1. **构建复杂性**：每次 UI 包的变更都需要重新构建和发布，增加了开发流程的复杂度
2. **依赖管理困难**：client 和 ui 包之间需要版本同步，容易出现不一致问题
3. **开发效率低**：跨包开发时热重载和类型检查性能较差
4. **维护成本高**：需要同时维护两个独立的包，增加了维护负担

shadcn/ui 提供了现代、完整的组件库解决方案，具有以下优势：

- **完整的 CLI 工具链**：简化组件的添加和管理
- **优秀的开发体验**：与 TypeScript 和现代构建工具完美集成
- **灵活的主题系统**：基于 CSS 变量的完整主题解决方案
- **活跃的社区支持**：持续的更新和丰富的组件生态

## What Changes

### Core Changes

- **移除 `@packages/ui/` 依赖**：完全移除对自定义 UI 包的依赖
- **集成 shadcn/ui**：在 client 项目中完整集成 shadcn/ui 设计系统
- **组件迁移**：将所有现有 UI 组件迁移到 shadcn/ui 对应组件
- **主题系统重构**：实施基于 CSS 变量的完整主题系统
- **构建配置更新**：简化构建流程，移除跨包依赖

### Specific Implementation Changes

1. **依赖管理**：
   - 移除 `@noteum/ui` 包依赖
   - 添加 shadcn/ui 相关依赖（@radix-ui/\* 组件）
   - 安装 shadcn CLI 工具

2. **配置文件**：
   - 更新 `tsconfig.json` 移除 UI 包路径映射
   - 更新 `vite.config.ts` 移除 UI 包别名
   - 配置 `components.json` shadcn/ui 设置
   - 重构 `globals.css` 主题变量系统

3. **组件迁移**：
   - Button → shadcn/ui Button
   - Dialog → shadcn/ui Dialog
   - Checkbox → shadcn/ui Checkbox
   - RadioGroup → shadcn/ui RadioGroup

4. **开发体验改进**：
   - 使用 `npx shadcn@latest add` 管理组件
   - 完整的 TypeScript 支持
   - 改进的主题切换功能

## 影响范围

- **应用架构**：简化 monorepo 结构，减少跨包依赖
- **开发流程**：改善组件管理和开发体验
- **构建性能**：减少构建复杂度和时间
- **用户体验**：保持一致的视觉效果和交互

## 风险与缓解

- **风险**：现有组件需要重写
- **缓解**：逐步迁移，保持功能一致性
- **风险**：样式可能发生变化
- **缓解**：使用 shadcn/ui 主题系统保持视觉一致性
