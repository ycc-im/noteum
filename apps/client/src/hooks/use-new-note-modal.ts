import { useShortcutsStore } from '@/stores/shortcuts'
import { useShortcutAction } from '@/components/shortcuts/shortcut-provider'

// Hook 用于控制新建笔记模态框
export const useNewNoteModal = () => {
  const { openModal, closeModal } = useShortcutsStore()

  const openNewNoteModal = () => {
    console.log('🎯 New note modal opened via shortcut or button')
    openModal('new-note')
  }

  const closeNewNoteModal = () => {
    closeModal()
  }

  // 注册快捷键动作处理器
  useShortcutAction('openNewNoteModal', openNewNoteModal)

  return {
    isOpen: useShortcutsStore((state) => state.activeModal === 'new-note'),
    openNewNoteModal,
    closeNewNoteModal,
  }
}
