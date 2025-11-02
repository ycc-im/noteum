import {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useShortcutManager } from '@/hooks/useShortcuts'
import { useShortcutsStore } from '@/stores/shortcuts'
import type { ShortcutConfig } from '@/types/shortcuts'

// 快捷键上下文
interface ShortcutContextValue {
  shortcuts: ShortcutConfig[]
  isListening: boolean
  startListening: () => void
  stopListening: () => void
  registerShortcut: (config: ShortcutConfig) => void
  unregisterShortcut: (id: string) => void
  triggerAction: (action: string) => void
}

const ShortcutContext = createContext<ShortcutContextValue | undefined>(
  undefined
)

interface ShortcutProviderProps {
  children: ReactNode
  userId?: string
  initialConfig?: ShortcutConfig[]
}

// 动作处理器管理器
class ActionHandlerManager {
  private handlers = new Map<string, (() => void)[]>()

  register(action: string, handler: () => void) {
    if (!this.handlers.has(action)) {
      this.handlers.set(action, [])
    }
    this.handlers.get(action)!.push(handler)
  }

  unregister(action: string, handler: () => void) {
    const handlers = this.handlers.get(action)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
      if (handlers.length === 0) {
        this.handlers.delete(action)
      }
    }
  }

  trigger(action: string) {
    const handlers = this.handlers.get(action)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler()
        } catch (error) {
          console.error(`Error executing action handler for ${action}:`, error)
        }
      })
    }
  }
}

const actionHandlerManager = new ActionHandlerManager()

export const ShortcutProvider: React.FC<ShortcutProviderProps> = ({
  children,
  initialConfig,
}) => {
  const shortcutsList = useShortcutsStore((state) =>
    Object.values(state.shortcuts)
  )
  const { loadShortcuts, addShortcut, removeShortcut } = useShortcutsStore()

  const { registerHotkeys, detectShortcutConflict } =
    useShortcutManager(shortcutsList)
  const isListening = useRef(true)

  // 触发动作
  const triggerAction = useCallback((action: string) => {
    actionHandlerManager.trigger(action)
  }, [])

  // 开始监听
  const startListening = useCallback(() => {
    isListening.current = true
  }, [])

  // 停止监听
  const stopListening = useCallback(() => {
    isListening.current = false
  }, [])

  // 注册快捷键
  const registerShortcut = useCallback(
    (config: ShortcutConfig) => {
      // 检测冲突
      const conflict = detectShortcutConflict(config)
      if (conflict) {
        console.warn(`Shortcut conflict detected:`, conflict)
      }
      addShortcut(config)
    },
    [detectShortcutConflict, addShortcut]
  )

  // 注销快捷键
  const unregisterShortcut = useCallback(
    (id: string) => {
      removeShortcut(id)
    },
    [removeShortcut]
  )

  // 初始化快捷键
  useEffect(() => {
    if (initialConfig && initialConfig.length > 0) {
      initialConfig.forEach((config) => {
        addShortcut(config)
      })
    } else {
      // 加载默认快捷键
      loadShortcuts()
    }
  }, [initialConfig, loadShortcuts, addShortcut])

  // 注册新建笔记快捷键
  useHotkeys(
    'meta+n',
    (event) => {
      // 阻止默认行为
      event.preventDefault()
      event.stopPropagation()

      // 直接触发新建笔记操作
      triggerAction('openNewNoteModal')
    },
    {
      enableOnFormTags: true,
      enableOnContentEditable: true,
    }
  )

  // 为 Windows/Linux 注册 Ctrl+N
  useHotkeys(
    'ctrl+n',
    (event) => {
      // 阻止默认行为
      event.preventDefault()
      event.stopPropagation()

      // 直接触发新建笔记操作
      triggerAction('openNewNoteModal')
    },
    {
      enableOnFormTags: true,
      enableOnContentEditable: true,
    }
  )

  // 提供快捷键上下文值
  const contextValue: ShortcutContextValue = {
    shortcuts: shortcutsList,
    isListening: isListening.current,
    startListening,
    stopListening,
    registerShortcut,
    unregisterShortcut,
    triggerAction,
  }

  return (
    <ShortcutContext.Provider value={contextValue}>
      {children}
    </ShortcutContext.Provider>
  )
}

// 使用快捷键上下文的 Hook
export const useShortcutsContext = () => {
  const context = useContext(ShortcutContext)
  if (context === undefined) {
    throw new Error(
      'useShortcutsContext must be used within a ShortcutProvider'
    )
  }
  return context
}

// 注册快捷键动作的 Hook
export const useShortcutAction = (action: string, handler: () => void) => {
  useEffect(() => {
    actionHandlerManager.register(action, handler)
    return () => {
      actionHandlerManager.unregister(action, handler)
    }
  }, [action, handler])
}

// 具体快捷键操作的 Hook
export const useNewNoteShortcut = (handler: () => void) => {
  useShortcutAction('openNewNoteModal', handler)
}

export const useShortcut = (action: string, handler: () => void) => {
  useShortcutAction(action, handler)
}
