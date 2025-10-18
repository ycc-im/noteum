export interface CollaborationUser {
  id: string
  name: string
  email: string
  avatar?: string
  color: string
  cursor: CursorPosition
  isOnline: boolean
  lastSeen: Date
}

export interface CursorPosition {
  noteId: string
  position: number
  selection?: {
    start: number
    end: number
  }
}

export interface Presence {
  userId: string
  user: CollaborationUser
  cursor?: CursorPosition
  selection?: {
    start: number
    end: number
  }
  isActive: boolean
  lastActivity: Date
}

export interface YjsDocumentState {
  id: string
  content: string
  version: number
  syncedAt: Date
  conflicts: Conflict[]
}

export interface Conflict {
  id: string
  type: 'content' | 'formatting' | 'structure'
  description: string
  resolved: boolean
  createdAt: Date
}

export interface CollaborationEvent {
  id: string
  type:
    | 'user_joined'
    | 'user_left'
    | 'cursor_moved'
    | 'text_changed'
    | 'conflict_detected'
  userId: string
  timestamp: Date
  data: any
}
