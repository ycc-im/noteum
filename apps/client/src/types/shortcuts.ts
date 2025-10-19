// 快捷键相关类型定义

export type Modifier = 'ctrl' | 'alt' | 'shift' | 'meta'
export type Platform = 'mac' | 'windows' | 'linux' | 'all'

export interface ShortcutConfig {
  id: string // 配置唯一标识
  key: string // 主键（如 'n'）
  modifiers: Modifier[] // 修饰键数组
  action: string // 对应的操作名称
  description?: string // 描述信息
  enabled: boolean // 是否启用
  platform?: Platform // 平台特定配置
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

export interface ShortcutsState {
  shortcuts: Record<string, ShortcutConfig>
  isListening: boolean
  activeModal?: string
  isLoading: boolean
  error: string | null
}

export interface UserShortcutsPreferences {
  version: string // 配置版本
  shortcuts: ShortcutConfig[] // 快捷键配置数组
  presets: string[] // 预设方案
  lastSyncAt?: Date // 最后同步时间
}

// 快捷键操作类型
export interface ShortcutAction {
  type: string
  payload?: any
}

// 快捷键上下文
export interface ShortcutContext {
  userId: string
  platform: Platform
  isOnline: boolean
}

// 快捷键冲突检测结果
export interface ShortcutConflict {
  existing: ShortcutConfig
  conflicting: ShortcutConfig
  severity: 'error' | 'warning'
}

// 默认快捷键配置
export const DEFAULT_SHORTCUTS: ShortcutConfig[] = [
  {
    id: 'new-note',
    key: 'n',
    modifiers: ['meta'], // Mac 用 Command，Windows 用 Ctrl
    action: 'openNewNoteModal',
    description: '新建笔记',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// 快捷键预设方案
export const SHORTCUT_PRESETS = {
  default: '默认配置',
  vscode: 'VS Code 风格',
  emacs: 'Emacs 风格',
  custom: '自定义',
} as const

export type ShortcutPreset = keyof typeof SHORTCUT_PRESETS
