// Base Note interface with comprehensive fields
export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  
  // React Flow compatibility
  type: 'text' | 'markdown' | 'code' | 'image' | 'link' | 'canvas';
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  style?: Record<string, any>;
  
  // Content and metadata
  tags: string[];
  embedding?: number[]; // 1536-dim vector for pgvector
  metadata?: Record<string, any>;
  slots?: Record<string, any>; // JSON slots for flexible data
  
  // Hierarchy and connections
  parentId?: string;
  children: string[];
  connections: string[];
  
  // Version control
  version: number;
  versionHistory: string[];
  isLatest: boolean;
  
  // Collaboration and status
  isPublic: boolean;
  permissions: 'private' | 'shared' | 'public';
  collaborators: string[];
  status: 'draft' | 'published' | 'archived';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt?: Date;
}

// Version-specific note interface
export interface NoteVersion {
  id: string;
  noteId: string;
  version: number;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  createdBy: string;
}

// Search result interface
export interface SearchResult {
  note: Note;
  score: number;
  highlights?: string[];
}

// Pagination interface
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Connection interface for React Flow
export interface NoteConnection {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'reference' | 'parent-child' | 'related' | 'custom';
  label?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Bulk operation result
export interface BulkOperationResult {
  successful: string[];
  failed: { id: string; error: string }[];
  total: number;
}

// Activity tracking
export interface NoteActivity {
  id: string;
  noteId: string;
  userId: string;
  action: 'created' | 'updated' | 'viewed' | 'shared' | 'deleted';
  metadata?: Record<string, any>;
  timestamp: Date;
}

// Repository interface with comprehensive methods
export interface INotesRepository {
  // Basic CRUD operations
  create(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'isLatest'>): Promise<Note>;
  findById(id: string): Promise<Note | null>;
  findByUserId(userId: string, options?: {
    page?: number;
    limit?: number;
    status?: Note['status'];
    type?: Note['type'];
  }): Promise<PaginatedResult<Note>>;
  update(id: string, updateData: Partial<Omit<Note, 'id' | 'createdAt' | 'version'>>): Promise<Note | null>;
  delete(id: string): Promise<boolean>;
  
  // Vector search operations
  searchSemantic(
    query: string | number[],
    options?: {
      userId?: string;
      limit?: number;
      threshold?: number;
      filters?: Record<string, any>;
    }
  ): Promise<SearchResult[]>;
  
  searchFullText(
    query: string,
    options?: {
      userId?: string;
      limit?: number;
      filters?: Record<string, any>;
    }
  ): Promise<SearchResult[]>;
  
  // Version management
  createVersion(noteId: string, versionData: Omit<NoteVersion, 'id' | 'createdAt'>): Promise<NoteVersion>;
  getVersions(noteId: string): Promise<NoteVersion[]>;
  getVersion(noteId: string, version: number): Promise<NoteVersion | null>;
  revertToVersion(noteId: string, version: number): Promise<Note | null>;
  
  // Position and React Flow operations
  updatePosition(id: string, position: { x: number; y: number }): Promise<Note | null>;
  updateSize(id: string, size: { width: number; height: number }): Promise<Note | null>;
  
  // Connection management
  createConnection(connection: Omit<NoteConnection, 'id' | 'createdAt'>): Promise<NoteConnection>;
  getConnections(noteId: string): Promise<NoteConnection[]>;
  deleteConnection(connectionId: string): Promise<boolean>;
  
  // Bulk operations
  bulkCreate(notes: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'isLatest'>[]): Promise<BulkOperationResult>;
  bulkUpdate(updates: { id: string; data: Partial<Note> }[]): Promise<BulkOperationResult>;
  bulkDelete(ids: string[]): Promise<BulkOperationResult>;
  
  // Advanced queries
  findByTags(tags: string[], userId?: string): Promise<Note[]>;
  findRecent(userId: string, limit?: number): Promise<Note[]>;
  findPopular(userId?: string, limit?: number): Promise<Note[]>;
  findSimilar(noteId: string, limit?: number): Promise<Note[]>;
  
  // Activity tracking
  recordActivity(activity: Omit<NoteActivity, 'id' | 'timestamp'>): Promise<NoteActivity>;
  getActivity(noteId: string, limit?: number): Promise<NoteActivity[]>;
  
  // Export/Import
  exportNotes(userId: string, format: 'json' | 'markdown' | 'csv'): Promise<string>;
  importNotes(userId: string, data: string, format: 'json' | 'markdown'): Promise<BulkOperationResult>;
}