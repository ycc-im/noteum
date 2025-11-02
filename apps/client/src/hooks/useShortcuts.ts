import { useCallback, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import type { ShortcutConfig, ShortcutConflict } from '@/types/shortcuts'

// 获取当前平台
export const getPlatform = (): 'mac' | 'windows' | 'linux' => {
  const userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.includes('mac')) return 'mac'
  if (userAgent.includes('win')) return 'windows'
  return 'linux'
}

// 标准化快捷键组合
export const normalizeShortcut = (config: ShortcutConfig): string => {
  const platform = getPlatform()
  const modifiers = [...config.modifiers]

  // 处理跨平台差异
  if (platform === 'mac') {
    // Mac 上 meta 键就是 Command 键
    // Windows/Linux 上需要将 meta 转换为 ctrl
  } else if (platform === 'windows' || platform === 'linux') {
    const metaIndex = modifiers.indexOf('meta')
    if (metaIndex !== -1) {
      modifiers[metaIndex] = 'ctrl'
    }
  }

  // 生成快捷键字符串，react-hotkeys-hook 格式
  return [...modifiers, config.key].join('+')
}

// 检测快捷键冲突
export const detectShortcutConflict = (
  config: ShortcutConfig,
  existingConfigs: ShortcutConfig[]
): ShortcutConflict | null => {
  const normalizedConfig = normalizeShortcut(config)

  for (const existing of existingConfigs) {
    if (existing.id === config.id) continue // 跳过自身

    const normalizedExisting = normalizeShortcut(existing)

    // 检查是否有冲突
    if (normalizedConfig === normalizedExisting && existing.enabled) {
      return {
        existing,
        conflicting: config,
        severity: 'error',
      }
    }
  }

  return null
}

// 快捷键管理器 Hook
export const useShortcutManager = (shortcuts: ShortcutConfig[]) => {
  const platform = getPlatform()

  // 将快捷键配置转换为 react-hotkeys-hook 格式
  const shortcutMap = useMemo(() => {
    const map: Record<string, ShortcutConfig[]> = {}

    for (const shortcut of shortcuts) {
      if (!shortcut.enabled) continue

      // 检查平台兼容性
      if (
        shortcut.platform &&
        shortcut.platform !== 'all' &&
        shortcut.platform !== platform
      ) {
        continue
      }

      const hotkey = normalizeShortcut(shortcut)
      if (!map[hotkey]) {
        map[hotkey] = []
      }
      map[hotkey].push(shortcut)
    }

    return map
  }, [shortcuts, platform])

  // 注册所有快捷键
  const registerHotkeys = useCallback(() => {
    const handlers: Record<string, (event: KeyboardEvent) => void> = {}

    Object.entries(shortcutMap).forEach(([hotkey, configs]) => {
      handlers[hotkey] = (event: KeyboardEvent) => {
        // 阻止默认行为
        event.preventDefault()
        event.stopPropagation()

        // 触发所有匹配的快捷键操作
        configs.forEach((config) => {
          // 触发自定义事件
          const customEvent = new CustomEvent('shortcut-triggered', {
            detail: { shortcut: config, hotkey, event },
          })
          window.dispatchEvent(customEvent)
        })
      }
    })

    return handlers
  }, [shortcutMap])

  // 检查快捷键有效性
  const validateShortcut = useCallback(
    (config: Partial<ShortcutConfig>): string[] => {
      const errors: string[] = []

      if (!config.key) {
        errors.push('快捷键不能为空')
      }

      if (!config.modifiers || config.modifiers.length === 0) {
        errors.push('至少需要一个修饰键')
      }

      if (!config.action) {
        errors.push('操作不能为空')
      }

      return errors
    },
    []
  )

  // 获取快捷键的显示文本
  const getShortcutDisplayText = useCallback(
    (config: ShortcutConfig): string => {
      const platform = getPlatform()
      const modifiers = [...config.modifiers]

      // 平台特定的显示格式
      if (platform === 'mac') {
        return (
          modifiers
            .map((mod) => {
              switch (mod) {
                case 'meta':
                  return '⌘'
                case 'ctrl':
                  return '⌃'
                case 'alt':
                  return '⌥'
                case 'shift':
                  return '⇧'
                default:
                  return mod
              }
            })
            .join('') + config.key.toUpperCase()
        )
      } else {
        return (
          modifiers
            .map((mod) => {
              switch (mod) {
                case 'meta':
                  return 'Ctrl'
                case 'ctrl':
                  return 'Ctrl'
                case 'alt':
                  return 'Alt'
                case 'shift':
                  return 'Shift'
                default:
                  return mod
              }
            })
            .join(' + ') +
          ' + ' +
          config.key.toUpperCase()
        )
      }
    },
    []
  )

  return {
    shortcutMap,
    registerHotkeys,
    validateShortcut,
    getShortcutDisplayText,
    platform,
    normalizeShortcut,
    detectShortcutConflict: (config: ShortcutConfig) =>
      detectShortcutConflict(config, shortcuts),
  }
}

// 单个快捷键 Hook
export const useShortcut = (
  hotkey: string,
  callback: () => void,
  deps?: any[]
) => {
  return useHotkeys(
    hotkey,
    callback,
    {
      enableOnFormTags: true,
      enableOnContentEditable: true,
    },
    deps
  )
}

// 跨平台快捷键检测 Hook
export const useCrossPlatformShortcut = (
  config: ShortcutConfig,
  callback: () => void,
  deps?: any[]
) => {
  const hotkey = normalizeShortcut(config)

  return useShortcut(hotkey, callback, deps)
}
