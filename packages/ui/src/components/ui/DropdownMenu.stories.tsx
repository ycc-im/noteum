import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { useState } from 'react'

const meta: Meta<typeof DropdownMenu> = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: { disable: true },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 基础下拉菜单
export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">打开菜单</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          个人资料
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          计费
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          键盘快捷键
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>新建笔记</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

// 带分隔符的菜单
export const WithSeparator: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">用户菜单</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>我的账户</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>个人资料</DropdownMenuItem>
        <DropdownMenuItem>设置</DropdownMenuItem>
        <DropdownMenuItem>键盘快捷键</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>注销</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

// 带复选框的菜单
export const WithCheckboxes: Story = {
  render: () => {
    const [showBookmarks, setShowBookmarks] = useState(true)
    const [showUrls, setShowUrls] = useState(false)
    const [showFullWidth, setShowFullWidth] = useState(true)

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">视图选项</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem inset>返回</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showBookmarks}
            onCheckedChange={setShowBookmarks}
          >
            显示书签栏
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showUrls}
            onCheckedChange={setShowUrls}
          >
            显示完整 URL
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showFullWidth}
            onCheckedChange={setShowFullWidth}
          >
            全宽度地址栏
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}

// 单选组菜单
export const WithRadioGroup: Story = {
  render: () => {
    const [position, setPosition] = useState('bottom')

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">位置</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>面板位置</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">顶部</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">底部</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">右侧</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}

// 子菜单
export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">更多选项</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          新建标签页
          <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          新建窗口
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>新建隐身窗口</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>更多工具</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              保存页面为...
              <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>创建快捷方式...</DropdownMenuItem>
            <DropdownMenuItem>为页面命名...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>开发者工具</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>
          任务管理器
          <DropdownMenuShortcut>⇧⌘Esc</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

// 分组菜单
export const WithGroups: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">文件菜单</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>应用菜单</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>新建笔记</DropdownMenuItem>
          <DropdownMenuItem>新建笔记本</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>打开</DropdownMenuItem>
          <DropdownMenuItem>导入</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>分享</DropdownMenuItem>
          <DropdownMenuItem>导出</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>打印</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

// 主题切换示例
export const ThemeToggle: Story = {
  render: () => {
    const [theme, setTheme] = useState('light')

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {theme === 'light' ? '🌞' : '🌙'} 主题
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')}>
            ☀️ 日间模式
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            🌙 夜间模式
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>🎨 配色方案</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>🎯 简洁风格</DropdownMenuItem>
              <DropdownMenuItem>🌿 护眼配色</DropdownMenuItem>
              <DropdownMenuItem>🔲 高对比度</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}
