# 笔记创建功能规格

## ADDED Requirements

### 1. 前端笔记创建接口

#### Requirement: 客户端笔记ID生成

**描述**: 前端应用必须能够生成基于ULID的唯一笔记标识符

**验收标准**:

- 生成的ID符合ULID标准格式
- ID具有时间排序特性
- 生成过程不依赖后端服务

#### Scenario: 创建新笔记时生成唯一ID

```typescript
// 当用户在新笔记模态框中输入内容并提交时
const noteId = generateUlid() // 生成类似 "01H8X7Z8YX9Z8Y9X8Z7Y8X9Z8Y"
const noteData = {
  id: noteId,
  title: '我的新笔记',
  notebookId: 'default',
  // ...
}
```

#### Requirement: tRPC客户端笔记创建

**描述**: 前端应用通过tRPC接口提交笔记创建请求

**验收标准**:

- 使用已配置的tRPC客户端
- 发送包含所有必要字段的笔记数据
- 处理成功和错误响应
- 提供加载状态指示

#### Scenario: 用户提交新笔记表单

```typescript
// 当用户点击"创建笔记"按钮或使用快捷键时
const createNote = async (noteData: CreateNoteRequest) => {
  try {
    setIsLoading(true)
    const result = await trpc.notes.create.mutate(noteData)
    // 处理成功响应，关闭模态框，重置表单
    handleClose()
    setTitle('')
    // 可选：显示成功提示
  } catch (error) {
    // 处理错误，显示用户友好的错误信息
    console.error('笔记创建失败:', error)
  } finally {
    setIsLoading(false)
  }
}
```

### 2. 后端笔记处理接口

#### Requirement: Redis Stream笔记存储

**描述**: 后端服务必须将笔记数据写入Redis Stream进行异步处理

**验收标准**:

- 使用指定的stream key格式
- 包含完整的笔记数据和元数据
- 正确处理连接错误和写入失败
- 返回操作结果状态

#### Scenario: 处理笔记创建请求

```typescript
// 当tRPC路由接收到笔记创建请求时
const result = await redisService.xadd(
  'notes:stream',
  '*', // 自动生成stream ID
  {
    id: noteData.id,
    title: noteData.title,
    notebookId: noteData.notebookId,
    createdBy: ctx.user.id,
    createdAt: new Date().toISOString(),
    operation: 'CREATE',
  }
)
// 返回操作成功状态
return { success: true, streamId: result, noteId: noteData.id }
```

#### Requirement: 笔记数据验证

**描述**: 后端必须验证传入的笔记数据完整性和有效性

**验收标准**:

- 验证必需字段存在
- 检查数据类型和格式
- 验证用户权限
- 提供详细的验证错误信息

#### Scenario: 验证笔记创建请求

```typescript
// 在处理笔记创建请求前进行数据验证
const validationResult = validateNoteData(input)
if (!validationResult.isValid) {
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: '笔记数据验证失败',
    details: validationResult.errors,
  })
}
```

### 3. 错误处理和用户体验

#### Requirement: 网络错误处理

**描述**: 系统必须优雅地处理网络连接问题和服务器错误

**验收标准**:

- 显示用户友好的错误消息
- 提供重试机制
- 保持数据一致性
- 不阻塞用户界面

#### Scenario: 网络连接失败时的处理

```typescript
// 当tRPC请求因网络问题失败时
const retryCreateNote = async (noteData: CreateNoteRequest, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await trpc.notes.create.mutate(noteData)
    } catch (error) {
      if (attempt === maxRetries || !isNetworkError(error)) {
        throw error
      }
      // 等待后重试
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }
}
```

#### Requirement: 用户反馈机制

**描述**: 系统必须提供清晰的用户反馈，包括操作状态和结果

**验收标准**:

- 显示创建操作的加载状态
- 成功时提供明确的确认反馈
- 失败时显示具体的错误信息
- 支持操作撤销（如果适用）

#### Scenario: 显示笔记创建状态

```typescript
// 在笔记创建过程中更新UI状态
const [isCreating, setIsCreating] = useState(false)
const [error, setError] = useState<string | null>(null)
const [success, setSuccess] = useState(false)

// UI中显示相应状态
{isCreating && <div>正在创建笔记...</div>}
{success && <div>笔记创建成功！</div>}
{error && <div className="error">创建失败: {error}</div>}
```

## MODIFIED Requirements

### 1. 新笔记模态框集成

#### Requirement: 模态框与tRPC集成

**描述**: 新笔记模态框必须集成tRPC客户端以提交笔记创建请求

**修改内容**:

- 添加tRPC客户端依赖注入
- 修改handleCreateNote函数调用tRPC接口
- 添加加载状态和错误处理
- 保持现有的键盘快捷键功能

#### Scenario: 修改后的模态框创建逻辑

```typescript
// 修改后的handleCreateNote函数
const handleCreateNote = async () => {
  if (title.trim()) {
    const noteId = generateUlid()
    const noteData = {
      id: noteId,
      title: title.trim(),
      notebookId: 'default',
    }

    try {
      await createNote(noteData)
      // 现有的重置和关闭逻辑保持不变
    } catch (error) {
      // 错误处理逻辑
    }
  }
}
```

## REMOVED Requirements

无

## 依赖关系

### 外部依赖

- **@trpc/client**: tRPC客户端库
- **@trpc/server**: tRPC服务器库
- **ulid**: ULID生成库（前端）
- **ioredis**: Redis客户端（需要stream支持）

### 内部依赖

- **apps/services/src/common/utils/ulid.util.ts**: ULID工具类参考
- **apps/services/src/modules/cache/cache.service.ts**: Redis服务基础
- **apps/client/src/types/note.ts**: 笔记类型定义
- **apps/client/src/components/modals/new-note-modal.tsx**: 新笔记模态框

## 验收标准

1. **功能完整性**: 用户能够通过模态框成功创建笔记
2. **数据一致性**: 笔记数据正确写入Redis Stream
3. **用户体验**: 提供清晰的操作反馈和错误处理
4. **性能要求**: 创建操作响应时间 < 500ms
5. **可靠性**: 网络问题时有适当的重试机制
