import { createFileRoute } from '@tanstack/react-router'
import { useNewNoteShortcut } from '@/components/shortcuts/shortcut-provider'
import { useNewNoteModal } from '@/components/modals/new-note-modal'
import { NewNoteModal } from '@/components/modals/new-note-modal'

export const Route = createFileRoute('/today')({
  component: TodayPage,
})

function TodayPage() {
  // 注册快捷键处理器
  const { openNewNoteModal } = useNewNoteModal()

  useNewNoteShortcut(() => {
    openNewNoteModal()
  })

  // 处理创建笔记事件
  const handleCreateNote = (data: { title: string; notebookId: string }) => {
    console.log('创建笔记:', data)
    // 这里可以调用 API 创建笔记
    // TODO: 实现实际的笔记创建逻辑
  }

  return (
    <div className="h-screen w-full bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4 text-gray-900">欢迎回来</h1>
        <p className="text-lg text-gray-600 mb-8">
          今天是个好日子，开始记录你的想法吧
        </p>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
          <h2 className="text-xl font-medium mb-4 text-gray-900">快捷键提示</h2>
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-700">新建笔记</span>
              <kbd className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-mono">
                {navigator.platform.includes('Mac') ? '⌘+N' : 'Ctrl+N'}
              </kbd>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            更多快捷键功能即将推出...
          </p>
        </div>

        {/* 新建笔记模态框 */}
        <NewNoteModal onCreateNote={handleCreateNote} />
      </div>
    </div>
  )
}
