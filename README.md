# Noteum

基于 pnpm 的 TypeScript Monorepo 项目

## 项目结构

```
noteum/
├── apps/
│   ├── services/          # 服务端应用
│   └── clients/           # Tauri 桌面客户端
├── packages/
│   ├── ui/               # UI 组件库
│   └── utils/            # 工具函数库
├── package.json          # 根配置
├── pnpm-workspace.yaml   # pnpm workspace 配置
└── tsconfig.json         # TypeScript 配置
```

## 快速开始

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
# 启动所有包的开发模式
pnpm dev

# 启动特定包
pnpm --filter @noteum/clients dev
```

### 构建
```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm --filter @noteum/ui build
```

### 代码检查
```bash
# 运行 ESLint
pnpm lint

# 类型检查
pnpm type-check

# 运行测试
pnpm test
```

## 包说明

- `@noteum/services`: 服务端应用（待实现）
- `@noteum/clients`: 基于 Tauri + Vite + React 的桌面客户端
- `@noteum/ui`: 共享 UI 组件库
- `@noteum/utils`: 工具函数库

## 发布管理

使用 Changesets 进行版本管理和发布：

```bash
# 添加变更记录
pnpm changeset

# 更新版本号
pnpm version-packages

# 发布到 npm
pnpm release
```