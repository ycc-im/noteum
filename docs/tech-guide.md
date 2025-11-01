# Noteum 项目技术指南

## 项目概述

Noteum 是一个现代化的笔记管理应用，提供丰富的功能和优秀的用户体验。

## 技术栈

### 前端
- **框架**: React 18.2+
- **语言**: TypeScript 5.0+
- **状态管理**: Zustand
- **UI 库**: shadcn/ui + Radix UI
- **路由**: TanStack Router
- **构建工具**: Vite 4.5+
- **样式**: Tailwind CSS
- **桌面应用**: Tauri

### 后端
- **运行时**: Node.js 18+
- **框架**: NestJS 10.x LTS
- **数据库**: PostgreSQL 15+
- **ORM**: Prisma 5.0+
- **认证**: JWT + Passport
- **API**: tRPC + Socket.io
- **缓存**: Redis 4.6+
- **任务队列**: Redis Streams
- **AI 集成**: LangChain.js + LangGraph

### 开发工具
- **包管理器**: pnpm 8.15.0+
- **代码格式化**: Prettier 3.0+
- **代码检查**: ESLint 8.0+
- **测试框架**: Vitest (前端) + Jest (后端)
- **版本控制**: Git + Husky
- **变更管理**: Changesets

## 项目结构

```
noteum/
├── docs/                  # 项目文档
├── src/                   # 源代码
│   ├── components/        # 组件
│   ├── pages/            # 页面
│   ├── hooks/            # 自定义钩子
│   ├── utils/            # 工具函数
│   ├── types/            # 类型定义
│   └── styles/           # 样式文件
├── server/               # 服务端代码
├── public/               # 静态资源
├── tests/                # 测试文件
└── config/               # 配置文件
```

## 开发规范

### 代码风格
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式

### 命名规范
- **组件**: PascalCase (如: `NoteEditor`)
- **文件**: kebab-case (如: `note-editor.tsx`)
- **变量/函数**: camelCase (如: `getUserNotes`)
- **常量**: SCREAMING_SNAKE_CASE (如: `API_BASE_URL`)

### Git 提交规范
使用 Conventional Commits 格式：
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

类型说明：
- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构代码
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 开发环境设置

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.15.0
- PostgreSQL 15+
- Redis 4.6+

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器

#### 完整开发环境（推荐）
```bash
pnpm dev
```
启动所有服务（后端服务 + 前端客户端）

#### Tauri 桌面应用开发
```bash
pnpm dev:tauri
```
启动 Tauri 桌面应用开发环境

#### 分离式开发
```bash
# 仅启动后端服务
pnpm dev:services

# 仅启动前端客户端
pnpm dev:client

# 检查开发环境健康状态
pnpm dev:health

# 停止所有开发服务
pnpm dev:stop
```

### 构建项目
```bash
pnpm build
```

### 运行测试
```bash
# 运行所有测试
pnpm test

# 运行前端测试
pnpm --filter @noteum/client test

# 运行后端测试
pnpm --filter @noteum/services test
```

## API 设计规范

### RESTful API
- 使用标准的 HTTP 方法 (GET, POST, PUT, DELETE)
- 使用合适的 HTTP 状态码
- 统一的响应格式

### tRPC API
- 类型安全的 API 调用
- 自动生成的客户端代码
- 内置的错误处理

#### tRPC 订阅消息分发
基于 tRPC 的实时订阅机制，支持多客户端消息分发和实时协作：

```typescript
// 服务端订阅定义
app.subscription('note.updated', {
  resolve({ payload }) {
    return payload
  },
})

// 客户端订阅使用
const subscription = trpc.note.updated.useSubscription(undefined, {
  onData(data) {
    // 处理实时更新数据
    console.log('笔记更新:', data)
  },
})
```

**特性**：
- 实时消息推送
- 多客户端同步
- 类型安全的订阅数据
- 自动重连机制
- 基于 Socket.io 的底层实现

## 数据库设计

### 表结构
```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 笔记表
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 性能优化

### 前端优化
- 使用 React.memo 避免不必要的重渲染
- 实现虚拟滚动处理大量数据
- 使用懒加载减少初始包大小
- 图片压缩和 WebP 格式

### 后端优化
- 数据库索引优化
- API 响应缓存
- 分页查询
- 数据库连接池

## 安全考虑

### 前端安全
- XSS 防护
- CSRF 保护
- 敏感数据加密存储

### 后端安全
- JWT 令牌验证
- 输入数据验证
- SQL 注入防护
- 访问频率限制

## 任务队列设计

### Redis Streams 实现持久化任务队列
使用 Redis Streams 创建可靠的任务队列系统，支持：

```typescript
// 任务生产者
async function addTask(streamName: string, taskData: any) {
  await redis.xadd(streamName, '*', 'data', JSON.stringify(taskData))
}

// 任务消费者
async function processTasks(streamName: string, consumerGroup: string) {
  while (true) {
    const results = await redis.xreadgroup(
      'GROUP', consumerGroup, consumerId,
      'COUNT', 1,
      'BLOCK', 1000,
      'STREAMS', streamName, '>'
    )

    if (results && results.length > 0) {
      await handleTask(results[0])
      await redis.xack(streamName, consumerGroup, messageId)
    }
  }
}
```

**特性**：
- 持久化存储
- 消费者组支持
- 消息确认机制
- 故障恢复
- 负载均衡

### LangGraph 工作流集成
将任务队列与 LangGraph 工作流结合，实现复杂的异步任务处理：

```typescript
// LangGraph 节点与任务队列集成
const processingNode = async (state: WorkflowState) => {
  const taskId = await queueTask('document-processing', state)
  return { taskId, status: 'queued' }
}
```

## 测试策略

### 单元测试
- 使用 Jest 进行单元测试
- 组件测试使用 React Testing Library
- 测试覆盖率目标 > 80%

### 集成测试
- API 端点测试
- 数据库操作测试
- 端到端测试

### 测试命令
```bash
# 运行所有测试
pnpm test

# 运行前端测试
pnpm --filter @noteum/client test

# 运行后端测试
pnpm --filter @noteum/services test

# 运行测试并生成覆盖率报告
pnpm --filter @noteum/client test:coverage
pnpm --filter @noteum/services test:cov

# 监视模式运行测试
pnpm --filter @noteum/client test:watch
pnpm --filter @noteum/services test:watch
```

## 故障排除

### 常见问题
1. **依赖安装失败**
   - 清除缓存: `pnpm store prune`
   - 重新安装: `rm -rf node_modules && pnpm install`

2. **构建失败**
   - 检查 TypeScript 类型错误: `pnpm type-check`
   - 确认环境变量配置

3. **数据库连接问题**
   - 检查 PostgreSQL 服务是否运行
   - 验证数据库连接字符串配置
   - 检查 Prisma 配置

4. **Redis 连接问题**
   - 检查 Redis 服务是否运行
   - 验证 Redis 连接配置
   - 检查防火墙设置

5. **端口占用问题**
   - 检查端口占用: `pnpm ports:check`
   - 验证端口配置: `pnpm ports:validate`
   - 停止冲突服务

## 贡献指南

### 开发流程
1. Fork 项目仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -m 'feat: add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 创建 Pull Request

### 代码审查
- 所有 PR 需要经过代码审查
- 确保测试通过
- 更新相关文档

## 参考资料

### 官方文档
- [React 文档](https://react.dev/)
- [TanStack Router 文档](https://tanstack.com/router/latest)
- [NestJS 文档](https://docs.nestjs.com/)
- [tRPC 文档](https://trpc.io/docs)
- [Prisma 文档](https://www.prisma.io/docs/)
- [shadcn/ui 文档](https://ui.shadcn.com/)
- [Tauri 文档](https://tauri.app/)

### 最佳实践
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [NestJS Best Practices](https://docs.nestjs.com/techniques)
- [Prisma Best Practices](https://www.prisma.io/docs/concepts/overview/prisma-client-workflow)

## 更新日志

### v1.0.0 (待发布)
- 初始版本发布
- 基本笔记管理功能
- 用户认证系统

---

**最后更新**: 2025-10-27
**文档版本**: v1.0.0