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
  const [notebookId, setNotebookId] = useState('')

  // 处理创建笔记
  const handleCreateNote = () => {
    if (title.trim()) {
      const noteData = {
        title: title.trim(),
        notebookId: notebookId || 'default',
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
      setNotebookId('')
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
          <DialogTitle>创建新笔记</DialogTitle>
          <DialogDescription>
            为你的新笔记选择一个标题和笔记本
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="note-title"
              className="block text-sm font-medium mb-2"
            >
              标题
            </label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入笔记标题..."
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="notebook-select"
              className="block text-sm font-medium mb-2"
            >
              笔记本
            </label>
            <select
              id="notebook-select"
              value={notebookId}
              onChange={(e) => setNotebookId(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="default">默认笔记本</option>
              <option value="work">工作</option>
              <option value="personal">个人</option>
              <option value="ideas">想法</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
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
