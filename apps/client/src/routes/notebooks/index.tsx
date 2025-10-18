import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notebooks/')({
  component: function Notebooks() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Notebooks</h1>
        <p>Your notebooks will appear here</p>
      </div>
    )
  },
})
