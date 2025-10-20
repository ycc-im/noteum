# shadcn/ui样式修复任务清单

## 依赖同步任务

### 1. 添加缺失的动画依赖

- [x] 在 `apps/client/package.json` 中添加 `tailwindcss-animate` 依赖
- [x] 确保版本与 `packages/ui/package.json` 中的版本一致
- [x] 运行 `pnpm install` 安装新依赖

### 2. 验证现有依赖一致性

- [x] 对比 `packages/ui/package.json` 和 `apps/client/package.json` 中的共同依赖
- [x] 确保版本兼容性
- [x] 更新版本不一致的依赖

## 配置修复任务

### 3. 更新Client端Tailwind配置

- [x] 修改 `apps/client/tailwind.config.js`
- [x] 添加 `tailwindcss-animate` 插件到 plugins 数组
- [x] 验证与UI包配置的一致性

### 4. 优化CSS导入

- [x] 检查 `apps/client/src/styles/globals.css` 的导入顺序
- [x] 在 `apps/client/src/main.tsx` 中直接导入 `@noteum/ui/globals.css`
- [x] 验证CSS变量正确定义

### 5. 构建UI包

- [x] 运行 `pnpm --filter @noteum/ui build` 构建UI包
- [x] 修复 `packages/ui/tsup.config.ts` 配置确保样式文件复制
- [x] 更新 `packages/ui/package.json` exports映射
- [x] 手动复制CSS文件到正确位置

## 验证测试任务

### 6. 功能测试

- [x] 启动开发服务器 `pnpm dev:client`
- [x] 测试Modal组件显示为正确弹窗
- [x] 验证Modal包含完整的标题、描述和表单
- [x] 确认Modal具有正确的shadcn/ui CSS类名

### 7. 交互测试

- [x] 测试Modal的快捷键打开功能（⌘+N）
- [x] 验证关闭按钮正常工作
- [x] 测试键盘导航（ESC键关闭）
- [x] 验证表单输入和选择器功能正常

### 8. 回归测试

- [x] 测试Modal组件在不同场景下的功能一致性
- [x] 验证CSS变量正确定义和加载
- [x] 检查Modal在不同状态下的行为
- [x] 确认组件不会影响页面其他功能

## 文档和清理任务

### 9. 更新文档

- [ ] 更新项目README中的shadcn/ui使用说明
- [ ] 记录样式导入的最佳实践
- [ ] 添加常见样式问题排查指南

### 10. 代码质量

- [ ] 运行 `pnpm lint` 检查代码规范
- [ ] 运行 `pnpm type-check` 验证类型安全
- [ ] 清理不必要的注释和调试代码

## 最终验证

### 11. 完整流程测试

- [ ] 停止所有开发服务
- [ ] 清理node_modules和构建缓存
- [ ] 重新安装依赖 `pnpm install`
- [ ] 启动完整开发环境 `pnpm dev:workspace`
- [ ] 再次验证所有功能正常

### 12. 创建回归测试

- [ ] 为Modal组件创建单元测试
- [ ] 为样式导入创建集成测试
- [ ] 设置CI检查防止未来样式问题

## 依赖关系

- 任务1-2：依赖同步（无依赖）
- 任务3-5：配置修复（依赖任务1-2）
- 任务6-8：验证测试（依赖任务3-5）
- 任务9-11：文档和清理（依赖任务6-8）
- 任务12：回归测试（依赖任务9-11）
