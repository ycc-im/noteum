# Data Model: Apps/Services 项目框架

**Date**: 2025-10-15
**Feature**: Apps/Services 项目框架
**Database**: PostgreSQL with pgvector extension
**ORM**: Prisma

## 核心实体设计

### 1. 用户管理实体

#### User (用户)
```typescript
interface User {
  id: string                    // ULID 主键
  email: string                 // 邮箱地址 (唯一)
  username: string              // 用户名 (唯一)
  passwordHash: string          // 密码哈希
  profile: UserProfile          // 用户档案 (一对一)
  createdAt: DateTime           // 创建时间
  updatedAt: DateTime           // 更新时间
  lastLoginAt?: DateTime        // 最后登录时间
  isActive: boolean             // 账户状态
  role: UserRole                // 用户角色
}

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  VIEWER = 'VIEWER'
}

interface UserProfile {
  id: string                    // ULID 主键
  userId: string                // 外键关联 User
  displayName: string           // 显示名称
  avatar?: string               // 头像 URL
  bio?: string                  // 个人简介
  preferences: Json             // 用户偏好设置
  user: User                    // 关联用户
}
```

#### Session (会话)
```typescript
interface Session {
  id: string                    // ULID 主键
  userId: string                // 外键关联 User
  tokenHash: string             // JWT 令牌哈希
  expiresAt: DateTime           // 过期时间
  deviceInfo: Json              // 设备信息
  ipAddress: string             // IP 地址
  userAgent: string             // 用户代理
  isActive: boolean             // 会话状态
  user: User                    // 关联用户
}
```

### 2. 笔记本实体

#### Notebook (笔记本)
```typescript
interface Notebook {
  id: string                    // ULID 主键
  title: string                 // 笔记本标题
  description?: string          // 笔记本描述
  ownerId: string               // 笔记本所有者
  visibility: NotebookVisibility // 可见性设置
  settings: Json                // 笔记本设置
  metadata: Json                // 笔记本元数据
  createdAt: DateTime           // 创建时间
  updatedAt: DateTime           // 更新时间
  version: number               // 版本号

  // 关联关系
  owner: User                   // 笔记本所有者
  collaborators: NotebookCollaborator[]
  notes: Note[]                 // 包含的笔记
  tags: NotebookTag[]          // 笔记本标签
}

enum NotebookVisibility {
  PRIVATE = 'PRIVATE',      // 私有，只有自己和授权用户可见
  SHARED = 'SHARED',        // 共享，协作者可见
  PUBLIC = 'PUBLIC'         // 公开，所有人可见
}

#### NotebookCollaborator (笔记本协作者)
```typescript
interface NotebookCollaborator {
  id: string                    // ULID 主键
  notebookId: string            // 笔记本 ID
  userId: string                // 用户 ID
  permission: Permission        // 权限级别
  invitedBy: string             // 邀请人 ID
  joinedAt: DateTime            // 加入时间
  lastActivityAt?: DateTime     // 最后活动时间

  // 关联关系
  notebook: Notebook            // 关联笔记本
  user: User                    // 关联用户
  invitedByUser: User           // 邀请人
}
```

#### NotebookTag (笔记本标签)
```typescript
interface NotebookTag {
  id: string                    // ULID 主键
  notebookId: string            // 笔记本 ID
  tag: string                   // 标签名称
  color: string                 // 标签颜色
  createdAt: DateTime           // 创建时间

  // 关联关系
  notebook: Notebook            // 关联笔记本
}
```

### 3. 笔记和协作实体

#### Note (笔记)
```typescript
interface Note {
  id: string                    // ULID 主键
  title: string                 // 笔记标题
  description?: string          // 笔记描述
  notebookId: string            // 所属笔记本 ID
  ownerId: string               // 笔记创建者 ID
  type: NoteType            // 笔记类型
  status: NoteStatus        // 笔记状态
  settings: Json                // 笔记设置
  metadata: Json                // 笔记元数据
  createdAt: DateTime           // 创建时间
  updatedAt: DateTime           // 更新时间
  version: number               // 版本号

  // 权限控制
  inheritPermissions: boolean = true  // 是否继承笔记本权限
  customCollaborators?: NoteCollaborator[]  // 自定义协作者（如果不继承）

  // 关联关系
  notebook: Notebook            // 所属笔记本
  owner: User                   // 笔记创建者
  collaborators: NoteCollaborator[]
  updates: NoteUpdate[]
  snapshots: NoteSnapshot[]
  embeddings: NoteEmbedding[]
  chunks: NoteChunk[]
}

enum NoteType {
  NOTE = 'NOTE',           // 普通笔记
  DOCUMENT = 'DOCUMENT',   // 文档类型
  WHITEBOARD = 'WHITEBOARD', // 白板
  CODE = 'CODE',           // 代码片段
  TODO = 'TODO',           // 待办事项
  MINDMAP = 'MINDMAP'      // 思维导图
}

enum NoteStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
}
```

#### NoteCollaborator (文档协作者)
```typescript
interface NoteCollaborator {
  id: string                    // ULID 主键
  documentId: string            // 文档 ID
  userId: string                // 用户 ID
  permission: Permission        // 权限级别
  joinedAt: DateTime            // 加入时间
  lastActivityAt?: DateTime     // 最后活动时间

  // 关联关系
  document: Note            // 关联文档
  user: User                    // 关联用户
}

enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER'
}
```

### 3. YJS 协作数据实体

#### NoteSnapshot (文档快照)
```typescript
interface NoteSnapshot {
  id: string                    // ULID 主键
  documentId: string            // 文档 ID
  snapshot: Bytes               // YJS 文档快照 (二进制)
  stateVector?: Bytes           // YJS 状态向量 (二进制)
  version: number               // 版本号
  createdAt: DateTime           // 创建时间

  // 关联关系
  document: Note            // 关联文档
}
```

#### NoteUpdate (文档更新)
```typescript
interface NoteUpdate {
  id: string                    // ULID 主键
  documentId: string            // 文档 ID
  update: Bytes                 // YJS 更新数据 (二进制)
  origin: string                // 更新来源 (用户 ID 或系统)
  timestamp: DateTime           // 更新时间
  updateType: UpdateType        // 更新类型

  // 关联关系
  document: Note            // 关联文档
}

enum UpdateType {
  CONTENT = 'CONTENT',
  FORMAT = 'FORMAT',
  STRUCTURE = 'STRUCTURE',
  METADATA = 'METADATA'
}
```

#### UserAwareness (用户感知)
```typescript
interface UserAwareness {
  id: string                    // ULID 主键
  documentId: string            // 文档 ID
  userId: string                // 用户 ID
  cursorPosition?: number       // 光标位置
  selectionStart?: number       // 选择开始位置
  selectionEnd?: number         // 选择结束位置
  color: string                 // 用户标识颜色
  lastActivityAt: DateTime      // 最后活动时间
  isActive: boolean             // 活跃状态

  // 关联关系
  document: Note            // 关联文档
  user: User                    // 关联用户
}
```

### 4. AI 和向量数据实体

#### NoteEmbedding (文档嵌入)
```typescript
interface NoteEmbedding {
  id: string                    // ULID 主键
  documentId: string            // 文档 ID
  model: string                 // 嵌入模型名称
  dimensions: number            // 向量维度
  embedding: Bytes              // 向量数据 (二进制)
  chunkIndex?: number           // 文档块索引
  embeddingType: EmbeddingType  // 嵌入类型
  createdAt: DateTime           // 创建时间

  // 关联关系
  document: Note            // 关联文档
}

enum EmbeddingType {
  DOCUMENT = 'DOCUMENT',
  CHUNK = 'CHUNK',
  QUERY = 'QUERY',
  TITLE = 'TITLE'
}
```

#### NoteChunk (文档块)
```typescript
interface NoteChunk {
  id: string                    // ULID 主键
  documentId: string            // 文档 ID
  chunkIndex: number            // 块索引
  content: string               // 块内容
  embeddingId?: string          // 嵌入 ID (外键)
  metadata: Json                // 块元数据
  createdAt: DateTime           // 创建时间

  // 关联关系
  document: Note            // 关联文档
  embedding?: NoteEmbedding // 关联嵌入
}
```

### 5. 系统和日志实体

#### ActivityLog (活动日志)
```typescript
interface ActivityLog {
  id: string                    // ULID 主键
  userId: string                // 用户 ID
  documentId?: string           // 文档 ID (可选)
  action: ActivityAction        // 活动类型
  details: Json                 // 活动详情
  ipAddress: string             // IP 地址
  userAgent: string             // 用户代理
  timestamp: DateTime           // 时间戳

  // 关联关系
  user: User                    // 关联用户
  document?: Note           // 关联文档 (可选)
}

enum ActivityAction {
  CREATE_DOCUMENT = 'CREATE_DOCUMENT',
  UPDATE_DOCUMENT = 'UPDATE_DOCUMENT',
  DELETE_DOCUMENT = 'DELETE_DOCUMENT',
  SHARE_DOCUMENT = 'SHARE_DOCUMENT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  VIEW_DOCUMENT = 'VIEW_DOCUMENT'
}
```

#### SystemConfig (系统配置)
```typescript
interface SystemConfig {
  id: string                    // ULID 主键
  key: string                   // 配置键 (唯一)
  value: Json                   // 配置值
  description: string           // 配置描述
  category: ConfigCategory      // 配置分类
  isPublic: boolean             // 是否公开
  createdAt: DateTime           // 创建时间
  updatedAt: DateTime           // 更新时间
}

enum ConfigCategory {
  SYSTEM = 'SYSTEM',
  FEATURES = 'FEATURES',
  LIMITS = 'LIMITS',
  SECURITY = 'SECURITY'
}
```

## 数据关系图

```
User (1) <---> (1) UserProfile
User (1) <---> (N) Session
User (1) <---> (N) ActivityLog
User (1) <---> (N) Notebook (作为 owner)
User (1) <---> (N) NotebookCollaborator
User (1) <---> (N) Note (作为 owner)
User (1) <---> (N) NoteCollaborator

Notebook (1) <---> (N) NotebookCollaborator
Notebook (1) <---> (N) Note
Notebook (1) <---> (N) NotebookTag

Note (1) <---> (N) NoteCollaborator
Note (1) <---> (N) NoteUpdate
Note (1) <---> (N) NoteSnapshot
Note (1) <---> (N) NoteEmbedding
Note (1) <---> (N) NoteChunk
Note (1) <---> (N) UserAwareness
Note (1) <---> (N) ActivityLog

NoteEmbedding (1) <---> (N) NoteChunk
```

## 数据验证规则

### 1. 用户数据验证
- **email**: 必须是有效邮箱格式，唯一
- **username**: 3-30 字符，字母数字下划线，唯一
- **passwordHash**: 使用 bcrypt 哈希，最小长度 8

### 2. 文档数据验证
- **title**: 必填，1-255 字符
- **status**: 必须是预定义的枚举值
- **version**: 严格递增，系统管理

### 3. YJS 数据验证
- **snapshot**: 二进制数据，最大 10MB
- **update**: 二进制数据，最大 1MB
- **stateVector**: 二进制数据，最大 100KB

### 4. 向量数据验证
- **embedding**: 二进制数据，固定长度
- **dimensions**: 必须与嵌入向量长度一致
- **model**: 必须是支持的模型名称

## 索引策略

### 1. 主要索引
```sql
-- 用户相关
CREATE UNIQUE INDEX idx_user_email ON users(email);
CREATE UNIQUE INDEX idx_user_username ON users(username);
CREATE INDEX idx_session_user_id ON sessions(user_id);
CREATE INDEX idx_session_expires_at ON sessions(expires_at);

-- 笔记本相关
CREATE INDEX idx_notebook_owner_id ON notebooks(owner_id);
CREATE INDEX idx_notebook_visibility ON notebooks(visibility);
CREATE INDEX idx_notebooks_id_time_order ON notebooks(id); -- ULID 时间排序
CREATE INDEX idx_notebook_created_at ON notebooks(created_at);
CREATE INDEX idx_notebook_collaborator_notebook_id ON notebook_collaborators(notebook_id);
CREATE INDEX idx_notebook_collaborator_user_id ON notebook_collaborators(user_id);

-- 笔记相关 (ULID 的时间有序性提供了天然排序)
CREATE INDEX idx_note_owner_id ON notes(owner_id);
CREATE INDEX idx_note_notebook_id ON notes(notebook_id);
CREATE INDEX idx_note_status ON notes(status);
CREATE INDEX idx_notes_id_time_order ON notes(id); -- ULID 时间排序
CREATE INDEX idx_note_created_at ON notes(created_at);
CREATE INDEX idx_note_collaborator_note_id ON note_collaborators(note_id);
CREATE INDEX idx_note_collaborator_user_id ON note_collaborators(user_id);

-- YJS 相关 (ULID 支持按时间顺序查询更新)
CREATE INDEX idx_document_update_document_id ON note_updates(document_id);
CREATE INDEX idx_note_updates_id_time_order ON note_updates(id); -- ULID 时间排序
CREATE INDEX idx_document_update_timestamp ON note_updates(timestamp);
CREATE INDEX idx_document_snapshot_document_id ON note_snapshots(document_id);
CREATE INDEX idx_user_awareness_document_id ON user_awareness(document_id);
CREATE INDEX idx_user_awareness_user_id ON user_awareness(user_id);

-- 向量搜索索引
CREATE INDEX idx_document_embedding_embedding ON note_embeddings USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_document_embedding_model ON note_embeddings(model);
```

### 2. 复合索引
```sql
-- 协作查询优化
CREATE INDEX idx_notebook_collaborator_composite ON notebook_collaborators(notebook_id, permission);
CREATE INDEX idx_note_collaborator_composite ON note_collaborators(note_id, permission);
CREATE INDEX idx_note_notebook_created ON notes(notebook_id, created_at DESC);
CREATE INDEX idx_activity_log_user_timestamp ON activity_logs(user_id, timestamp);
CREATE INDEX idx_activity_log_note_timestamp ON activity_logs(note_id, timestamp);
CREATE INDEX idx_activity_logs_id_time_order ON activity_logs(id); -- ULID 时间排序用于活动日志
```

## 数据完整性约束

### 1. 外键约束
- 所有外键关系都设置了适当的 ON DELETE 和 ON UPDATE 规则
- 用户删除时，相关笔记本和笔记转移给系统账户或删除
- 笔记本删除时，所有相关笔记和数据级联删除
- 笔记删除时，所有相关数据级联删除

### 2. 唯一性约束
- 用户邮箱和用户名唯一
- 会话令牌唯一
- 文档协作者组合唯一

### 3. 检查约束
- 用户年龄限制
- 文档版本非负数
- 向量维度与模型匹配

## 性能优化考虑

### 1. 查询优化
- 频繁查询字段添加索引
- 复杂查询使用复合索引
- 向量搜索使用 HNSW 索引
- ULID 的时间有序性优化时间序列查询性能

### 2. 数据分区
- 按时间分区存储历史数据
- 大型文档更新数据分离存储

### 3. 缓存策略
- 用户会话缓存
- 文档元数据缓存
- 向量搜索结果缓存

## 安全考虑

### 1. 数据加密
- 密码使用 bcrypt 哈希
- 敏感数据字段加密存储
- 传输数据使用 HTTPS

### 2. 访问控制
- 基于角色的权限控制
- 文档级权限管理
- API 访问限制

### 3. 数据备份
- 定期全量备份
- 增量备份策略
- 灾难恢复计划

这个数据模型设计提供了完整的用户管理、文档协作、实时同步和 AI 功能支持，同时考虑了性能、安全性和扩展性需求。