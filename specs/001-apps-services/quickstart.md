# Quick Start Guide: Apps/Services 项目框架

## 概述

这是 Apps/Services 项目的快速开始指南，帮助开发者快速搭建和运行基于 NestJS + tRPC + PostgreSQL + y-websocket 的协作平台后端服务。

## 系统要求

- Node.js 18+
- pnpm 8+
- Docker 和 Docker Compose
- PostgreSQL 16+ (本地开发可选，推荐使用 Docker)

## 项目结构

```
apps/services/
├── src/
│   ├── main.ts                    # 应用入口点
│   ├── app.module.ts              # 根模块
│   ├── config/                    # 配置管理
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   ├── database/                  # 数据库相关
│   │   ├── prisma.service.ts
│   │   └── migrations/
│   ├── modules/
│   │   ├── auth/                  # 认证模块
│   │   ├── users/                 # 用户管理
│   │   ├── notes/                # 笔记管理
│   │   ├── trpc/                  # tRPC 模块
│   │   ├── websocket/             # WebSocket 模块
│   │   ├── collaboration/         # 协作功能
│   │   └── ai/                    # AI 功能 (预留)
│   ├── common/                    # 共享工具
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── decorators/
│   └── types/                     # TypeScript 类型定义
├── test/                          # 测试文件
├── prisma/                        # Prisma 配置
│   ├── schema.prisma
│   └── migrations/
├── docker/                        # Docker 配置
├── package.json
└── tsconfig.json
```

## 快速开始

### 1. 环境准备

```bash
# 安装依赖
pnpm install

# 复制环境变量文件
cp .env.example .env
```

### 2. 配置环境变量

编辑 `.env` 文件：

```env
# 应用配置
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# 数据库配置
DATABASE_URL="postgresql://postgres:password@localhost:5432/noteum?schema=public"

# Redis 配置
REDIS_URL="redis://localhost:6379"

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# y-websocket 配置
YJS_HOST=localhost
YJS_PORT=3001

# 文件上传配置
UPLOAD_MAX_SIZE=10485760  # 10MB
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif

# 日志配置
LOG_LEVEL=debug
LOG_FORMAT=json

# CORS 配置
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### 3. 数据库设置

使用 Docker Compose 启动数据库：

```bash
# 启动 PostgreSQL 和 Redis
docker-compose -f docker-compose.dev.yml up -d postgres redis

# 等待数据库启动
sleep 5

# 运行数据库迁移
pnpm prisma migrate dev

# 生成 Prisma 客户端
pnpm prisma generate

# (可选) 种子数据
pnpm prisma db seed
```

### 4. 启动开发服务器

```bash
# 启动开发服务器
pnpm start:dev

# 或者使用调试模式
pnpm start:debug
```

服务器将在 `http://localhost:3000` 启动。

### 5. 验证安装

访问健康检查端点：

```bash
curl http://localhost:3000/health
```

应该返回类似以下内容：

```json
{
  "status": "healthy",
  "timestamp": "2023-10-15T10:30:00.000Z",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": 5
    },
    "redis": {
      "status": "healthy",
      "responseTime": 2
    },
    "websockets": {
      "status": "healthy",
      "activeConnections": 0
    }
  },
  "version": "1.0.0",
  "uptime": 120
}
```

## 核心 API 使用

### 1. 用户认证

```bash
# 注册新用户
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "securePassword123",
    "displayName": "Test User"
  }'

# 用户登录
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

### 2. 文档管理

```bash
# 创建文档 (需要认证头)
curl -X POST http://localhost:3000/api/v1/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "我的第一个文档",
    "description": "这是一个测试文档",
    "type": "DOCUMENT"
  }'

# 获取文档列表
curl -X GET "http://localhost:3000/api/v1/notes?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 获取特定文档
curl -X GET http://localhost:3000/api/v1/notes/{DOCUMENT_ID} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. 协作功能

```bash
# 获取文档协作者
curl -X GET http://localhost:3000/api/v1/notes/{DOCUMENT_ID}/collaborators \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 邀请协作者
curl -X POST http://localhost:3000/api/v1/notes/{DOCUMENT_ID}/collaborators \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "collaborator@example.com",
    "permission": "WRITE",
    "message": "邀请你协作编辑这个文档"
  }'
```

### 4. 笔记本管理

```bash
# 创建笔记本
curl -X POST http://localhost:3000/api/v1/notebooks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "项目开发笔记",
    "description": "记录项目开发过程中的思考",
    "visibility": "PRIVATE"
  }'

# 获取笔记本列表
curl -X GET "http://localhost:3000/api/v1/notebooks?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 在笔记本中创建笔记
curl -X POST http://localhost:3000/api/v1/notebooks/{NOTEBOOK_ID}/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "API 设计文档",
    "description": "详细的 API 设计思路",
    "type": "DOCUMENT"
  }'

# 获取笔记本下的笔记
curl -X GET "http://localhost:3000/api/v1/notebooks/{NOTEBOOK_ID}/notes" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 邀请笔记本协作者
curl -X POST http://localhost:3000/api/v1/notebooks/{NOTEBOOK_ID}/collaborators \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "teammate@example.com",
    "permission": "WRITE",
    "message": "邀请你一起维护这个项目笔记"
  }'
```

## WebSocket 连接

### 1. 连接到 y-websocket

```javascript
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// 创建 Yjs 文档
const ydoc = new Y.Doc();

// 连接到 WebSocket
const wsProvider = new WebsocketProvider(
  'ws://localhost:3001',  // WebSocket 服务器地址
  'note-id',           // 文档 ID
  ydoc
);

// 监听连接事件
wsProvider.on('sync', (isSynced) => {
  console.log('文档同步状态:', isSynced);
});

// 监听文档变化
ydoc.on('update', (update) => {
  console.log('文档更新:', update);
});

// 获取文档内容
const ytext = ydoc.getText('content');
console.log('文档内容:', ytext.toString());
```

### 2. 用户感知

```javascript
// 获取感知信息
const awareness = wsProvider.awareness;

// 设置本地用户信息
awareness.setLocalState({
  user: {
    id: 'user-id',
    name: '用户名',
    color: '#ff6b6b'
  },
  cursor: {
    position: 100,
    selection: { start: 100, end: 110 }
  }
});

// 监听其他用户变化
awareness.on('change', (changes) => {
  console.log('用户感知变化:', changes);

  // 获取所有在线用户
  const users = Array.from(awareness.getStates().values());
  console.log('在线用户:', users);
});
```

## 测试

### 1. 运行单元测试

```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:cov

# 监视模式运行测试
pnpm test:watch
```

### 2. 运行端到端测试

```bash
pnpm test:e2e
```

### 3. API 测试示例

使用内置的 API 测试工具：

```bash
# 运行 API 测试
pnpm test:api
```

## 开发工具

### 1. 代码检查和格式化

```bash
# ESLint 检查
pnpm lint

# 自动修复 ESLint 问题
pnpm lint --fix

# Prettier 格式化
pnpm format

# TypeScript 类型检查
pnpm type-check
```

### 2. 数据库管理

```bash
# 创建新的迁移
pnpm prisma migrate dev --name add_new_table

# 重置数据库
pnpm prisma migrate reset

# 查看数据库
pnpm prisma studio

# 生成客户端
pnpm prisma generate
```

### 3. 构建和部署

```bash
# 构建生产版本
pnpm build

# 运行生产版本
pnpm start:prod

# 构建 Docker 镜像
docker build -t noteum-services .
```

## 配置说明

### 1. 数据库配置

在 `prisma/schema.prisma` 中定义数据模型：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // ... 其他字段
}
```

### 2. tRPC 配置

在 `src/modules/trpc/trpc.module.ts` 中配置 tRPC：

```typescript
import { TRPCModule } from 'nestjs-trpc';

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: './src/@generated/trpc.schema.ts',
      context: ({ req, res }) => ({
        req,
        res,
        user: req.user, // 来自认证中间件
      }),
    }),
  ],
})
export class TrpcModule {}
```

### 3. WebSocket 配置

在 `src/modules/websocket/websocket.gateway.ts` 中配置 WebSocket：

```typescript
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(','),
    credentials: true,
  },
})
export class NoteGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('客户端连接:', client.id);
  }
}
```

## 常见问题

### 1. 数据库连接失败

**问题**: 无法连接到 PostgreSQL
**解决方案**:
- 确保 PostgreSQL 服务正在运行
- 检查 `.env` 文件中的 `DATABASE_URL` 配置
- 验证数据库用户权限

```bash
# 测试数据库连接
psql $DATABASE_URL
```

### 2. Redis 连接失败

**问题**: 无法连接到 Redis
**解决方案**:
- 确保 Redis 服务正在运行
- 检查 `.env` 文件中的 `REDIS_URL` 配置

```bash
# 测试 Redis 连接
redis-cli -u $REDIS_URL ping
```

### 3. WebSocket 连接问题

**问题**: WebSocket 连接失败
**解决方案**:
- 检查 CORS 配置
- 确保 WebSocket 端口未被占用
- 验证防火墙设置

### 4. 构建错误

**问题**: TypeScript 编译错误
**解决方案**:
- 运行 `pnpm type-check` 检查类型错误
- 确保 Prisma 客户端已生成：`pnpm prisma generate`
- 检查依赖版本兼容性

## 下一步

1. **阅读 API 文档**: 查看 `/contracts/openapi.yaml` 了解完整的 API 规范
2. **查看数据模型**: 参考 `/data-model.md` 了解数据库设计
3. **运行完整测试**: 执行所有测试套件确保功能正常
4. **集成前端**: 使用生成的 API 客户端集成前端应用
5. **部署到生产**: 使用 Docker Compose 部署到生产环境

## 支持和资源

- **API 文档**: `http://localhost:3000/docs` (Swagger UI)
- **健康检查**: `http://localhost:3000/health`
- **数据库管理**: `http://localhost:5555` (Prisma Studio，运行 `pnpm prisma studio`)
- **日志文件**: `logs/` 目录
- **配置文件**: `.env` 和相关配置文件

这个快速开始指南应该能帮助您快速搭建和运行 Apps/Services 项目。如有问题，请参考相关文档或联系开发团队。