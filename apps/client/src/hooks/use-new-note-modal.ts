import { useShortcutsStore } from '@/stores/shortcuts'

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
    isOpen: useShortcutsStore((state) => state.activeModal === 'new-note'),
    openNewNoteModal,
    closeNewNoteModal,
  }
}
