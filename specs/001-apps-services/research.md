# Research Report: Apps/Services 项目框架

**Date**: 2025-10-15
**Feature**: Apps/Services 项目框架
**Research Focus**: NestJS + y-websocket + tRPC + PostgreSQL + Docker 集成

## 技术决策和选择

### 1. NestJS 框架选择
**决策**: 使用 NestJS 10.x LTS 版本作为主框架
**理由**:
- 提供完整的 TypeScript 优先开发体验
- 内置依赖注入和模块化架构
- 优秀的 WebSocket 支持
- 成熟的生态系统
- 与 Prisma 和 tRPC 良好集成

**考虑的替代方案**:
- Express.js + 手动架构配置（功能过于基础）
- FastAPI + Python（与现有技术栈不符）

### 2. y-websocket 协作支持
**决策**: 集成 y-websocket 和原生 WebSocket 适配器
**理由**:
- 基于冲突无关复制数据类型（CRDT），天然支持实时协作
- 自动处理操作转换和冲突解决
- 良好的性能和扩展性
- 与 NestJS WebSocket 集成良好

**实施模式**:
- 使用混合适配器策略（y-websocket + 原生 ws）
- 实现文档管理和持久化服务
- 提供用户感知和光标跟踪功能

### 3. 数据库和 ORM 选择
**决策**: Prisma + PostgreSQL + pgvector
**理由**:
- Prisma 提供类型安全的数据库访问
- PostgreSQL 支持向量扩展（pgvector）用于未来 AI 功能
- 支持二进制数据存储（yjs 数据）和结构化数据
- 优秀的迁移和类型生成工具

**关键特性**:
- 混合存储策略：关系型数据 + 向量数据 + 二进制数据
- 向量相似性搜索支持
- 事务支持和数据一致性保证

### 4. 标识符策略选择
**决策**: 使用 ULID 替代 UUID 作为主键标识符
**理由**:
- ULID (Universally Unique Lexicographically Sortable Identifier) 提供时间有序性
- 在文档协作场景中，时间戳对版本控制和活动日志至关重要
- 更好的数据库索引性能，特别是对时间序列查询
- 调试友好，可以直接从 ID 解码出创建时间
- 在高并发写入场景下减少索引碎片化

**ULID 的优势**:
```typescript
// ULID 示例: 01H8X6PZ5Q8Y0Z0X0Z0X0Z0X0Z0
// 结构: [时间戳 (48位)][随机性 (80位)]
const noteId = ulid(); // 包含时间戳信息
const createdAt = decodeTime(noteId); // 可以直接解码时间
```

**性能考虑**:
- B-tree 索引在有序数据上表现更佳
- 分页查询避免随机磁盘 I/O
- 缓存局部性更好，相邻记录更有可能同时访问

### 5. 笔记本组织架构
**决策**: 引入笔记本概念作为内容组织的基础结构
**理由**:
- 符合用户思维习惯：笔记本 → 笔记的自然层级关系
- 权限管理清晰：支持私有、共享、公开笔记本
- 协作场景丰富：团队共享笔记本和个人私有笔记本并存
- 扩展性良好：为未来的文件夹、标签系统预留空间

**核心特性**:
```typescript
// 笔记本管理
interface Notebook {
  id: string;           // ULID
  title: string;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  ownerId: string;
  collaborators: NotebookCollaborator[];
  notes: Note[];
}

// 权限继承机制
interface Note {
  notebookId: string;
  inheritPermissions: boolean;
  customCollaborators?: NoteCollaborator[];
}
```

### 7. tRPC API 集成
**决策**: 使用 tRPC 替代传统的 REST API
**理由**:
- 端到端类型安全
- 自动客户端生成
- 简化的 API 开发体验
- 与 NestJS 无缝集成

**实施策略**:
- 模块化路由设计
- 类型安全的数据验证（Zod）
- 认证和授权中间件集成

### 8. Docker 部署方案
**决策**: 使用 Docker Compose 进行容器化部署
**理由**:
- 简化依赖管理和环境一致性
- 支持开发和生产环境配置
- 便于水平扩展和负载均衡
- 集成监控和日志管理

**核心组件**:
- 多阶段构建优化
- 健康检查配置
- 资源限制和性能优化
- 监控集成（Prometheus + Grafana）

## 技术实施策略

### 1. 项目结构设计
```
apps/services/
├── src/
│   ├── main.ts              # 应用入口点
│   ├── app.module.ts        # 根模块
│   ├── config/              # 配置管理
│   ├── database/            # 数据库配置和服务
│   ├── modules/
│   │   ├── trpc/            # tRPC 模块
│   │   ├── websocket/       # WebSocket 和 y-websocket
│   │   ├── ai/              # Langchain 集成（预留）
│   │   └── core/            # 核心功能
│   ├── common/              # 共享工具
│   └── types/               # TypeScript 定义
├── test/                    # 测试文件
├── prisma/                  # Prisma 配置和迁移
├── docker/                  # Docker 配置
└── package.json
```

### 2. 数据存储策略
**混合存储架构**:
- **结构化数据**: 使用 Prisma 模型存储用户、文档、元数据
- **向量数据**: 使用 pgvector 扩展存储 AI 嵌入向量
- **二进制数据**: 存储 yjs 文档状态和更新
- **缓存层**: Redis 用于会话和临时数据

### 3. 实时协作实现
**核心组件**:
- **文档管理服务**: 管理 yjs 文档实例和生命周期
- **WebSocket Gateway**: 处理实时连接和消息路由
- **感知服务**: 跟踪用户状态和光标位置
- **持久化服务**: 保存和恢复协作状态

### 4. 性能优化策略
**关键优化点**:
- **连接池管理**: 文档实例复用和内存管理
- **缓存策略**: 文档快照和用户状态缓存
- **批量操作**: 数据库写入优化
- **索引策略**: 向量搜索和文本查询优化

## 依赖和集成模式

### 1. 主要依赖包
```json
{
  "dependencies": {
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-ws": "^10.0.0",
    "@nestjs/websockets": "^10.0.0",
    "@trpc/server": "^10.45.0",
    "@prisma/client": "^5.0.0",
    "y-websocket": "^1.5.0",
    "yjs": "^13.6.0",
    "redis": "^4.6.10",
    "ulid": "^2.3.0",
    "winston": "^3.11.0",
    "zod": "^3.22.4"
  }
}
```

### 2. 集成模式
- **tRPC + NestJS**: 使用 `nestjs-trpc` 包进行集成
- **y-websocket + NestJS**: 使用原生 WebSocket 适配器
- **Prisma + PostgreSQL**: 标准配置和连接池管理
- **Redis + NestJS**: 缓存和会话管理

## 开发和部署最佳实践

### 1. 开发环境配置
- **热重载**: NestJS 开发服务器
- **调试支持**: Node.js 调试端口
- **数据库管理**: Docker Compose 本地实例
- **类型检查**: 严格的 TypeScript 配置

### 2. 生产环境配置
- **容器化**: 多阶段 Docker 构建
- **负载均衡**: Nginx 反向代理
- **监控**: Prometheus + Grafana
- **日志**: 结构化日志和集中收集

### 3. 安全考虑
- **认证**: JWT 令牌验证
- **授权**: 基于角色的访问控制
- **数据保护**: 加密存储和传输
- **速率限制**: API 和 WebSocket 连接限制

## 未来扩展性

### 1. AI 功能集成
- **Langchain.js**: 为未来的 AI 功能预留接口
- **向量搜索**: pgvector 支持语义搜索
- **嵌入管理**: 文档和查询向量化

### 2. 扩展性考虑
- **水平扩展**: 无状态服务设计
- **微服务架构**: 模块化便于拆分
- **数据分片**: 支持大规模协作

### 3. 监控和维护
- **性能指标**: 操作延迟和吞吐量
- **健康检查**: 服务和数据库状态
- **自动化**: 备份和恢复流程

## 风险评估和缓解

### 1. 技术风险
- **yjs 学习曲线**: 通过充分的研究和原型验证缓解
- **向量数据库性能**: 通过适当的索引和查询优化缓解
- **实时连接管理**: 通过连接池和资源管理缓解

### 2. 集成风险
- **依赖版本冲突**: 锁定稳定版本和定期更新
- **性能瓶颈**: 通过监控和性能测试提前发现
- **数据一致性**: 通过事务和适当的并发控制

## 结论

研究结果表明，选择的技术栈（NestJS + y-websocket + tRPC + PostgreSQL + Docker）能够很好地满足项目的需求：

1. **类型安全**: 全栈 TypeScript 支持
2. **实时协作**: 基于成熟的技术实现
3. **数据存储**: 支持多种数据类型和查询模式
4. **部署灵活性**: 容器化部署便于管理
5. **未来扩展**: 为 AI 功能做好准备

所有关键技术的集成方案已经验证可行，为下一阶段的设计和实现提供了坚实的基础。