# Data Model: Client Frontend Framework

**Date**: 2025-10-15
**Feature**: apps/client Frontend Framework
**Document Type**: Data Model and Entity Definitions

## Overview

本文档定义了前端应用的核心数据模型、实体关系和状态管理结构。重点关注 YJS 协作文档、React 状态管理、TanStack Router 路由和双重存储架构（结构化数据 + YJS 二进制数据）。

## Core Entities

### 1. Note (笔记) - 核心实体

```typescript
// types/note.ts
export interface Note {
  id: string // Note unique identifier (ULID)
  title: string // Note title
  notebookId: string // 所属 notebook ID

  // 结构化数据部分 (存储在 PostgreSQL)
  structuredData: {
    metadata: NoteMetadata // 元数据
    tags: string[] // 标签数组
    category?: string // 分类
    isPublic: boolean // 公开性
    isArchived: boolean // 归档状态
    version: number // 版本号
    wordCount?: number // 字数统计
    readingTime?: number // 预计阅读时间(分钟)
  }

  // YJS 协作数据部分 (二进制存储)
  collaborationData: {
    yjsState?: Uint8Array // YJS 文档状态 (二进制)
    lastSyncAt?: Date // 最后同步时间
    conflictResolved: boolean // 冲突解决状态
    isCollaborative: boolean // 是否启用协作
  }

  // 权限和协作
  permissions: NotePermissions // 访问权限
  collaboration: CollaborationInfo // 协作信息

  // 时间戳
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

export interface NoteMetadata {
  description?: string // 描述
  authorId: string // 作者ID
  contributors: string[] // 贡献者ID列表
  language: string // 语言代码
  contentType: ContentType // 内容类型
  priority: NotePriority // 优先级
}

export enum ContentType {
  MARKDOWN = 'markdown', // Markdown 内容
  RICH_TEXT = 'rich_text', // 富文本内容
  CODE = 'code', // 代码内容
  PLAIN_TEXT = 'plain_text', // 纯文本内容
}

export enum NotePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}
```

### 2. Notebook (笔记本)

```typescript
// types/notebook.ts
export interface Notebook {
  id: string // Notebook unique identifier (ULID)
  title: string // Notebook title
  description?: string // 描述
  ownerId: string // 所有者ID
  visibility: NotebookVisibility // 可见性
  color: string // 主题色
  icon?: string // 图标

  // 统计信息
  stats: {
    noteCount: number // 笔记数量
    collaboratorCount: number // 协作者数量
    lastActivityAt: Date // 最后活动时间
    totalWords: number // 总字数
  }

  // 权限设置
  defaultPermissions: NotebookPermissions // 默认权限

  // 时间戳
  createdAt: Date
  updatedAt: Date
}

export enum NotebookVisibility {
  PRIVATE = 'private', // 私有
  SHARED = 'shared', // 共享
  PUBLIC = 'public', // 公开
}

export interface NotebookPermissions {
  canView: boolean // 查看权限
  canEdit: boolean // 编辑权限
  canComment: boolean // 评论权限
  canShare: boolean // 分享权限
  canManage: boolean // 管理权限
}
```

### 3. User Presence (用户状态)

```typescript
// types/presence.ts
export interface UserPresence {
  userId: string // 用户唯一标识
  userName: string // 显示名称
  userAvatar?: string // 头像URL
  userColor: string // 用户颜色(用于UI标识)
  status: UserStatus // 在线状态
  cursor?: CursorPosition // 当前光标位置
  selection?: TextSelection // 当前文本选择
  lastActivity: Date // 最后活动时间
  isTyping: boolean // 正在输入指示器
  currentNoteId?: string // 当前查看的笔记ID
}

export enum UserStatus {
  ONLINE = 'online',
  AWAY = 'away',
  OFFLINE = 'offline',
  BUSY = 'busy',
}

export interface CursorPosition {
  noteId: string // 笔记ID
  anchor: number // 选择起始位置
  head: number // 选择结束位置
  line: number // 行号
  column: number // 列号
}

export interface TextSelection {
  noteId: string // 笔记ID
  start: number // 选择开始位置
  end: number // 选择结束位置
  text: string // 选中文本内容
  context?: string // 上下文信息
}
```

### 4. TanStack Router 集成

```typescript
// types/router.ts
import { createRoute, type RouteConfig } from '@tanstack/react-router'

export interface AppRouter {
  // 路由定义
  routes: RouteConfig[]

  // 路由状态
  currentLocation: string // 当前路由位置
  params: Record<string, string> // 路由参数
  search: Record<string, string> // 搜索参数
  isLoading: boolean // 导航加载状态
  error?: Error // 路由错误

  // 导航历史
  history: string[] // 导航历史
  forwardHistory: string[] // 前进历史
}

// 路由定义
export const routeDefinitions = [
  // 根路径 - 仪表板
  createRoute({
    path: '/',
    component: 'Dashboard',
    loader: 'dashboardLoader',
  }),

  // 笔记本列表
  createRoute({
    path: '/notebooks',
    component: 'NotebooksList',
    loader: 'notebooksLoader',
  }),

  // 特定笔记本
  createRoute({
    path: '/notebooks/$notebookId',
    component: 'NotebookView',
    loader: 'notebookLoader',
    params: {
      notebookId: string,
    },
  }),

  // 笔记编辑器
  createRoute({
    path: '/notebooks/$notebookId/notes/$noteId',
    component: 'NoteEditor',
    loader: 'noteLoader',
    action: 'noteAction',
    params: {
      notebookId: string,
      noteId: string,
    },
  }),

  // 协作页面
  createRoute({
    path: '/collaborate/$noteId',
    component: 'CollaborativeEditor',
    loader: 'collaborationLoader',
    params: {
      noteId: string,
    },
  }),

  // 设置页面
  createRoute({
    path: '/settings',
    component: 'Settings',
    loader: 'settingsLoader',
  }),
] as const

// 路由元数据
export interface RouteMeta {
  title: string // 页面标题
  description?: string // 页面描述
  requiresAuth?: boolean // 是否需要认证
  layout?: 'default' | 'minimal' // 布局类型
  breadcrumbs?: BreadcrumbItem[] // 面包屑导航
}

export interface BreadcrumbItem {
  label: string // 标签
  path: string // 路径
  active: boolean // 是否激活
}
```

### 5. YJS 文档结构

```typescript
// types/yjs.ts
import * as Y from 'yjs'

export interface YjsDocumentStructure {
  // 文档基本信息
  title: Y.Text // 文档标题
  content: Y.Text // 主要内容
  metadata: Y.Map<any> // 元数据映射

  // 协作功能
  comments: Y.Array<Comment> // 评论数组
  suggestions: Y.Array<Suggestion> // 建议数组
  version: Y.Number // 版本号

  // 时间戳
  createdAt: Y.Number // 创建时间
  updatedAt: Y.Number // 更新时间

  // 扩展数据
  extensions: Y.Map<any> // 扩展字段
}

export interface Comment {
  id: string // 评论唯一标识
  userId: string // 评论作者
  content: string // 评论内容
  position: number // 在文档中的位置
  range?: {
    start: number
    end: number
  } // 评论范围
  replies: Comment[] // 回复评论
  resolved: boolean // 是否已解决
  resolvedBy?: string // 解决者
  resolvedAt?: Date // 解决时间
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

export interface Suggestion {
  id: string // 建议唯一标识
  userId: string // 建议者
  type: SuggestionType // 建议类型
  originalText: string // 原始文本
  suggestedText: string // 建议文本
  position: number // 建议位置
  status: SuggestionStatus // 建议状态
  createdAt: Date // 创建时间
}

export enum SuggestionType {
  INSERTION = 'insertion',
  DELETION = 'deletion',
  REPLACEMENT = 'replacement',
  FORMATTING = 'formatting',
}

export enum SuggestionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  DISMISSED = 'dismissed',
}

// YJS Provider 配置
export interface YjsProviderConfig {
  documentId: string // 文档标识
  websocketUrl: string // WebSocket服务器URL
  token?: string // 认证令牌
  enableOfflineSupport: boolean // 离线支持
  persistenceProvider?: 'indexeddb' | 'memory' // 持久化提供者
  syncInterval?: number // 同步间隔(毫秒)
  maxRetries?: number // 最大重试次数
}
```

### 6. Application State (应用状态)

```typescript
// types/app.ts
export interface ApplicationState {
  // 认证状态
  auth: AuthState

  // 笔记管理
  notebooks: NotebooksState
  notes: NotesState

  // 协作状态
  collaboration: CollaborationState

  // 路由状态
  router: RouterState

  // UI状态
  ui: UIState

  // 设置状态
  settings: SettingsState
}

export interface AuthState {
  isAuthenticated: boolean // 认证状态
  user: User | null // 当前用户
  token: string | null // 认证令牌
  isLoading: boolean // 加载状态
  error: string | null // 错误状态
  lastActivity: Date // 最后活动时间
}

export interface User {
  id: string // 用户唯一标识
  email: string // 邮箱地址
  name: string // 显示名称
  avatar?: string // 头像URL
  preferences: UserPreferences // 用户偏好设置
  profile: UserProfile // 用户档案
  createdAt: Date // 注册时间
  lastLoginAt: Date // 最后登录时间
}

export interface UserPreferences {
  theme: ThemeType // 主题偏好
  language: string // 语言偏好
  fontSize: FontSize // 字体大小
  autoSave: boolean // 自动保存
  notifications: NotificationSettings // 通知设置
  editor: EditorPreferences // 编辑器偏好
  collaboration: CollaborationPreferences // 协作偏好
}

export interface UserProfile {
  bio?: string // 个人简介
  location?: string // 位置
  website?: string // 个人网站
  socialLinks?: SocialLink[] // 社交链接
  expertise?: string[] // 专业领域
}
```

### 7. Notes Management (笔记管理)

```typescript
// types/notes.ts
export interface NotesState {
  // 笔记列表
  notes: Note[] // 所有笔记
  currentNote: Note | null // 当前笔记
  recentNotes: Note[] // 最近访问的笔记
  favoriteNotes: Note[] // 收藏的笔记

  // 搜索和过滤
  searchResults: Note[] // 搜索结果
  filters: NoteFilters // 过滤条件
  sortBy: NoteSortOption // 排序选项

  // 状态管理
  isLoading: boolean // 加载状态
  isSaving: boolean // 保存状态
  error: string | null // 错误状态

  // 分页
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export interface NoteFilters {
  notebookId?: string // 笔记本过滤
  tags?: string[] // 标签过滤
  contentType?: ContentType // 内容类型过滤
  dateRange?: {
    start: Date
    end: Date
  } // 日期范围过滤
  authorId?: string // 作者过滤
  isArchived?: boolean // 归档状态过滤
}

export enum NoteSortOption {
  UPDATED_AT_DESC = 'updatedAt_desc',
  UPDATED_AT_ASC = 'updatedAt_asc',
  CREATED_AT_DESC = 'createdAt_desc',
  CREATED_AT_ASC = 'createdAt_asc',
  TITLE_ASC = 'title_asc',
  TITLE_DESC = 'title_desc',
  WORD_COUNT_DESC = 'wordCount_desc',
  WORD_COUNT_ASC = 'wordCount_asc',
}
```

### 8. Collaboration State (协作状态)

```typescript
// types/collaboration.ts
export interface CollaborationState {
  // 连接状态
  isConnected: boolean // 连接状态
  isSynced: boolean // 同步状态
  connectionQuality: ConnectionQuality // 连接质量

  // 用户状态
  onlineUsers: UserPresence[] // 在线用户
  typingUsers: UserPresence[] // 正在输入的用户

  // 文档状态
  activeDocuments: Map<string, YjsDocumentState> // 活跃文档
  conflicts: ConflictInfo[] // 冲突信息
  suggestions: Suggestion[] // 建议列表

  // 离线支持
  offlineQueue: OfflineOperation[] // 离线操作队列
  lastSyncAt?: Date // 最后同步时间
}

export interface YjsDocumentState {
  documentId: string // 文档ID
  doc: Y.Doc // YJS文档实例
  provider: any // YJS Provider实例
  isConnected: boolean // 连接状态
  lastSyncVersion: number // 最后同步版本
  pendingUpdates: number // 待更新数量
}

export enum ConnectionQuality {
  EXCELLENT = 'excellent', // 优秀 (< 50ms)
  GOOD = 'good', // 良好 (50-100ms)
  FAIR = 'fair', // 一般 (100-200ms)
  POOR = 'poor', // 较差 (> 200ms)
}

export interface ConflictInfo {
  id: string // 冲突唯一标识
  documentId: string // 冲突文档ID
  type: ConflictType // 冲突类型
  description: string // 冲突描述
  ourVersion: number // 我们的版本
  theirVersion: number // 对方版本
  resolved: boolean // 解决状态
  resolvedAt?: Date // 解决时间
  resolvedBy?: string // 解决者
}

export enum ConflictType {
  CONCURRENT_EDIT = 'concurrent_edit', // 并发编辑
  SYNC_FAILURE = 'sync_failure', // 同步失败
  VERSION_MISMATCH = 'version_mismatch', // 版本不匹配
  OFFLINE_CONFLICT = 'offline_conflict', // 离线冲突
}

export interface OfflineOperation {
  id: string // 操作唯一标识
  documentId: string // 文档ID
  type: OfflineOperationType // 操作类型
  data: any // 操作数据
  timestamp: Date // 时间戳
  retryCount: number // 重试次数
}

export enum OfflineOperationType {
  INSERT_TEXT = 'insert_text',
  DELETE_TEXT = 'delete_text',
  FORMAT_TEXT = 'format_text',
  ADD_COMMENT = 'add_comment',
  RESOLVE_COMMENT = 'resolve_comment',
}
```

### 9. UI State (界面状态)

```typescript
// types/ui.ts
export interface UIState {
  // 布局状态
  layout: LayoutState

  // 模态框状态
  modals: ModalState

  // 通知状态
  notifications: NotificationState

  // 编辑器状态
  editor: EditorState

  // 主题状态
  theme: ThemeState
}

export interface LayoutState {
  sidebarOpen: boolean // 侧边栏开启状态
  sidebarWidth: number // 侧边栏宽度
  rightPanelOpen: boolean // 右侧面板开启状态
  rightPanelWidth: number // 右侧面板宽度
  rightPanelTab: RightPanelTab // 右侧面板当前标签

  // 响应式布局
  isMobile: boolean // 移动设备
  isTablet: boolean // 平板设备
  isDesktop: boolean // 桌面设备

  // 全屏状态
  isFullscreen: boolean // 全屏模式

  // 窗口尺寸
  windowSize: {
    width: number
    height: number
  }
}

export enum RightPanelTab {
  OUTLINE = 'outline',
  COMMENTS = 'comments',
  SUGGESTIONS = 'suggestions',
  COLLABORATORS = 'collaborators',
  HISTORY = 'history',
}

export interface ModalState {
  createNote: boolean // 创建笔记模态框
  shareNote: boolean // 分享笔记模态框
  createNotebook: boolean // 创建笔记本模态框
  inviteCollaborator: boolean // 邀请协作者模态框
  settings: boolean // 设置模态框
  userProfile: boolean // 用户档案模态框
  help: boolean // 帮助模态框
  confirmDialog?: {
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
  }
}

export interface NotificationState {
  items: Notification[] // 通知列表
  unreadCount: number // 未读数量
  isVisible: boolean // 通知面板可见性
  filters: NotificationFilter[] // 通知过滤器
}

export interface Notification {
  id: string // 通知唯一标识
  type: NotificationType // 通知类型
  title: string // 通知标题
  message: string // 通知消息
  timestamp: Date // 通知时间
  read: boolean // 已读状态
  actionable: boolean // 可操作状态
  action?: {
    label: string
    onClick: () => void
  }
  metadata?: Record<string, any> // 元数据
}
```

## State Management Architecture

### 1. Store Structure with Zustand

```typescript
// stores/index.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// 主Store结构
export interface AppStore extends ApplicationState {
  // Actions
  // Auth actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>

  // Notebook actions
  createNotebook: (data: CreateNotebookData) => Promise<void>
  updateNotebook: (id: string, data: UpdateNotebookData) => Promise<void>
  deleteNotebook: (id: string) => Promise<void>

  // Note actions
  createNote: (data: CreateNoteData) => Promise<void>
  updateNote: (id: string, data: UpdateNoteData) => Promise<void>
  deleteNote: (id: string) => Promise<void>

  // Collaboration actions
  connectToDocument: (documentId: string) => Promise<void>
  disconnectFromDocument: (documentId: string) => Promise<void>
  sendOperation: (documentId: string, operation: any) => void

  // UI actions
  setLayout: (layout: Partial<LayoutState>) => void
  openModal: (modal: keyof ModalState) => void
  closeModal: (modal: keyof ModalState) => void
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => void
}

// Store创建
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
          error: null,
          lastActivity: new Date(),
        },
        notebooks: {
          notebooks: [],
          currentNotebook: null,
          isLoading: false,
          error: null,
        },
        notes: {
          notes: [],
          currentNote: null,
          recentNotes: [],
          favoriteNotes: [],
          searchResults: [],
          filters: {},
          sortBy: NoteSortOption.UPDATED_AT_DESC,
          isLoading: false,
          isSaving: false,
          error: null,
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            hasMore: false,
          },
        },
        collaboration: {
          isConnected: false,
          isSynced: false,
          connectionQuality: ConnectionQuality.GOOD,
          onlineUsers: [],
          typingUsers: [],
          activeDocuments: new Map(),
          conflicts: [],
          suggestions: [],
          offlineQueue: [],
          lastSyncAt: undefined,
        },
        router: {
          currentLocation: '/',
          params: {},
          search: {},
          isLoading: false,
          error: undefined,
          history: [],
          forwardHistory: [],
        },
        ui: {
          layout: {
            sidebarOpen: true,
            sidebarWidth: 280,
            rightPanelOpen: false,
            rightPanelWidth: 320,
            rightPanelTab: RightPanelTab.OUTLINE,
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            isFullscreen: false,
            windowSize: { width: 1920, height: 1080 },
          },
          modals: {
            createNote: false,
            shareNote: false,
            createNotebook: false,
            inviteCollaborator: false,
            settings: false,
            userProfile: false,
            help: false,
          },
          notifications: {
            items: [],
            unreadCount: 0,
            isVisible: false,
            filters: [],
          },
          editor: {
            mode: EditorMode.RICH_TEXT,
            fontSize: 16,
            lineHeight: 1.6,
            wordWrap: true,
            showLineNumbers: false,
            showMinimap: false,
            theme: 'vs-dark',
            shortcuts: [],
          },
          theme: {
            current: ThemeType.SYSTEM,
            system: ThemeType.LIGHT,
            custom: {},
          },
        },
        settings: {
          general: {
            language: 'zh-CN',
            theme: ThemeType.SYSTEM,
            autoSave: true,
            autoSaveInterval: 30,
            showTutorial: true,
          },
          editor: {
            defaultMode: EditorMode.RICH_TEXT,
            fontSize: 16,
            fontFamily: 'Inter',
            lineHeight: 1.6,
            tabSize: 2,
            wordWrap: true,
            showLineNumbers: false,
            autoComplete: true,
            spellCheck: true,
          },
          collaboration: {
            showUserCursors: true,
            showUserSelections: true,
            enableNotifications: true,
            conflictResolution: ConflictResolutionMode.MANUAL,
            syncInterval: 5,
            offlineMode: true,
          },
          privacy: {
            shareAnalytics: false,
            shareCrashReports: true,
            enableTelemetry: false,
            dataRetentionDays: 365,
            publicProfile: false,
          },
          advanced: {
            debugMode: false,
            experimentalFeatures: false,
            developerTools: false,
            logLevel: LogLevel.INFO,
            cacheSize: 100,
            networkTimeout: 30,
          },
        },

        // Actions implementation
        login: async (credentials) => {
          set({ auth: { ...get().auth, isLoading: true, error: null } })
          try {
            // Login implementation
          } catch (error) {
            set({
              auth: { ...get().auth, isLoading: false, error: error.message },
            })
          }
        },

        // ... other actions
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          auth: state.auth,
          settings: state.settings,
          ui: { theme: state.ui.theme },
        }),
      }
    ),
    { name: 'app-store' }
  )
)
```

### 2. YJS Store Integration

```typescript
// stores/yjs.ts
import { create } from 'zustand'
import { doc, connect } from 'yjs'
import { WebsocketProvider } from 'y-websocket'

interface YjsStore {
  // Document management
  documents: Map<string, Y.Doc>
  providers: Map<string, WebsocketProvider>

  // Connection state
  isConnected: boolean
  isSynced: boolean

  // Actions
  createDocument: (id: string) => Y.Doc
  connectDocument: (id: string, config: YjsProviderConfig) => void
  disconnectDocument: (id: string) => void
  syncDocument: (id: string) => Promise<void>

  // Getters
  getDocument: (id: string) => Y.Doc | undefined
  getProvider: (id: string) => WebsocketProvider | undefined
}

export const useYjsStore = create<YjsStore>((set, get) => ({
  documents: new Map(),
  providers: new Map(),
  isConnected: false,
  isSynced: false,

  createDocument: (id: string) => {
    const newDoc = doc()
    const documents = new Map(get().documents)
    documents.set(id, newDoc)
    set({ documents })
    return newDoc
  },

  connectDocument: (id: string, config) => {
    const existingDoc = get().documents.get(id)
    if (!existingDoc) return

    const provider = new WebsocketProvider(
      config.websocketUrl,
      config.documentId,
      existingDoc,
      {
        token: config.token,
        connect: true,
      }
    )

    provider.on('status', (event: any) => {
      set({
        isConnected: event.status === 'connected',
        isSynced: event.status === 'connected',
      })
    })

    provider.on('sync', (synced: boolean) => {
      set({ isSynced: synced })
    })

    const providers = new Map(get().providers)
    providers.set(id, provider)
    set({ providers })
  },

  disconnectDocument: (id: string) => {
    const provider = get().providers.get(id)
    if (provider) {
      provider.destroy()
      const providers = new Map(get().providers)
      providers.delete(id)
      set({ providers })
    }
  },

  syncDocument: async (id: string) => {
    const provider = get().providers.get(id)
    if (provider) {
      return new Promise((resolve) => {
        provider.on('sync', (synced: boolean) => {
          if (synced) resolve(void 0)
        })
      })
    }
  },

  getDocument: (id: string) => get().documents.get(id),
  getProvider: (id: string) => get().providers.get(id),
}))
```

## Data Validation Schemas

### 1. Zod Validation

```typescript
// schemas/validation.ts
import { z } from 'zod'

// Note验证
export const NoteSchema = z.object({
  id: z.string().ulid(),
  title: z.string().min(1).max(255),
  notebookId: z.string().ulid(),
  structuredData: z.object({
    metadata: z.object({
      description: z.string().max(500).optional(),
      authorId: z.string().ulid(),
      contributors: z.array(z.string().ulid()),
      language: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/),
      contentType: z.nativeEnum(ContentType),
      priority: z.nativeEnum(NotePriority),
    }),
    tags: z.array(z.string().max(50)).max(10),
    category: z.string().max(50).optional(),
    isPublic: z.boolean(),
    isArchived: z.boolean(),
    version: z.number().int().min(1),
    wordCount: z.number().int().min(0).optional(),
    readingTime: z.number().int().min(0).optional(),
  }),
  collaborationData: z.object({
    yjsState: z.instanceof(Uint8Array).optional(),
    lastSyncAt: z.date().optional(),
    conflictResolved: z.boolean(),
    isCollaborative: z.boolean(),
  }),
  permissions: z.object({
    canView: z.boolean(),
    canEdit: z.boolean(),
    canComment: z.boolean(),
    canShare: z.boolean(),
    canDelete: z.boolean(),
  }),
  collaboration: z.object({
    isActive: z.boolean(),
    collaboratorCount: z.number().int().min(0),
    lastSyncAt: z.date(),
    conflicts: z.array(
      z.object({
        id: z.string(),
        type: z.nativeEnum(ConflictType),
        resolved: z.boolean(),
      })
    ),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// UserPresence验证
export const UserPresenceSchema = z.object({
  userId: z.string().ulid(),
  userName: z.string().min(1).max(50),
  userAvatar: z.string().url().optional(),
  userColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  status: z.nativeEnum(UserStatus),
  cursor: z
    .object({
      noteId: z.string().ulid(),
      anchor: z.number().int().min(0),
      head: z.number().int().min(0),
      line: z.number().int().min(0),
      column: z.number().int().min(0),
    })
    .optional(),
  selection: z
    .object({
      noteId: z.string().ulid(),
      start: z.number().int().min(0),
      end: z.number().int().min(0),
      text: z.string().max(1000),
      context: z.string().max(200).optional(),
    })
    .optional(),
  lastActivity: z.date(),
  isTyping: z.boolean(),
  currentNoteId: z.string().ulid().optional(),
})

// 用户偏好设置验证
export const UserPreferencesSchema = z.object({
  theme: z.nativeEnum(ThemeType),
  language: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/),
  fontSize: z.nativeEnum(FontSize),
  autoSave: z.boolean(),
  notifications: z.object({
    desktop: z.boolean(),
    email: z.boolean(),
    collaboration: z.boolean(),
    system: z.boolean(),
  }),
  editor: z.object({
    mode: z.nativeEnum(EditorMode),
    wordWrap: z.boolean(),
    showLineNumbers: z.boolean(),
    autoComplete: z.boolean(),
    spellCheck: z.boolean(),
  }),
  collaboration: z.object({
    showUserCursors: z.boolean(),
    showUserSelections: z.boolean(),
    enableNotifications: z.boolean(),
    conflictResolution: z.nativeEnum(ConflictResolutionMode),
    syncInterval: z.number().int().min(1).max(300),
    offlineMode: z.boolean(),
  }),
})
```

## Migration and Versioning

### 1. Data Migration Strategy

```typescript
// types/migration.ts
export interface DataVersion {
  major: number
  minor: number
  patch: number
  migrationDate: Date
  description: string
}

export interface Migration {
  version: DataVersion
  description: string
  up: (data: any) => Promise<any>
  down: (data: any) => Promise<any>
  breaking: boolean
}

export const DATA_VERSIONS: DataVersion[] = [
  {
    major: 1,
    minor: 0,
    patch: 0,
    migrationDate: new Date('2025-10-15'),
    description: 'Initial data model with dual storage support',
  },
]

export const MIGRATIONS: Migration[] = [
  {
    version: DATA_VERSIONS[0],
    description: 'Initialize data model with structured and collaboration data',
    up: async (data) => {
      // Migration implementation
      return data
    },
    down: async (data) => {
      // Rollback implementation
      return data
    },
    breaking: false,
  },
]
```

## Performance Considerations

### 1. Memory Management

```typescript
// types/performance.ts
export interface PerformanceMetrics {
  // Document metrics
  loadedDocuments: number // 已加载文档数
  activeCollaborations: number // 活跃协作文档数
  memoryUsage: number // 内存使用量(MB)

  // Sync metrics
  syncLatency: number // 同步延迟(ms)
  syncSuccessRate: number // 同步成功率(%)
  conflictRate: number // 冲突率(%)

  // UI metrics
  renderTime: number // 渲染时间(ms)
  interactionLatency: number // 交互延迟(ms)

  // Cache metrics
  cacheHitRate: number // 缓存命中率(%)
  cacheSize: number // 缓存大小(MB)
}

export interface PerformanceConfig {
  // Memory limits
  maxLoadedDocuments: number // 最大加载文档数
  maxMemoryUsage: number // 最大内存使用量(MB)

  // Sync settings
  syncInterval: number // 同步间隔(秒)
  maxRetries: number // 最大重试次数
  timeoutMs: number // 超时时间(毫秒)

  // Cache settings
  cacheSize: number // 缓存大小(MB)
  ttl: number // 生存时间(秒)
  cleanupInterval: number // 清理间隔(秒)
}
```

## Conclusion

本数据模型为前端应用提供了完整的类型定义和状态管理架构，重点关注：

1. **双重存储架构**: 支持结构化数据存储和 YJS 二进制协作数据
2. **类型安全**: 完整的 TypeScript 类型定义和 Zod 验证
3. **路由管理**: 基于 TanStack Router 的类型安全路由
4. **状态管理**: 使用 Zustand 的可预测状态管理
5. **协作支持**: 完整的 YJS 集成和协作功能
6. **性能优化**: 内存管理和缓存策略
7. **可扩展性**: 版本控制和迁移支持

该模型与后端设计保持一致，同时为前端应用提供了坚实的基础。
