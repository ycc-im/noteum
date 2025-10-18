# Noteum Services

[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-green.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red.svg)](https://redis.io/)

基于 NestJS + tRPC + PostgreSQL + y-websocket 的协作平台后端服务

## 技术栈

- **框架**: NestJS 10.x LTS
- **API**: tRPC + REST (混合)
- **数据库**: PostgreSQL + pgvector
- **ORM**: Prisma
- **实时协作**: y-websocket + yjs
- **认证**: JWT
- **缓存**: Redis
- **部署**: Docker + Docker Compose

## 快速开始

### 🐳 方式一：Docker 开发环境（推荐）

使用 Docker Compose 启动完整的开发环境，包括数据库和管理工具：

```bash
# 启动所有服务（核心服务 + 管理工具）
./start-dev.sh

# 或者只启动核心服务
./start-dev.sh core

# 停止所有服务
./stop-dev.sh
```

#### 📋 Docker 服务概览

| 服务                   | 端口 | 访问地址                   | 用途       |
| ---------------------- | ---- | -------------------------- | ---------- |
| **🌐 NestJS 应用**     | 3000 | http://localhost:3000      | 主应用     |
| **📚 API 文档**        | 3000 | http://localhost:3000/docs | Swagger UI |
| **🐘 PostgreSQL**      | 5432 | localhost:5432             | 数据库     |
| **🔴 Redis**           | 6379 | localhost:6379             | 缓存       |
| **🔧 pgAdmin**         | 8080 | http://localhost:8080      | 数据库管理 |
| **🛠️ Redis Commander** | 8081 | http://localhost:8081      | Redis 管理 |

#### 🔑 登录信息

**🐘 pgAdmin:**

- 📧 **邮箱**: `admin@noteum.dev`
- 🔒 **密码**: `admin`
- 📊 **数据库连接**:
  - 🌐 **主机**: `postgres` (Docker 内部网络)
  - 🚪 **端口**: `5432`
  - 🗄️ **数据库**: `noteum`
  - 👤 **用户名**: `postgres`
  - 🔑 **密码**: `postgres`

**👤 应用测试账户:**

- 📧 **邮箱**: `admin@noteum.dev`
- 🔒 **密码**: `admin123456`

#### 🚀 手动 Docker 命令

```bash
# 启动核心服务
docker-compose -p noteum-services-dev up -d postgres redis app

# 启动核心服务 + 管理工具
docker-compose -p noteum-services-dev --profile tools up -d

# 停止服务
docker-compose -p noteum-services-dev down
```

### 💻 方式二：本地开发

如果你 prefer 本地开发：

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件配置数据库等信息

# 3. 启动开发服务器
pnpm start:dev
```

### 4. 健康检查

```bash
curl http://localhost:3000/api/v1/health
```

## 可用脚本

- `pnpm start:dev` - 启动开发服务器
- `pnpm start:debug` - 启动调试模式
- `pnpm build` - 构建生产版本
- `pnpm start:prod` - 运行生产版本
- `pnpm test` - 运行单元测试
- `pnpm test:e2e` - 运行端到端测试
- `pnpm test:cov` - 生成测试覆盖率报告
- `pnpm lint` - 代码检查
- `pnpm format` - 代码格式化
- `pnpm type-check` - TypeScript 类型检查

## API 文档

开发环境下可访问 Swagger 文档：`http://localhost:3000/docs`

### 主要 API 端点

- **🏥 健康检查**: `GET /api/v1/health`
- **🗄️ 数据库管理**:
  - `GET /api/v1/database/status` - 数据库状态
  - `POST /api/v1/database/seed` - 创建种子数据
  - `GET /api/v1/database/seed/check` - 检查种子数据
- **🔐 认证**:
  - `POST /api/v1/auth/login` - 用户登录
  - `POST /api/v1/auth/refresh` - 刷新令牌
- **👤 用户管理**:
  - `GET /api/v1/users/profile` - 获取用户资料（需认证）

### WebSocket 连接

- **🔌 端点**: `ws://localhost:3000/socket.io/`
- **🚀 传输**: WebSocket + HTTP 轮询
- **🔒 安全**: 支持 CORS 认证

## 项目结构

```
src/
├── main.ts              # 应用入口
├── app.module.ts        # 根模块
├── config/              # 配置管理
├── common/              # 通用工具
│   ├── filters/         # 异常过滤器
│   ├── interceptors/    # 拦截器
│   ├── guards/          # 守卫
│   └── utils/           # 工具函数
├── modules/             # 业务模块
│   ├── auth/            # 认证模块
│   ├── users/           # 用户管理
│   ├── notebooks/       # 笔记本管理
│   ├── notes/           # 笔记管理
│   ├── websocket/       # WebSocket 协作
│   ├── trpc/            # tRPC API
│   ├── health/          # 健康检查
│   └── database/        # 数据库服务
└── types/               # 类型定义
```

## 🐳 Docker 开发环境

### 环境配置

项目使用自定义的 Docker Compose 项目名称：`noteum-services-dev`

- **📦 容器组名称**: `noteum-services-dev`
- **🌐 网络名称**: `noteum-services-dev_noteum-network`
- **💾 数据卷**:
  - `noteum-services-dev_postgres_data`
  - `noteum-services-dev_redis_data`
  - `noteum-services-dev_pgadmin_data`

### 服务管理脚本

项目提供了便捷的管理脚本：

```bash
# 启动脚本
./start-dev.sh [all|core|tools]

# 停止脚本
./stop-dev.sh [all|core|tools]
```

**参数说明:**

- `all` - 启动/停止所有服务（默认）
- `core` - 只启动/停止核心服务（app, postgres, redis）
- `tools` - 启动/停止管理工具（pgadmin, redis-commander）

### 容器信息

所有容器都配置了健康检查，你可以通过以下命令查看状态：

```bash
# 查看所有容器状态
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 查看容器日志
docker logs noteum-services-dev-app

# 进入应用容器
docker-compose -p noteum-services-dev exec app sh
```

### 数据持久化

- **🐘 PostgreSQL 数据**: 持久化到 `noteum-services-dev_postgres_data` 卷
- **🔴 Redis 数据**: 持久化到 `noteum-services-dev_redis_data` 卷
- **🔧 pgAdmin 配置**: 持久化到 `noteum-services-dev_pgadmin_data` 卷

即使停止容器，数据也会保留。

## 开发指南

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 编写单元测试和集成测试
- 使用 ULID 作为主键标识符

### 测试策略

项目采用 TDD（测试驱动开发）方法：

1. 先编写失败的测试
2. 实现最小可工作代码
3. 重构并确保测试通过

### 提交规范

使用约定式提交格式：

- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建工具或辅助工具的变动

## 🔧 故障排除

### 常见问题

#### 1. Prisma 客户端初始化失败

**问题**: 应用启动时出现 "Prisma Client did not initialize yet" 错误

**解决方案**:

```bash
# 重新生成 Prisma 客户端
docker-compose -p noteum-services-dev exec app sh -c "cd /app/apps/services && pnpm prisma generate"

# 重启应用容器
docker-compose -p noteum-services-dev restart app
```

#### 2. 端口冲突

**问题**: 端口 3000、5432、6379、8080、8081 被占用

**解决方案**:

```bash
# 查看占用端口的进程
lsof -i :3000
lsof -i :5432

# 停止冲突的服务或修改 docker-compose.yml 中的端口映射
```

#### 3. 数据库连接失败

**问题**: 应用无法连接到 PostgreSQL

**解决方案**:

```bash
# 检查 PostgreSQL 容器状态
docker ps | grep postgres

# 查看数据库日志
docker logs noteum-services-dev-postgres

# 检查数据库连接
docker-compose -p noteum-services-dev exec postgres psql -U postgres -d noteum -c "SELECT version();"
```

#### 4. 容器启动失败

**问题**: 容器无法启动或健康检查失败

**解决方案**:

```bash
# 查看容器日志
docker logs noteum-services-dev-app

# 重启所有服务
./stop-dev.sh && ./start-dev.sh

# 清理并重新构建
docker-compose -p noteum-services-dev down -v
docker system prune -f
./start-dev.sh
```

### 日志查看

```bash
# 查看所有服务日志
docker-compose -p noteum-services-dev logs

# 查看特定服务日志
docker-compose -p noteum-services-dev logs app
docker-compose -p noteum-services-dev logs postgres
docker-compose -p noteum-services-dev logs redis

# 实时跟踪日志
docker-compose -p noteum-services-dev logs -f app
```

### 性能监控

```bash
# 查看容器资源使用情况
docker stats

# 查看容器详细信息
docker inspect noteum-services-dev-app
```
