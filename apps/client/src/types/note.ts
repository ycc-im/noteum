export interface Note {
  id: string
  title: string
  notebookId: string
  structuredData: {
    metadata: NoteMetadata
    tags: string[]
    category?: string
    isPublic: boolean
    isArchived: boolean
    version: number
    wordCount?: number
    readingTime?: number
  }
  collaborationData: {
    yjsState?: Uint8Array
    lastSyncAt?: Date
    conflictResolved: boolean
    isCollaborative: boolean
  }
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export interface NoteMetadata {
  author: string
  lastEditedBy: string
  editCount: number
  characterCount: number
  estimatedReadingTime: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateNoteRequest {
  title: string
  notebookId: string
  content?: string
  tags?: string[]
  category?: string
  isPublic?: boolean
}

export interface UpdateNoteRequest {
  title?: string
  content?: string
  tags?: string[]
  category?: string
  isPublic?: boolean
  isArchived?: boolean
}