import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { useActiveModal, useShortcutsStore } from '@/stores/shortcuts'
// import { trpc } from '@/lib/trpc' // 暂时注释，待后续实现
import { generateUlid } from '@/lib/ulid'

export interface NewNoteModalProps {
  isOpen?: boolean
  onClose?: () => void
  onCreateNote?: (data: {
    title: string
    notebookId: string
    id: string
    createdAt: Date
  }) => void
}

export const NewNoteModal: React.FC<NewNoteModalProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  onCreateNote: externalOnCreateNote,
}) => {
  // 从全局状态获取模态框状态
  const globalModalId = useActiveModal()
  const { closeModal: globalCloseModal } = useShortcutsStore()

  // 确定当前模态框是否打开
  const isGloballyOpen = globalModalId === 'new-note'
  const isOpen = externalIsOpen ?? isGloballyOpen

  // 处理关闭事件
  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose()
    } else {
      globalCloseModal()
    }
  }

  // 表单状态
  const [title, setTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // 处理创建笔记
  const handleCreateNote = async () => {
    if (!title.trim()) return

    setIsCreating(true)
    try {
      const noteId = generateUlid()
      const noteData = {
        id: noteId,
        title: title.trim(),
        notebookId: 'default',
      }

      // 暂时使用简单的事件创建笔记，待tRPC路由器完善后恢复
      // const result = await createNoteMutation.mutateAsync(noteData)

      // 如果有外部回调函数，调用它
      if (externalOnCreateNote) {
        externalOnCreateNote({
          ...noteData,
          id: noteId,
          createdAt: new Date(),
        })
      } else {
        // 触发全局创建笔记事件
        window.dispatchEvent(
          new CustomEvent('create-note', {
            detail: {
              ...noteData,
              id: noteId,
              createdAt: new Date(),
            },
          })
        )
      }

      // 重置表单并关闭模态框
      setTitle('')
      handleClose()
    } catch (error) {
      console.error('Failed to create note:', error)
      // TODO: 显示错误提示给用户
    } finally {
      setIsCreating(false)
    }
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleCreateNote()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>新笔记</DialogTitle>
          <DialogDescription>
            输入笔记内容，使用 Cmd/Ctrl + Enter 创建
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="note-content"
              className="block text-sm font-medium mb-2"
            >
              内容
            </label>
            <textarea
              id="note-content"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入笔记内容..."
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[200px] resize-y"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreateNote}
            disabled={!title.trim() || isCreating}
          >
            {isCreating ? '创建中...' : '创建笔记'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
