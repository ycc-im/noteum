# Implementation Tasks: Remove UI Package and Add Complete shadcn/ui

## Phase 1: Preparation and Cleanup

### 1.1 创建功能分支

- [x] 创建新功能分支 `remove-ui-package-add-shadcn`
- [x] 确保基于最新的 main 分支
- [x] 验证开发环境正常运行

### 1.2 分析现有 UI 组件使用情况

- [x] 搜索所有 `@noteum/ui` 的导入
- [x] 列出所有使用的 UI 组件
- [x] 分析组件 props 和功能
- [x] 识别自定义组件逻辑

### 1.3 备份现有 UI 包

- [ ] 备份 packages/ui 目录（可选）
- [ ] 记录现有组件实现细节
- [ ] 保存任何自定义业务逻辑

## Phase 2: shadcn/ui Setup

### 2.1 安装 shadcn/ui

- [x] 在 client 项目中安装 shadcn CLI
- [x] 初始化 shadcn/ui 项目配置
- [x] 配置 components.json 文件
- [x] 安装必要的 peer dependencies

### 2.2 配置 Tailwind CSS

- [x] 更新 tailwind.config.js 配置
- [x] 添加 shadcn/ui 相关的 CSS 变量
- [x] 配置主题颜色系统
- [x] 更新 globals.css 文件

### 2.3 设置组件目录结构

- [x] 创建 src/components/ui 目录
- [x] 创建 src/utils/index.ts 文件
- [x] 设置 cn() 工具函数
- [x] 配置 TypeScript 路径别名

## Phase 3: Theme Configuration

### 3.1 配置主题变量

- [x] 定义 CSS 变量用于颜色系统
- [x] 配置深色/浅色模式支持
- [x] 设置间距、边框、圆角等设计令牌
- [x] 确保与现有品牌色彩一致

### 3.2 测试主题切换

- [ ] 实现主题切换功能
- [ ] 验证所有组件在不同主题下的表现
- [ ] 测试主题持久化存储
- [ ] 确保主题切换动画流畅

## Phase 4: Component Migration

### 4.1 迁移基础组件

- [x] 安装并配置 Button 组件
- [x] 安装并配置 Dialog 组件
- [x] 安装并配置 Checkbox 组件
- [x] 安装并配置 Radio Group 组件

### 4.2 更新组件导入

- [x] 搜索所有 `@noteum/ui` 导入语句
- [x] 替换为 shadcn/ui 组件导入
- [x] 更新组件 props 使用方式
- [x] 处理组件 API 差异

### 4.3 测试迁移的组件

- [x] 验证组件功能正常
- [x] 测试组件交互状态
- [x] 检查视觉一致性

### 4.4 处理自定义组件逻辑

- [ ] 识别需要保留的自定义逻辑
- [ ] 将自定义逻辑集成到 shadcn/ui 组件
- [ ] 创建复合组件封装复杂逻辑
- [ ] 保持向后兼容性

## Phase 5: Cleanup and Validation

### 5.1 移除 UI 包依赖

- [x] 从 package.json 中移除 @noteum/ui 依赖
- [x] 更新 tsconfig.json 中的路径映射
- [x] 更新 vite.config.ts 中的别名配置
- [x] 清理相关的构建配置

### 5.2 构建和类型检查

- [x] 运行 `pnpm type-check` 验证类型
- [x] 运行 `pnpm lint` 检查代码风格
- [x] 验证开发服务器启动
- [x] 确认没有与迁移相关的构建错误

### 5.3 测试验证

- [x] 手动测试所有 UI 组件
- [x] 验证主题切换功能
- [x] 测试响应式设计
- [x] 确认组件功能正常

### 5.4 性能验证

- [ ] 检查构建大小变化
- [ ] 验证开发服务器启动时间
- [ ] 测试组件渲染性能
- [ ] 确认内存使用情况

## Phase 6: Documentation and Finalization

### 6.1 更新文档

- [ ] 更新组件使用文档
- [ ] 记录 shadcn/ui 配置
- [ ] 创建组件迁移指南
- [ ] 更新开发环境设置说明

### 6.2 代码审查准备

- [ ] 整理所有变更的文件
- [ ] 编写清晰的提交信息
- [ ] 准备 PR 描述
- [ ] 标记需要审查的关键变更

### 6.3 最终验证

- [ ] 在干净环境中测试完整流程
- [ ] 验证所有开发命令正常工作
- [ ] 确认生产构建成功
- [ ] 验证部署流程不受影响

## 并行任务

以下任务可以并行进行：

- 4.1 基础组件迁移可以并行处理
- 4.2 更新导入语句可以在不同文件中并行进行
- 5.2 构建和类型检查可以同时运行

## 依赖关系

- Phase 2 依赖于 Phase 1 的完成
- Phase 3 依赖于 Phase 2 的完成
- Phase 4 依赖于 Phase 3 的完成
- Phase 5 依赖于 Phase 4 的完成
- Phase 6 依赖于 Phase 5 的完成

## 验收标准

项目完成时必须满足：

- [ ] 所有功能测试通过
- [ ] 构建无错误且成功
- [ ] 视觉效果与原设计一致
- [ ] 开发体验得到改善
- [ ] 文档完整且准确
