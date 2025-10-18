import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Note, CreateNoteRequest, UpdateNoteRequest } from '@/types'

interface NotesState {
  notes: Note[]
  currentNote: Note | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchNotes: (notebookId?: string) => Promise<void>
  fetchNote: (id: string) => Promise<void>
  createNote: (data: CreateNoteRequest) => Promise<Note>
  updateNote: (id: string, data: UpdateNoteRequest) => Promise<Note>
  deleteNote: (id: string) => Promise<void>
  setCurrentNote: (note: Note | null) => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useNotesStore = create<NotesState>()(
  devtools((set) => ({
    // Initial state
    notes: [],
    currentNote: null,
    isLoading: false,
    error: null,

    // Actions
    fetchNotes: async (notebookId?: string) => {
      set({ isLoading: true, error: null })
      try {
        const url = notebookId
          ? `/api/notes?notebookId=${notebookId}`
          : '/api/notes'
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch notes')
        }

        const notes = await response.json()
        set({ notes })
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Failed to fetch notes',
        })
      } finally {
        set({ isLoading: false })
      }
    },

    fetchNote: async (id: string) => {
      set({ isLoading: true, error: null })
      try {
        const response = await fetch(`/api/notes/${id}`)

        if (!response.ok) {
          throw new Error('Failed to fetch note')
        }

        const note = await response.json()
        set({ currentNote: note })
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Failed to fetch note',
        })
      } finally {
        set({ isLoading: false })
      }
    },

    createNote: async (data: CreateNoteRequest) => {
      set({ isLoading: true, error: null })
      try {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Failed to create note')
        }

        const newNote = await response.json()
        set((state) => ({
          notes: [...state.notes, newNote],
          currentNote: newNote,
        }))
        return newNote
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Failed to create note',
        })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    updateNote: async (id: string, data: UpdateNoteRequest) => {
      set({ isLoading: true, error: null })
      try {
        const response = await fetch(`/api/notes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Failed to update note')
        }

        const updatedNote = await response.json()
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? updatedNote : note
          ),
          currentNote:
            state.currentNote?.id === id ? updatedNote : state.currentNote,
        }))
        return updatedNote
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Failed to update note',
        })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    deleteNote: async (id: string) => {
      set({ isLoading: true, error: null })
      try {
        const response = await fetch(`/api/notes/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete note')
        }

        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          currentNote: state.currentNote?.id === id ? null : state.currentNote,
        }))
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Failed to delete note',
        })
      } finally {
        set({ isLoading: false })
      }
    },

    setCurrentNote: (note) => set({ currentNote: note }),
    clearError: () => set({ error: null }),
    setLoading: (loading) => set({ isLoading: loading }),
  }))
)
