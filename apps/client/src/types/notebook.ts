export interface Notebook {
  id: string
  name: string
  description?: string
  ownerId: string
  isPublic: boolean
  color?: string
  icon?: string
  memberCount: number
  noteCount: number
  createdAt: Date
  updatedAt: Date
  permissions: NotebookPermissions
}

export interface NotebookPermissions {
  canEdit: boolean
  canShare: boolean
  canDelete: boolean
  canAddMembers: boolean
  role: 'owner' | 'editor' | 'viewer'
}

export interface CreateNotebookRequest {
  name: string
  description?: string
  isPublic?: boolean
  color?: string
  icon?: string
}

export interface UpdateNotebookRequest {
  name?: string
  description?: string
  isPublic?: boolean
  color?: string
  icon?: string
}

export interface NotebookMember {
  id: string
  userId: string
  notebookId: string
  role: 'owner' | 'editor' | 'viewer'
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  joinedAt: Date
}