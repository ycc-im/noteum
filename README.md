# Noteum

基于 pnpm 的 TypeScript Monorepo 项目

## 项目结构

```
noteum/
├── apps/
│   ├── services/          # NestJS 后端服务
│   └── client/            # React + Vite 前端应用
├── packages/
│   ├── utils/             # 共享工具函数库
├── scripts/               # 开发脚本
├── docker-compose.dev.yml # Docker 开发环境配置
├── package.json          # 根配置
├── pnpm-workspace.yaml   # pnpm workspace 配置
└── tsconfig.json         # TypeScript 配置
```

## 快速开始

### 前置要求

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose（用于数据库等基础设施）

### 安装依赖

```bash
pnpm install
```

### 开发模式

#### 🚀 启动开发工作区（推荐）

从根目录启动：

```bash
# 启动前后端所有服务
pnpm dev:workspace

# 或者简写
pnpm dev
```

#### 🔧 单独启动服务

```bash
# 仅启动后端服务（NestJS + tRPC）
pnpm dev:services

# 仅启动前端应用（React + Vite）
pnpm dev:client
```

#### 🏥 服务管理

```bash
# 检查所有服务状态
pnpm dev:health

# 停止所有开发服务
pnpm dev:stop

# 重启所有开发服务
pnpm dev:restart

# 仅重启后端服务
pnpm dev:restart-services

# 仅重启前端应用
pnpm dev:restart-client
```

#### 🐳 Docker 基础设施

```bash
# 启动 Docker 开发环境（PostgreSQL、Redis、PgAdmin等）
pnpm docker:start

# 停止 Docker 环境
pnpm docker:stop

# 查看 Docker 服务状态
pnpm docker:status

# 查看 Docker 日志
pnpm docker:logs
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

## 服务架构

### 应用服务

- **Services (NestJS + tRPC)**: 端口 9168
  - RESTful API 和 tRPC 端点
  - PostgreSQL 数据库连接
  - Redis 缓存和会话管理
  - WebSocket 实时通信

- **Client (React + Vite)**: 端口 9158
  - 现代化前端界面
  - 实时协作编辑（YJS）
  - TypeScript 严格模式

### 基础设施

- **PostgreSQL**: 端口 9198，主数据库
- **Redis**: 端口 9178，缓存和会话
- **PgAdmin**: 端口 9188，数据库管理
- **Redis Commander**: 端口 9189，Redis 管理

## 开发工具

### 代码质量

```bash
# 运行 ESLint
pnpm lint

# 类型检查
pnpm type-check

# 运行测试
pnpm test
```

### 端口管理

```bash
# 检查端口占用情况
pnpm ports:check

# 验证端口配置
pnpm ports:validate
```

## 开发脚本详细说明

### 基础开发命令

| 命令                        | 功能         | 说明                        |
| --------------------------- | ------------ | --------------------------- |
| `pnpm dev:workspace`        | 启动所有服务 | 并发启动 Services 和 Client |
| `pnpm dev:services`         | 启动后端     | 仅启动 NestJS 服务          |
| `pnpm dev:client`           | 启动前端     | 仅启动 React 应用           |
| `pnpm dev:health`           | 健康检查     | 检查所有服务状态            |
| `pnpm dev:stop`             | 停止服务     | 停止所有开发服务            |
| `pnpm dev:restart`          | 重启服务     | 重启所有开发服务            |
| `pnpm dev:restart-services` | 重启后端     | 仅重启后端服务              |
| `pnpm dev:restart-client`   | 重启前端     | 仅重启前端应用              |

### 高级用法

#### 从不同目录启动

```bash
# 统一从根目录启动所有服务
pnpm dev:workspace
```

#### 服务状态监控

```bash
# 查看实时日志
tail -f logs/services.log
tail -f logs/client.log

# 检查端口占用
lsof -i :9158 -i :9168

# 查看进程状态
ps aux | grep -E "(node|nest|vite)"
```

#### 故障排除

```bash
# 清理环境
pnpm dev:stop

# 强制清理端口占用
sudo lsof -ti:9158 | xargs kill -9
sudo lsof -ti:9168 | xargs kill -9

# 重置 Docker 环境
pnpm docker:stop
pnpm docker:start
```

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
