import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'
import { NewNoteModal } from '@/components/modals/NewNoteModal'
import { useNewNoteModal } from '@/hooks/useNewNoteModal'

export const Route = createFileRoute('/notes/')({
  component: function Notes() {
    const { openNewNoteModal } = useNewNoteModal()

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notes</h1>
          <Button onClick={openNewNoteModal}>新建笔记</Button>
        </div>
        <p className="text-muted-foreground">Your notes will appear here</p>

        {/* 新建笔记模态框 */}
        <NewNoteModal />
      </div>
    )
  },
})
