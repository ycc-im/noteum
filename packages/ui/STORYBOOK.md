# @noteum/ui Storybook 指南

本指南介绍如何使用 Storybook 来开发和部署 @noteum/ui 组件库。

## 快速开始

### 开发模式

启动 Storybook 开发服务器：

```bash
# 在 packages/ui 目录下
npm run storybook
```

Storybook 将在 `http://localhost:6006` 启动。

### 构建部署

构建 Storybook 用于生产部署：

```bash
# 构建静态文件
npm run storybook:build

# 或者使用便捷脚本
./scripts/storybook-deploy.sh
```

构建完成后，静态文件将输出到 `storybook-static` 目录。

### 预览构建结果

```bash
# 启动静态服务器预览构建结果
npm run storybook:serve
```

## 组件特性

### 主题支持

Storybook 支持明暗主题切换：

- 使用工具栏中的主题切换器
- 组件会根据主题自动调整样式
- 主题状态会持久化存储

### 可访问性测试

集成了 `@storybook/addon-a11y`：

- 自动检测可访问性问题
- 提供详细的修复建议
- 支持 WCAG 2.1 标准

### 交互测试

使用 `@storybook/addon-interactions`：

- 记录和回放用户交互
- 可视化组件状态变化
- 支持复杂的交互流程测试

## 组件文档

每个组件都包含以下文档：

1. **基础用法** - 展示组件的基本用法
2. **变体和尺寸** - 展示不同的样式变体
3. **状态控制** - 展示受控和不受控状态
4. **表单集成** - 展示与表单的集成用法
5. **可访问性** - 展示无障碍访问特性

## 部署指南

### 静态托管部署

构建完成后，可以将 `storybook-static` 目录部署到任何静态托管服务：

- **Netlify**: 拖拽 `storybook-static` 目录到 Netlify 部署界面
- **Vercel**: 连接 GitHub 仓库并设置构建命令 `npm run storybook:build`
- **GitHub Pages**: 使用 GitHub Actions 自动部署
- **AWS S3**: 上传 `storybook-static` 目录内容到 S3 bucket

### CI/CD 集成

在 CI/CD 流程中添加 Storybook 构建：

```yaml
# .github/workflows/storybook.yml
name: Deploy Storybook
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: pnpm install

      - name: Build Storybook
        run: pnpm run storybook:build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
```

## 开发建议

### 编写故事

创建新组件时，请遵循以下故事结构：

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { YourComponent } from '../src/components/ui/your-component'

const meta: Meta<typeof YourComponent> = {
  title: 'UI/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // 默认属性
  },
}

export const WithVariants: Story = {
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive'],
    },
  },
}
```

### 最佳实践

1. **使用控制面板** - 通过 `argTypes` 提供交互式控件
2. **添加文档** - 使用 `tags: ['autodocs']` 自动生成文档
3. **测试状态** - 展示组件的不同状态和边界情况
4. **可访问性** - 确保所有故事都通过可访问性测试
5. **响应式** - 使用不同的布局参数测试响应式行为

## 故障排除

### 常见问题

1. **构建失败** - 检查 TypeScript 类型错误和依赖版本
2. **样式缺失** - 确保 Tailwind CSS 正确配置
3. **主题不切换** - 检查 CSS 变量和装饰器配置
4. **组件不显示** - 检查导入路径和组件导出

### 调试技巧

1. 使用浏览器开发工具检查元素样式
2. 查看 Storybook 控制台错误信息
3. 检查网络请求和资源加载
4. 验证组件 props 和状态

## 更多资源

- [Storybook 官方文档](https://storybook.js.org/)
- [shadcn/ui 组件库](https://ui.shadcn.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [React 文档](https://react.dev/)
