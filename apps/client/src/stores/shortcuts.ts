import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  ShortcutConfig,
  ShortcutsState,
  UserShortcutsPreferences,
} from '@/types/shortcuts'
import { DEFAULT_SHORTCUTS } from '@/types/shortcuts'

// 获取当前平台
const getPlatform = (): 'mac' | 'windows' | 'linux' => {
  const userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.includes('mac')) return 'mac'
  if (userAgent.includes('win')) return 'windows'
  return 'linux'
}

interface ShortcutsStore extends ShortcutsState {
  // Actions
  loadShortcuts: (preferences?: UserShortcutsPreferences) => void
  addShortcut: (config: ShortcutConfig) => void
  updateShortcut: (id: string, config: Partial<ShortcutConfig>) => void
  removeShortcut: (id: string) => void
  toggleShortcut: (id: string, enabled: boolean) => void
  openModal: (modalId: string) => void
  closeModal: () => void

  // Utility methods
  resetToDefaults: () => void
  getShortcut: (id: string) => ShortcutConfig | undefined
  getAllShortcuts: () => ShortcutConfig[]
  exportShortcuts: () => UserShortcutsPreferences
  importShortcuts: (preferences: UserShortcutsPreferences) => boolean
}

const initialState: ShortcutsState = {
  shortcuts: {},
  isListening: true,
  activeModal: undefined,
  isLoading: false,
  error: null,
}

// 将 ShortcutConfig 数组转换为 Record 格式
const shortcutsToRecord = (
  shortcuts: ShortcutConfig[]
): Record<string, ShortcutConfig> => {
  const record: Record<string, ShortcutConfig> = {}
  shortcuts.forEach((shortcut) => {
    record[shortcut.id] = shortcut
  })
  return record
}

// 将 Record 格式转换为 ShortcutConfig 数组
const recordToShortcuts = (
  record: Record<string, ShortcutConfig>
): ShortcutConfig[] => {
  return Object.values(record)
}

export const useShortcutsStore = create<ShortcutsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // 加载快捷键配置
        loadShortcuts: (preferences) => {
          try {
            set({ isLoading: true, error: null })

            if (
              preferences &&
              preferences.shortcuts &&
              preferences.shortcuts.length > 0
            ) {
              // 从用户偏好设置加载
              const shortcutsRecord = shortcutsToRecord(preferences.shortcuts)
              set({
                shortcuts: shortcutsRecord,
                isLoading: false,
              })
            } else {
              // 使用默认配置
              const platform = getPlatform()
              const adaptedDefaults = DEFAULT_SHORTCUTS.map((shortcut) => ({
                ...shortcut,
                platform: platform as any,
              }))
              const shortcutsRecord = shortcutsToRecord(adaptedDefaults)
              set({
                shortcuts: shortcutsRecord,
                isLoading: false,
              })
            }
          } catch (error) {
            console.error('Failed to load shortcuts:', error)
            set({
              error: 'Failed to load shortcuts',
              isLoading: false,
            })
          }
        },

        // 添加快捷键
        addShortcut: (config) => {
          const { shortcuts } = get()

          // 检查是否已存在
          if (shortcuts[config.id]) {
            set({ error: `Shortcut with id '${config.id}' already exists` })
            return
          }

          // 设置创建时间和更新时间
          const newShortcut: ShortcutConfig = {
            ...config,
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          set({
            shortcuts: {
              ...shortcuts,
              [config.id]: newShortcut,
            },
          })
        },

        // 更新快捷键
        updateShortcut: (id, config) => {
          const { shortcuts } = get()
          const existing = shortcuts[id]

          if (!existing) {
            set({ error: `Shortcut with id '${id}' not found` })
            return
          }

          const updatedShortcut: ShortcutConfig = {
            ...existing,
            ...config,
            updatedAt: new Date(),
          }

          set({
            shortcuts: {
              ...shortcuts,
              [id]: updatedShortcut,
            },
          })
        },

        // 删除快捷键
        removeShortcut: (id) => {
          const { shortcuts } = get()
          const newShortcuts = { ...shortcuts }
          delete newShortcuts[id]
          set({ shortcuts: newShortcuts })
        },

        // 切换快捷键启用状态
        toggleShortcut: (id, enabled) => {
          const { shortcuts } = get()
          const existing = shortcuts[id]

          if (existing) {
            set({
              shortcuts: {
                ...shortcuts,
                [id]: {
                  ...existing,
                  enabled,
                  updatedAt: new Date(),
                },
              },
            })
          }
        },

        // 打开模态框
        openModal: (modalId) => {
          set({ activeModal: modalId })
        },

        // 关闭模态框
        closeModal: () => {
          set({ activeModal: undefined })
        },

        // 重置为默认设置
        resetToDefaults: () => {
          const platform = getPlatform()
          const adaptedDefaults = DEFAULT_SHORTCUTS.map((shortcut) => ({
            ...shortcut,
            platform: platform as any,
          }))
          const shortcutsRecord = shortcutsToRecord(adaptedDefaults)
          set({
            shortcuts: shortcutsRecord,
            error: null,
          })
        },

        // 获取单个快捷键
        getShortcut: (id) => {
          const { shortcuts } = get()
          return shortcuts[id]
        },

        // 获取所有快捷键
        getAllShortcuts: () => {
          const { shortcuts } = get()
          return recordToShortcuts(shortcuts)
        },

        // 导出快捷键配置
        exportShortcuts: () => {
          const { shortcuts } = get()
          return {
            version: '1.0.0',
            shortcuts: recordToShortcuts(shortcuts),
            presets: ['default'],
            lastSyncAt: new Date(),
          }
        },

        // 导入快捷键配置
        importShortcuts: (preferences) => {
          try {
            if (!preferences || !preferences.shortcuts) {
              set({ error: 'Invalid shortcuts configuration' })
              return false
            }

            const shortcutsRecord = shortcutsToRecord(preferences.shortcuts)
            set({
              shortcuts: shortcutsRecord,
              error: null,
            })
            return true
          } catch (error) {
            console.error('Failed to import shortcuts:', error)
            set({ error: 'Failed to import shortcuts' })
            return false
          }
        },
      }),
      {
        name: 'shortcuts-store',
        partialize: (state) => ({
          shortcuts: state.shortcuts,
          // 不持久化以下状态
          // isListening: state.isListening,
          // activeModal: state.activeModal,
          // isLoading: state.isLoading,
          // error: state.error
        }),
      }
    ),
    { name: 'shortcuts-store' }
  )
)

// 选择器 hooks
export const useShortcuts = () => useShortcutsStore()
export const useShortcutsList = () =>
  useShortcutsStore((state) => state.getAllShortcuts())
export const useActiveModal = () =>
  useShortcutsStore((state) => state.activeModal)
export const useShortcutsError = () => useShortcutsStore((state) => state.error)
export const useShortcutsLoading = () =>
  useShortcutsStore((state) => state.isLoading)
