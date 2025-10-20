import { useState, useEffect } from 'react'
import { Moon, Sun, Palette, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type ColorScheme = 'default' | 'warm' | 'contrast'
type ThemeMode = 'light' | 'dark'

interface ThemeState {
  colorScheme: ColorScheme
  mode: ThemeMode
}

const colorSchemeLabels = {
  default: '简洁风格',
  warm: '护眼配色',
  contrast: '高对比度',
}

const modeLabels = {
  light: '日间模式',
  dark: '夜间模式',
}

const modeIcons = {
  light: Sun,
  dark: Moon,
}

export function ThemeToggle() {
  const [themeState, setThemeState] = useState<ThemeState>(() => {
    const saved = localStorage.getItem('app-theme-state')
    if (saved) {
      return JSON.parse(saved)
    }
    return { colorScheme: 'default', mode: 'light' }
  })

  useEffect(() => {
    applyTheme(themeState)
  }, [themeState])

  const applyTheme = (state: ThemeState) => {
    const root = document.documentElement

    // 清除所有主题类
    root.classList.remove(
      'light',
      'dark',
      'color-scheme-default',
      'color-scheme-warm',
      'color-scheme-contrast'
    )

    // 应用新的主题类
    root.classList.add(state.mode, `color-scheme-${state.colorScheme}`)

    // 保存状态
    localStorage.setItem('app-theme-state', JSON.stringify(state))
  }

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    setThemeState((prev) => ({ ...prev, colorScheme: scheme }))
  }

  const handleModeChange = (mode: ThemeMode) => {
    setThemeState((prev) => ({ ...prev, mode }))
  }

  const toggleQuickMode = () => {
    setThemeState((prev) => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }))
  }

  const ModeIcon = modeIcons[themeState.mode]

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent/80 transition-all duration-200 shadow-md min-w-[32px] px-2"
          >
            <ModeIcon className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 ml-1 opacity-60" />
            <span className="sr-only">主题设置</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            {colorSchemeLabels[themeState.colorScheme]}
          </div>

          <DropdownMenuSeparator />

          {/* 快速切换日夜模式 */}
          <DropdownMenuItem onClick={toggleQuickMode}>
            <ModeIcon className="h-4 w-4 mr-2" />
            切换至{themeState.mode === 'light' ? '夜间' : '日间'}模式
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* 配色方案选择 */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette className="h-4 w-4 mr-2" />
              配色方案
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40">
              {(Object.keys(colorSchemeLabels) as ColorScheme[]).map(
                (scheme) => (
                  <DropdownMenuItem
                    key={scheme}
                    onClick={() => handleColorSchemeChange(scheme)}
                    className={
                      themeState.colorScheme === scheme ? 'bg-accent' : ''
                    }
                  >
                    {colorSchemeLabels[scheme]}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* 模式选择 */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="h-4 w-4 mr-2" />
              显示模式
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40">
              {(Object.keys(modeLabels) as ThemeMode[]).map((mode) => {
                const Icon = modeIcons[mode]
                return (
                  <DropdownMenuItem
                    key={mode}
                    onClick={() => handleModeChange(mode)}
                    className={themeState.mode === mode ? 'bg-accent' : ''}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {modeLabels[mode]}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
