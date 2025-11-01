# Noteum任务流程机制设计

## 概述

本文档描述了Noteum项目的核心任务流程机制，包括笔记提交、AI处理、数据同步和多设备协作的完整设计。

## 设计原则

1. **离线优先**: 所有操作优先保存到本地，确保数据不丢失
2. **异步处理**: AI处理采用异步任务队列，避免阻塞用户操作
3. **实时通知**: 使用Socket.io进行处理结果和状态变更的实时通知
4. **多设备同步**: 支持个人多设备间的数据同步和状态一致
5. **容错性**: 网络异常时保证用户体验，恢复后自动同步

## 核心流程架构

### 整体数据流程图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   用户操作      │    │   前端处理      │    │   后端处理      │
│                 │    │                 │    │                 │
│ 创建/修改笔记   │───▶│ 1. 本地存储     │───▶│ 4. 任务队列     │
│ 提交处理请求    │    │ 2. API提交      │    │ 5. AI处理       │
│ 查看处理结果    │    │ 3. Socket监听   │    │ 6. 数据库存储   │
│                 │    │                 │    │ 7. Socket广播   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │   本地存储      │              │
         │              │                 │              │
         │              │ IndexedDB       │◀─────────────┘
         │              │ 离线数据管理     │
         │              │ 状态同步         │
         │              └─────────────────┘
         │
         ▼
┌─────────────────┐
│   用户界面      │
│                 │
│ 编辑器         │
│ 状态提示        │
│ 通知显示        │
│ 确认对话框      │
└─────────────────┘
```

## 详细流程设计

### 阶段1: 用户操作与本地处理

#### 1.1 用户操作类型

```typescript
// 支持的操作类型
enum OperationType {
  CREATE_NOTE = 'CREATE_NOTE', // 创建新笔记
  UPDATE_NOTE = 'UPDATE_NOTE', // 更新现有笔记
  SUBMIT_AI_PROCESSING = 'SUBMIT_AI_PROCESSING', // 提交AI处理
  SYNC_PENDING = 'SYNC_PENDING', // 同步待处理数据
}

interface UserOperation {
  type: OperationType
  noteId?: string
  data: any
  timestamp: Date
  userId: string
}
```

#### 1.2 本地数据存储策略

```typescript
// IndexedDB数据结构
interface LocalNoteData {
  id: string // 本地唯一ID
  noteId?: string // 服务器端笔记ID(如果已同步)
  title: string
  content: string
  metadata: NoteMetadata
  syncStatus: SyncStatus // 同步状态
  lastModified: Date
  version: number // 本地版本号
  operationType: OperationType // 操作类型
}

enum SyncStatus {
  LOCAL_ONLY = 'LOCAL_ONLY', // 仅本地存在
  SYNCING = 'SYNCING', // 正在同步中
  SYNCED = 'SYNCED', // 已同步到服务器
  CONFLICT = 'CONFLICT', // 存在冲突
  PENDING_AI_PROCESSING = 'PENDING_AI_PROCESSING', // 待AI处理
}
```

#### 1.3 本地操作处理流程

```typescript
class LocalOperationHandler {
  // 处理用户操作
  async handleOperation(operation: UserOperation): Promise<string> {
    try {
      // 1. 生成本地ID和时间戳
      const localId = this.generateLocalId()
      const timestamp = new Date()

      // 2. 保存到IndexedDB
      const localData: LocalNoteData = {
        id: localId,
        noteId: operation.noteId,
        ...operation.data,
        syncStatus: SyncStatus.LOCAL_ONLY,
        lastModified: timestamp,
        version: 1,
        operationType: operation.type,
      }

      await this.saveToIndexedDB(localData)

      // 3. 立即尝试同步到服务器(如果在线)
      if (navigator.onLine) {
        await this.syncToServer(localData)
      }

      return localId
    } catch (error) {
      console.error('本地操作处理失败:', error)
      throw error
    }
  }

  // 保存到IndexedDB
  private async saveToIndexedDB(data: LocalNoteData): Promise<void> {
    const db = await this.getIndexedDB()
    const transaction = db.transaction(['notes'], 'readwrite')
    const store = transaction.objectStore('notes')
    await store.put(data)
  }
}
```

### 阶段2: 服务器端提交与任务队列

#### 2.1 API端点设计

```typescript
// RESTful API端点
@Controller('/api/v1/notes')
export class NotesController {
  // 创建或更新笔记
  @Post()
  async createOrUpdateNote(
    @Body() noteData: CreateNoteDto,
    @Req() req: any,
    @Headers('x-sync-id') syncId?: string
  ) {
    const userId = req.user.id

    try {
      // 1. 验证和预处理数据
      const validatedData = await this.validateNoteData(noteData)

      // 2. 创建任务记录
      const task = await this.taskService.createTask({
        type: TaskType.NOTE_PROCESSING,
        userId,
        data: {
          ...validatedData,
          syncId,
          clientTimestamp: noteData.lastModified,
        },
        priority: this.calculatePriority(noteData),
      })

      // 3. 异步处理任务
      await this.taskQueue.enqueue(task)

      return {
        success: true,
        taskId: task.id,
        estimatedProcessingTime: this.estimateProcessingTime(noteData),
      }
    } catch (error) {
      throw new BadRequestException(`笔记提交失败: ${error.message}`)
    }
  }

  // 同步本地变更
  @Post('/sync')
  async syncLocalChanges(@Body() syncData: SyncDataDto, @Req() req: any) {
    const userId = req.user.id
    return await this.syncService.processSyncRequest(userId, syncData)
  }
}
```

#### 2.2 任务队列设计

```typescript
// 任务类型定义
enum TaskType {
  NOTE_PROCESSING = 'NOTE_PROCESSING',
  AI_CONTENT_PROCESSING = 'AI_CONTENT_PROCESSING',
  SYNC_CONFLICT_RESOLUTION = 'SYNC_CONFLICT_RESOLUTION',
  BATCH_SYNC = 'BATCH_SYNC',
}

interface Task {
  id: string
  type: TaskType
  userId: string
  data: any
  priority: TaskPriority
  status: TaskStatus
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  retryCount: number
  maxRetries: number
}

enum TaskPriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  URGENT = 4,
}

enum TaskStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}
```

#### 2.3 任务处理器实现

```typescript
@Injectable()
export class NoteProcessingProcessor {
  constructor(
    private readonly aiService: AiService,
    private readonly notesService: NotesService,
    private readonly notificationService: NotificationService,
    private readonly syncService: SyncService,
    private readonly redisService: RedisService
  ) {}

  async processNote(taskData: Task): Promise<void> {
    const { data, userId, id: taskId } = taskData

    try {
      // 1. 更新任务状态为处理中
      await this.updateTaskStatus(taskId, TaskStatus.PROCESSING)
      await this.notificationService.notifyTaskUpdate(userId, {
        taskId,
        status: TaskStatus.PROCESSING,
      })

      // 2. 保存原始笔记到数据库
      const savedNote = await this.notesService.createOrUpdateNote({
        ...data,
        userId,
        status: 'PENDING_AI_PROCESSING',
      })

      // 3. 提交AI处理
      const aiTaskId = await this.submitForAiProcessing(savedNote, userId)

      // 4. 更新任务状态为等待AI处理
      await this.updateTaskStatus(taskId, TaskStatus.PENDING_AI)
    } catch (error) {
      await this.handleTaskError(taskId, error, userId)
    }
  }

  // Redis Streams 消费者
  async startConsumer(): Promise<void> {
    const consumerGroup = 'note-processors'
    const consumerId = `processor-${Date.now()}`

    while (true) {
      try {
        const results = await this.redisService.xreadgroup(
          'GROUP', consumerGroup, consumerId,
          'COUNT', 1,
          'BLOCK', 1000,
          'STREAMS', 'task-queue', '>'
        )

        if (results && results.length > 0) {
          const [streamName, messages] = results[0]
          for (const [messageId, fields] of messages) {
            const taskData = JSON.parse(fields.data)
            await this.processNote(taskData)
            await this.redisService.xack(streamName, consumerGroup, messageId)
          }
        }
      } catch (error) {
        console.error('任务处理错误:', error)
        await this.sleep(5000) // 错误后等待5秒
      }
    }
  }

  private async submitForAiProcessing(
    note: Note,
    userId: string
  ): Promise<string> {
    const aiTaskId = `ai-${Date.now()}-${note.id}`

    // 创建AI处理任务并添加到Redis Stream
    await this.redisService.xadd('ai-task-queue', '*',
      'taskId', aiTaskId,
      'type', TaskType.AI_CONTENT_PROCESSING,
      'userId', userId,
      'data', JSON.stringify({
        noteId: note.id,
        content: note.content,
        processingOptions: this.extractProcessingOptions(note),
      }),
      'priority', TaskPriority.NORMAL.toString(),
      'createdAt', new Date().toISOString()
    )

    return aiTaskId
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
```

### 阶段3: AI处理与结果生成

#### 3.1 LangGraph集成AI处理器

```typescript
@Injectable()
export class AiContentProcessor {
  constructor(
    private readonly langGraphService: LangGraphService,
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService
  ) {}

  // Redis Streams 消费者处理AI任务
  async startAiConsumer(): Promise<void> {
    const consumerGroup = 'ai-processors'
    const consumerId = `ai-processor-${Date.now()}`

    while (true) {
      try {
        const results = await this.redisService.xreadgroup(
          'GROUP', consumerGroup, consumerId,
          'COUNT', 1,
          'BLOCK', 1000,
          'STREAMS', 'ai-task-queue', '>'
        )

        if (results && results.length > 0) {
          const [streamName, messages] = results[0]
          for (const [messageId, fields] of messages) {
            const taskData = JSON.parse(fields.data)
            await this.processAiContent(taskData)
            await this.redisService.xack(streamName, consumerGroup, messageId)
          }
        }
      } catch (error) {
        console.error('AI处理任务错误:', error)
        await this.sleep(5000)
      }
    }
  }

  async processAiContent(taskData: any): Promise<void> {
    const { noteId, content, processingOptions, userId } = taskData

    try {
      // 1. 通知用户AI处理开始
      await this.notificationService.notifyTaskUpdate(userId, {
        taskId: `ai-${noteId}`,
        status: TaskStatus.PROCESSING,
      })

      // 2. 创建LangGraph工作流
      const workflow = await this.createAiWorkflow(processingOptions)

      // 3. 执行LangGraph处理
      const aiResult = await this.workflow.invoke({
        noteId,
        content,
        options: processingOptions,
        userId,
      })

      // 4. 根据处理结果决定后续操作
      switch (aiResult.action) {
        case AiAction.CREATE_CHILD_NOTE:
          await this.createChildNote(noteId, aiResult, userId)
          break
        case AiAction.UPDATE_ORIGINAL:
          await this.updateOriginalNote(noteId, aiResult, userId)
          break
        case AiAction.REQUEST_CONFIRMATION:
          await this.requestUserConfirmation(noteId, aiResult, userId)
          break
      }

      // 5. 通知AI处理完成
      await this.notificationService.notifyAiProcessingResult(userId, aiResult)
    } catch (error) {
      await this.handleAiProcessingError(noteId, error, userId)
    }
  }

  private async createAiWorkflow(options: ProcessingOptions): Promise<Workflow> {
    // 使用LangChain.js + LangGraph创建工作流
    const llm = new ChatOpenAI({
      modelName: options.model || 'gpt-4',
      temperature: options.temperature || 0.7,
    })

    // 创建工作流节点
    const analysisNode = async (state: WorkflowState) => {
      const prompt = `分析以下笔记内容并生成处理建议: ${state.content}`
      const analysis = await llm.invoke(prompt)
      return { ...state, analysis }
    }

    const processingNode = async (state: WorkflowState) => {
      const processingType = options.processingType || 'SUMMARIZE_AND_ANALYZE'
      let processedContent: string

      switch (processingType) {
        case 'SUMMARIZE_AND_ANALYZE':
          processedContent = await this.summarizeAndAnalyze(state.content, llm)
          break
        case 'EXTRACT_INSIGHTS':
          processedContent = await this.extractInsights(state.content, llm)
          break
        case 'GENERATE_RELATED_CONTENT':
          processedContent = await this.generateRelatedContent(state.content, llm)
          break
        default:
          processedContent = state.content
      }

      return { ...state, processedContent }
    }

    const decisionNode = async (state: WorkflowState) => {
      // 基于分析结果决定下一步操作
      const action = await this.determineNextAction(state.analysis, state.processedContent)
      return { ...state, action }
    }

    // 构建工作流图
    const workflow = new StateGraph(WorkflowState)
      .addNode('analysis', analysisNode)
      .addNode('processing', processingNode)
      .addNode('decision', decisionNode)
      .addEdge(START, 'analysis')
      .addEdge('analysis', 'processing')
      .addEdge('processing', 'decision')
      .compile()

    return workflow
  }

  private async summarizeAndAnalyze(content: string, llm: ChatOpenAI): Promise<string> {
    const prompt = `请对以下内容进行总结和分析: ${content}`
    const result = await llm.invoke(prompt)
    return result.content as string
  }

  private async extractInsights(content: string, llm: ChatOpenAI): Promise<string> {
    const prompt = `从以下内容中提取关键洞察和要点: ${content}`
    const result = await llm.invoke(prompt)
    return result.content as string
  }

  private async generateRelatedContent(content: string, llm: ChatOpenAI): Promise<string> {
    const prompt = `基于以下内容生成相关的扩展内容: ${content}`
    const result = await llm.invoke(prompt)
    return result.content as string
  }

  private async createChildNote(
    parentNoteId: string,
    aiResult: AiProcessingResult,
    userId: string
  ): Promise<Note> {
    // 获取父笔记信息
    const parentNote = await this.notesService.getNote(parentNoteId)

    // 创建子笔记
    const childNote = await this.notesService.createNote({
      title: aiResult.childTitle || `AI处理结果: ${parentNote.title}`,
      content: aiResult.processedContent,
      parentId: parentNoteId,
      userId,
      metadata: {
        aiGenerated: true,
        processingModel: aiResult.model,
        processingTime: aiResult.processingTime,
        originalNoteId: parentNoteId,
        processingType: aiResult.processingType,
      },
      tags: [...(parentNote.tags || []), 'AI处理结果'],
    })

    // 通知用户子笔记创建成功
    await this.notifyUser(userId, 'child-note-created', {
      parentNoteId,
      childNote,
      processingResult: aiResult,
    })

    return childNote
  }
}
```

#### 3.2 AI处理结果类型

```typescript
interface AiProcessingResult {
  action: AiAction
  processedContent: string
  summary?: string
  insights?: string[]
  recommendations?: string[]
  childTitle?: string
  processingTime: number
  model: string
  confidence: number
  processingType: string
  requiresConfirmation?: boolean
  confirmationMessage?: string
}

enum AiAction {
  CREATE_CHILD_NOTE = 'CREATE_CHILD_NOTE', // 创建子笔记
  UPDATE_ORIGINAL = 'UPDATE_ORIGINAL', // 更新原始笔记
  REQUEST_CONFIRMATION = 'REQUEST_CONFIRMATION', // 请求用户确认
}
```

### 阶段4: tRPC实时通知与客户端处理

#### 4.1 tRPC订阅通知机制

```typescript
// tRPC 订阅定义
export const appRouter = t.router({
  // 任务状态订阅
  onTaskUpdate: t.procedure.subscription(() => {
    return observable<TaskUpdateEvent>((emit) => {
      const onTaskUpdate = (data: TaskUpdateEvent) => {
        emit.next(data)
      }

      // 注册监听器
      taskEventEmitter.on('task-update', onTaskUpdate)

      // 清理函数
      return () => {
        taskEventEmitter.off('task-update', onTaskUpdate)
      }
    })
  }),

  // AI处理结果订阅
  onAiResult: t.procedure.subscription(() => {
    return observable<AiProcessingResult>((emit) => {
      const onAiResult = (data: AiProcessingResult) => {
        emit.next(data)
      }

      aiResultEventEmitter.on('ai-result', onAiResult)

      return () => {
        aiResultEventEmitter.off('ai-result', onAiResult)
      }
    })
  }),
})

@Injectable()
export class NotificationService {
  // 任务状态更新通知
  async notifyTaskUpdate(userId: string, taskData: any): Promise<void> {
    const event: TaskUpdateEvent = {
      userId,
      taskId: taskData.taskId,
      status: taskData.status,
      progress: this.calculateTaskProgress(taskData),
      estimatedCompletion: this.estimateCompletionTime(taskData),
    }

    // 发送到tRPC订阅
    taskEventEmitter.emit('task-update', event)
  }

  // AI处理结果通知
  async notifyAiProcessingResult(
    userId: string,
    result: AiProcessingResult
  ): Promise<void> {
    const event: AiResultEvent = {
      userId,
      result,
    }

    // 发送到tRPC订阅
    aiResultEventEmitter.emit('ai-result', event)
  }
}

interface TaskUpdateEvent {
  userId: string
  taskId: string
  status: TaskStatus
  progress: number
  estimatedCompletion: Date
}

interface AiResultEvent {
  userId: string
  result: AiProcessingResult
}
```

#### 4.2 客户端tRPC订阅处理

```typescript
// 使用Zustand状态管理
interface TaskState {
  tasks: Map<string, Task>
  aiResults: Map<string, AiProcessingResult>
  isProcessing: boolean
}

interface TaskActions {
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  addAiResult: (result: AiProcessingResult) => void
  setIsProcessing: (processing: boolean) => void
}

const useTaskStore = create<TaskState & TaskActions>((set) => ({
  tasks: new Map(),
  aiResults: new Map(),
  isProcessing: false,
  updateTaskStatus: (taskId, status) =>
    set((state) => {
      const newTasks = new Map(state.tasks)
      const task = newTasks.get(taskId)
      if (task) {
        task.status = status
        newTasks.set(taskId, task)
      }
      return { tasks: newTasks }
    }),
  addAiResult: (result) =>
    set((state) => {
      const newResults = new Map(state.aiResults)
      newResults.set(result.noteId, result)
      return { aiResults: newResults }
    }),
  setIsProcessing: (processing) => set({ isProcessing: processing }),
}))

// React组件中的tRPC订阅使用
function TaskNotificationHandler() {
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus)
  const addAiResult = useTaskStore((state) => state.addAiResult)
  const { user } = useAuth()

  // 任务状态更新订阅
  trpc.onTaskUpdate.useSubscription(undefined, {
    onData(data) {
      if (data.userId === user?.id) {
        updateTaskStatus(data.taskId, data.status)

        // 使用shadcn/ui显示通知
        if (data.status === TaskStatus.COMPLETED) {
          toast({
            title: "任务完成",
            description: `任务 ${data.taskId} 已完成处理`,
          })
        }
      }
    },
  })

  // AI处理结果订阅
  trpc.onAiResult.useSubscription(undefined, {
    onData(data) {
      if (data.userId === user?.id) {
        addAiResult(data.result)
        handleAiProcessingResult(data.result)
      }
    },
  })

  return null
}

// AI处理结果处理函数
function handleAiProcessingResult(result: AiProcessingResult) {
  switch (result.action) {
    case AiAction.CREATE_CHILD_NOTE:
      // 使用TanStack Router导航到新笔记
      router.navigate({
        to: '/notes/$noteId',
        params: { noteId: result.childNoteId }
      })

      toast({
        title: "AI处理完成",
        description: "已创建AI处理结果笔记",
      })
      break

    case AiAction.UPDATE_ORIGINAL:
      toast({
        title: "笔记已更新",
        description: "笔记已通过AI处理更新",
      })
      break

    case AiAction.REQUEST_CONFIRMATION:
      // 使用shadcn/ui的Dialog组件显示确认对话框
      showConfirmationDialog(result)
      break
  }
}

// shadcn/ui确认对话框组件
function AiResultDialog({
  result,
  open,
  onOpenChange
}: {
  result: AiProcessingResult
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { mutate: confirmResult } = trpc.confirmAiResult.useMutation()
  const { mutate: rejectResult } = trpc.rejectAiResult.useMutation()

  const handleConfirm = async () => {
    await confirmResult(result.noteId)
    onOpenChange(false)

    toast({
      title: "已应用AI处理结果",
      description: "AI的处理结果已成功应用到笔记",
    })
  }

  const handleReject = async () => {
    await rejectResult(result.noteId)
    onOpenChange(false)

    toast({
      title: "已取消AI处理结果",
      description: "AI的处理结果已被取消",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI处理结果确认</DialogTitle>
          <DialogDescription>
            {result.confirmationMessage || '是否应用AI的处理结果？'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h4 className="font-medium mb-2">处理结果预览：</h4>
          <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
            {result.processedContent}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReject}>
            拒绝
          </Button>
          <Button onClick={handleConfirm}>
            应用结果
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### 阶段5: 多设备同步机制

#### 5.1 同步策略

```typescript
// 使用Prisma进行数据库操作
@Injectable()
export class SyncService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notesService: NotesService
  ) {}

  // 登录时执行完整同步
  async performFullSync(userId: string): Promise<SyncResult> {
    try {
      // 1. 上传本地待同步数据
      const uploadResult = await this.uploadLocalChanges(userId)

      // 2. 下载服务器端更新
      const downloadResult = await this.downloadServerUpdates(userId)

      // 3. 解决冲突
      const conflictResolution = await this.resolveConflicts(
        uploadResult.conflicts,
        downloadResult.conflicts
      )

      return {
        success: true,
        uploadedNotes: uploadResult.uploadedCount,
        downloadedNotes: downloadResult.downloadedCount,
        resolvedConflicts: conflictResolution.resolvedCount,
        lastSyncTime: new Date(),
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  private async uploadLocalChanges(userId: string): Promise<UploadResult> {
    const localChanges = await this.getLocalChanges(userId)
    let uploadedCount = 0
    const conflicts: SyncConflict[] = []

    for (const change of localChanges) {
      try {
        // 使用Prisma upsert操作
        await this.prisma.note.upsert({
          where: {
            id: change.noteId,
            userId: userId
          },
          update: {
            title: change.title,
            content: change.content,
            lastModified: change.lastModified,
            version: { increment: 1 }
          },
          create: {
            id: change.noteId,
            title: change.title,
            content: change.content,
            userId: userId,
            lastModified: change.lastModified,
            version: 1
          }
        })
        uploadedCount++
      } catch (error) {
        // 处理冲突
        conflicts.push(await this.createConflictRecord(change, error))
      }
    }

    return { uploadedCount, conflicts }
  }

  // 增量同步(定期执行)
  async performIncrementalSync(userId: string): Promise<void> {
    const lastSyncTime = await this.getLastSyncTime(userId)

    // 获取本地变更
    const localChanges = await this.getLocalChangesSince(lastSyncTime)

    // 获取服务器变更
    const serverChanges = await this.getServerChangesSince(userId, lastSyncTime)

    // 合并变更
    await this.mergeChanges(localChanges, serverChanges)

    // 更新同步时间戳
    await this.updateLastSyncTime(userId, new Date())
  }

  // 处理离线期间的冲突
  private async resolveConflicts(
    localConflicts: SyncConflict[],
    serverConflicts: SyncConflict[]
  ): Promise<ConflictResolution> {
    const resolutions: ConflictResolution[] = []

    // 使用最后写入优先策略解决简单冲突
    for (const conflict of [...localConflicts, ...serverConflicts]) {
      const resolution = await this.resolveConflict(conflict)
      resolutions.push(resolution)
    }

    return {
      resolvedCount: resolutions.length,
      resolutions,
    }
  }
}
```

#### 5.2 冲突解决策略

```typescript
interface SyncConflict {
  noteId: string
  localVersion: NoteData
  serverVersion: NoteData
  conflictType: ConflictType
  timestamp: Date
}

enum ConflictType {
  CONTENT_CONFLICT = 'CONTENT_CONFLICT', // 内容冲突
  METADATA_CONFLICT = 'METADATA_CONFLICT', // 元数据冲突
  DELETED_CONFLICT = 'DELETED_CONFLICT', // 删除冲突
}

interface ConflictResolution {
  conflictId: string
  resolution: ConflictResolutionStrategy
  resolvedData?: NoteData
  requiresUserAction: boolean
}

enum ConflictResolutionStrategy {
  KEEP_LOCAL = 'KEEP_LOCAL', // 保留本地版本
  KEEP_SERVER = 'KEEP_SERVER', // 保留服务器版本
  MERGE = 'MERGE', // 智能合并
  USER_DECISION = 'USER_DECISION', // 需要用户决定
}

class ConflictResolver {
  async resolveConflict(conflict: SyncConflict): Promise<ConflictResolution> {
    switch (conflict.conflictType) {
      case ConflictType.CONTENT_CONFLICT:
        return await this.resolveContentConflict(conflict)

      case ConflictType.METADATA_CONFLICT:
        return this.resolveMetadataConflict(conflict)

      case ConflictType.DELETED_CONFLICT:
        return this.resolveDeletedConflict(conflict)

      default:
        return this.resolveByLastModified(conflict)
    }
  }

  private async resolveContentConflict(
    conflict: SyncConflict
  ): Promise<ConflictResolution> {
    // 对于内容冲突，优先使用最后修改时间
    if (
      conflict.localVersion.lastModified > conflict.serverVersion.lastModified
    ) {
      return {
        conflictId: conflict.noteId,
        resolution: ConflictResolutionStrategy.KEEP_LOCAL,
        resolvedData: conflict.localVersion,
        requiresUserAction: false,
      }
    } else {
      return {
        conflictId: conflict.noteId,
        resolution: ConflictResolutionStrategy.KEEP_SERVER,
        resolvedData: conflict.serverVersion,
        requiresUserAction: false,
      }
    }
  }

  private resolveMetadataConflict(conflict: SyncConflict): ConflictResolution {
    // 元数据冲突可以智能合并
    const mergedMetadata = {
      ...conflict.serverVersion.metadata,
      ...conflict.localVersion.metadata,
      // 特殊处理某些字段
      tags: [
        ...new Set([
          ...(conflict.serverVersion.metadata.tags || []),
          ...(conflict.localVersion.metadata.tags || []),
        ]),
      ],
    }

    return {
      conflictId: conflict.noteId,
      resolution: ConflictResolutionStrategy.MERGE,
      resolvedData: {
        ...conflict.serverVersion,
        metadata: mergedMetadata,
        lastModified: new Date(
          Math.max(
            conflict.localVersion.lastModified.getTime(),
            conflict.serverVersion.lastModified.getTime()
          )
        ),
      },
      requiresUserAction: false,
    }
  }
}
```

## 错误处理与重试机制

### 客户端错误处理

```typescript
class ErrorHandler {
  // 处理网络错误
  async handleNetworkError(
    error: NetworkError,
    operation: Operation
  ): Promise<void> {
    // 1. 标记操作为待重试
    await this.markOperationForRetry(operation)

    // 2. 设置网络状态监听
    this.setupNetworkRecoveryHandler()

    // 3. 显示用户友好的错误信息
    this.showNetworkErrorMessage(error)
  }

  // 处理服务器错误
  async handleServerError(
    error: ServerError,
    operation: Operation
  ): Promise<void> {
    switch (error.statusCode) {
      case 401:
        // 认证错误，需要重新登录
        await this.handleAuthenticationError()
        break

      case 409:
        // 冲突错误
        await this.handleConflictError(error, operation)
        break

      case 429:
        // 限流错误
        await this.handleRateLimitError(error, operation)
        break

      default:
        // 通用服务器错误
        await this.handleGenericServerError(error, operation)
    }
  }

  // 自动重试机制
  private async retryOperation(
    operation: Operation,
    maxRetries: number = 3
  ): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.executeOperation(operation)
        return true
      } catch (error) {
        if (attempt === maxRetries) {
          await this.markOperationAsFailed(operation, error)
          return false
        }

        // 指数退避重试
        const delay = Math.pow(2, attempt) * 1000
        await this.sleep(delay)
      }
    }
    return false
  }
}
```

### 服务器端错误处理

```typescript
@Injectable()
export class TaskErrorHandler {
  async handleTaskFailure(job: Job<Task>, error: Error): Promise<void> {
    const { id, retryCount, maxRetries } = job.data

    // 1. 记录错误日志
    this.logger.error(`任务 ${id} 执行失败:`, error)

    // 2. 判断是否需要重试
    if (retryCount < maxRetries && this.shouldRetry(error)) {
      await this.scheduleRetry(job, error)
    } else {
      await this.markTaskAsFailed(job, error)
    }

    // 3. 通知用户
    await this.notifyUserOfFailure(job.data.userId, job.data, error)
  }

  private shouldRetry(error: Error): boolean {
    // 网络错误、超时错误等可重试
    return (
      error instanceof NetworkError ||
      error instanceof TimeoutError ||
      error.message.includes('ECONNRESET')
    )
  }

  private async scheduleRetry(job: Job<Task>, error: Error): Promise<void> {
    const delay = this.calculateRetryDelay(job.data.retryCount)

    await this.taskQueue.enqueue({
      ...job.data,
      retryCount: job.data.retryCount + 1,
      scheduledAt: new Date(Date.now() + delay),
    })
  }

  private calculateRetryDelay(retryCount: number): number {
    // 指数退避策略
    return Math.min(Math.pow(2, retryCount) * 1000, 60000) // 最大1分钟
  }
}
```

## 性能优化策略

### 前端优化

```typescript
class PerformanceOptimizer {
  // 防抖处理用户输入
  private debouncedSave = debounce(async (noteId: string, content: string) => {
    await this.saveNoteContent(noteId, content)
  }, 500)

  // 批量同步操作
  private syncQueue: Operation[] = []
  private syncScheduled = false

  private queueSyncOperation(operation: Operation): void {
    this.syncQueue.push(operation)

    if (!this.syncScheduled) {
      this.syncScheduled = true
      requestAnimationFrame(() => {
        this.processBatchSync()
        this.syncScheduled = false
      })
    }
  }

  private async processBatchSync(): Promise<void> {
    if (this.syncQueue.length === 0) return

    const batch = this.syncQueue.splice(0) // 取出所有待同步操作

    try {
      // 批量提交
      await this.batchSubmitOperations(batch)
    } catch (error) {
      // 失败的操作重新加入队列
      this.syncQueue.unshift(...batch)
    }
  }

  // 增量同步
  async incrementalSync(noteId: string): Promise<void> {
    const localVersion = await this.getLocalVersion(noteId)
    const serverVersion = await this.getServerVersion(noteId)

    if (localVersion < serverVersion) {
      await this.downloadNoteUpdate(noteId, localVersion, serverVersion)
    } else if (localVersion > serverVersion) {
      await this.uploadNoteUpdate(noteId, serverVersion, localVersion)
    }
  }
}
```

### 后端优化

```typescript
@Injectable()
export class PerformanceOptimizer {
  // 连接池管理
  private readonly connectionPool = new Map<string, Socket>()

  // 批量处理通知
  private notificationQueue: Notification[] = []
  private notificationTimer: NodeJS.Timeout | null = null

  async queueNotification(notification: Notification): Promise<void> {
    this.notificationQueue.push(notification)

    if (!this.notificationTimer) {
      this.notificationTimer = setTimeout(() => {
        this.processBatchNotifications()
        this.notificationTimer = null
      }, 100) // 100ms批量间隔
    }
  }

  private async processBatchNotifications(): Promise<void> {
    if (this.notificationQueue.length === 0) return

    const batch = this.notificationQueue.splice(0)

    // 按用户分组
    const notificationsByUser = this.groupNotificationsByUser(batch)

    // 批量发送
    for (const [userId, notifications] of notificationsByUser) {
      await this.sendBatchNotifications(userId, notifications)
    }
  }

  // 任务优先级队列
  async prioritizeTasks(tasks: Task[]): Promise<Task[]> {
    return tasks.sort((a, b) => {
      // 按优先级和创建时间排序
      if (a.priority !== b.priority) {
        return b.priority - a.priority // 高优先级在前
      }
      return a.createdAt.getTime() - b.createdAt.getTime() // 早创建的在前
    })
  }
}
```

## 监控与调试

### 前端调试工具

```typescript
class DebugTools {
  // 开发环境下的调试接口
  setupDebugInterface(): void {
    if (import.meta.env.DEV) {
      window.noteumDebug = {
        // 查看本地存储状态
        getLocalData: () => this.getAllLocalData(),

        // 查看同步状态
        getSyncStatus: () => this.getSyncStatus(),

        // 手动触发同步
        triggerSync: () => this.triggerManualSync(),

        // 查看任务队列
        getTaskQueue: () => this.getTaskQueue(),

        // 清除本地数据
        clearLocalData: () => this.clearAllLocalData(),

        // 网络状态模拟
        simulateOffline: () => this.simulateOffline(),
        simulateOnline: () => this.simulateOnline(),
      }
    }
  }

  // 性能监控
  setupPerformanceMonitoring(): void {
    // 监控API响应时间
    this.monitorApiPerformance()

    // 监控同步性能
    this.monitorSyncPerformance()

    // 监控内存使用
    this.monitorMemoryUsage()
  }
}
```

### 后端监控

```typescript
@Injectable()
export class MonitoringService {
  // 任务处理监控
  @OnQueueActive()
  onQueueActive(job: Job) {
    this.logger.log(`任务 ${job.id} 开始处理`)
    this.metrics.increment('tasks.active')
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job, result: any) {
    this.logger.log(`任务 ${job.id} 处理完成`)
    this.metrics.increment('tasks.completed')
    this.metrics.histogram('tasks.duration', job.finishedOn - job.startedOn)
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, error: Error) {
    this.logger.error(`任务 ${job.id} 处理失败:`, error)
    this.metrics.increment('tasks.failed')
    this.metrics.increment('tasks.errors', {
      errorType: error.constructor.name,
    })
  }

  // WebSocket连接监控
  handleConnection(client: Socket) {
    this.metrics.increment('websocket.connections')
    this.logger.log(`WebSocket连接建立: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.metrics.decrement('websocket.connections')
    this.logger.log(`WebSocket连接断开: ${client.id}`)
  }
}
```

## 总结

这个任务流程机制设计提供了：

1. **完整的端到端流程**: 从用户操作到AI处理再到结果通知
2. **强大的离线支持**: IndexedDB本地存储确保数据不丢失
3. **智能的冲突解决**: 多种策略处理多设备同步冲突
4. **实时的状态通知**: Socket.io确保用户及时了解处理进度
5. **健壮的错误处理**: 自动重试和用户友好的错误提示
6. **高性能优化**: 批量处理、防抖、增量同步等优化策略
7. **完善的监控调试**: 开发和生产环境的监控工具

这个设计能够很好地支持你的两个核心使用场景，并为未来的功能扩展提供了良好的基础架构。
