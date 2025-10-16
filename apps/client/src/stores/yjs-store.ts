import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { Presence } from '@/types'

interface YjsState {
  doc: Y.Doc | null
  provider: WebsocketProvider | null
  isConnected: boolean
  isSynced: boolean
  documentId: string | null
  presence: Map<string, Presence>
  conflicts: any[]

  // Actions
  connect: (documentId: string, websocketUrl?: string) => void
  disconnect: () => void
  updatePresence: (userId: string, presence: Partial<Presence>) => void
  removePresence: (userId: string) => void
  clearConflicts: () => void
  setIsConnected: (connected: boolean) => void
  setIsSynced: (synced: boolean) => void
}

export const useYjsStore = create<YjsState>()(
  devtools((set, get) => ({
    // Initial state
    doc: null,
    provider: null,
    isConnected: false,
    isSynced: false,
    documentId: null,
    presence: new Map(),
    conflicts: [],

    // Actions
    connect: (documentId: string, websocketUrl = 'ws://localhost:1234') => {
      const doc = new Y.Doc()
      const provider = new WebsocketProvider(websocketUrl, documentId, doc, {
        connect: true,
      })

      provider.on('status', (event: any) => {
        set({ isConnected: event.status === 'connected' })
      })

      provider.on('sync', (synced: boolean) => {
        set({ isSynced: synced })
      })

      // Set up awareness for presence
      const awareness = provider.awareness

      awareness.on('change', () => {
        const presenceMap = new Map()
        awareness.getStates().forEach((state: any, clientId: number) => {
          if (state.user) {
            presenceMap.set(clientId.toString(), {
              userId: clientId.toString(),
              user: state.user,
              cursor: state.cursor,
              selection: state.selection,
              isActive: true,
              lastActivity: new Date(),
            })
          }
        })
        set({ presence: presenceMap })
      })

      set({ doc, provider, documentId })
    },

    disconnect: () => {
      const { provider, doc } = get()
      if (provider) {
        provider.destroy()
      }
      if (doc) {
        doc.destroy()
      }
      set({
        doc: null,
        provider: null,
        isConnected: false,
        isSynced: false,
        documentId: null,
        presence: new Map(),
      })
    },

    updatePresence: (userId: string, presenceUpdate: Partial<Presence>) => {
      const { presence } = get()
      const current = presence.get(userId)
      if (current) {
        const updated = { ...current, ...presenceUpdate, lastActivity: new Date() }
        const newPresence = new Map(presence)
        newPresence.set(userId, updated)
        set({ presence: newPresence })
      }
    },

    removePresence: (userId: string) => {
      const { presence } = get()
      const newPresence = new Map(presence)
      newPresence.delete(userId)
      set({ presence: newPresence })
    },

    clearConflicts: () => set({ conflicts: [] }),
    setIsConnected: connected => set({ isConnected: connected }),
    setIsSynced: synced => set({ isSynced: synced }),
  }))
)