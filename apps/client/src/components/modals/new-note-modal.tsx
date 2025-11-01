import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useActiveModal, useShortcutsStore } from '@/stores/shortcuts'

export interface NewNoteModalProps {
  isOpen?: boolean
  onClose?: () => void
  onCreateNote?: (data: { title: string; notebookId: string }) => void
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

  // 处理创建笔记
  const handleCreateNote = () => {
    if (title.trim()) {
      const noteData = {
        title: title.trim(),
        notebookId: 'default',
      }

      if (externalOnCreateNote) {
        externalOnCreateNote(noteData)
      } else {
        // 触发全局创建笔记事件
        window.dispatchEvent(
          new CustomEvent('create-note', { detail: noteData })
        )
      }

      // 重置表单并关闭模态框
      setTitle('')
      handleClose()
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
          <Button onClick={handleCreateNote} disabled={!title.trim()}>
            创建笔记
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook 用于控制新建笔记模态框
export const useNewNoteModal = () => {
  const { openModal, closeModal } = useShortcutsStore()

  const openNewNoteModal = () => {
    openModal('new-note')
  }

  const closeNewNoteModal = () => {
    closeModal()
  }

  return {
    isOpen: useActiveModal() === 'new-note',
    openNewNoteModal,
    closeNewNoteModal,
  }
}
