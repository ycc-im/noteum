// API Schema Definition for Apps/Services Project
// Generated from feature specification
// This file defines tRPC schemas for type-safe API

import { z } from 'zod'

// ============= Base Schemas =============

export const ULIDSchema = z.string().ulid()
export const DateTimeSchema = z.string().datetime()
export const EmailSchema = z.string().email()
export const JsonSchema = z.record(z.any())

// ============= User Schemas =============

export const UserProfileSchema = z.object({
  id: ULIDSchema,
  userId: ULIDSchema,
  displayName: z.string().min(1).max(255),
  avatar: z.string().url().optional(),
  bio: z.string().max(1000).optional(),
  preferences: JsonSchema,
})

export const UserSchema = z.object({
  id: ULIDSchema,
  email: EmailSchema,
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/),
  profile: UserProfileSchema.omit({ userId: true }),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
  lastLoginAt: DateTimeSchema.optional(),
  isActive: z.boolean(),
  role: z.enum(['ADMIN', 'USER', 'VIEWER']),
})

export const CreateUserSchema = z.object({
  email: EmailSchema,
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8),
  displayName: z.string().min(1).max(255),
})

export const UpdateUserSchema = z.object({
  displayName: z.string().min(1).max(255).optional(),
  bio: z.string().max(1000).optional(),
  avatar: z.string().url().optional(),
  preferences: JsonSchema.optional(),
})

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1),
})

export const UsernameLoginSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(1),
})

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
  expiresAt: DateTimeSchema,
})

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: ULIDSchema,
    email: EmailSchema,
    username: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/),
    displayName: z.string().optional(),
    role: z.enum(['ADMIN', 'USER', 'VIEWER']),
  }),
})

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
})

// ============= Note Schemas (Notebook-aware) =============

// ============= Notebook Schemas =============

export const NotebookSchema = z.object({
  id: ULIDSchema,
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  ownerId: ULIDSchema,
  visibility: z.enum(['PRIVATE', 'SHARED', 'PUBLIC']),
  settings: JsonSchema,
  metadata: JsonSchema,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
  version: z.number().int().min(0),
  owner: UserSchema.pick({
    id: true,
    username: true,
    profile: true,
  }),
  collaboratorsCount: z.number().int().min(0),
  notesCount: z.number().int().min(0),
})

export const CreateNotebookSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['PRIVATE', 'SHARED', 'PUBLIC']).default('PRIVATE'),
  settings: JsonSchema.optional(),
  metadata: JsonSchema.optional(),
})

export const UpdateNotebookSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['PRIVATE', 'SHARED', 'PUBLIC']).optional(),
  settings: JsonSchema.optional(),
  metadata: JsonSchema.optional(),
})

export const NotebookListQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  visibility: z.enum(['PRIVATE', 'SHARED', 'PUBLIC']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// 更新 Note Schema 以包含 notebookId
export const NoteSchema = z.object({
  id: ULIDSchema,
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  notebookId: ULIDSchema,
  ownerId: ULIDSchema,
  type: z.enum(['NOTE', 'DOCUMENT', 'WHITEBOARD', 'CODE', 'TODO', 'MINDMAP']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED']),
  settings: JsonSchema,
  metadata: JsonSchema,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
  version: z.number().int().min(0),
  inheritPermissions: z.boolean().default(true),
  owner: UserSchema.pick({
    id: true,
    username: true,
    profile: true,
  }),
  notebook: NotebookSchema.pick({
    id: true,
    title: true,
    visibility: true,
  }),
  collaboratorsCount: z.number().int().min(0),
})

export const CreateNoteSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  notebookId: ULIDSchema,
  type: z
    .enum(['NOTE', 'DOCUMENT', 'WHITEBOARD', 'CODE', 'TODO', 'MINDMAP'])
    .default('NOTE'),
  settings: JsonSchema.optional(),
  metadata: JsonSchema.optional(),
})

export const UpdateNoteSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  notebookId: ULIDSchema.optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED']).optional(),
  settings: JsonSchema.optional(),
  metadata: JsonSchema.optional(),
  inheritPermissions: z.boolean().optional(),
})

export const NoteListQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  notebookId: ULIDSchema.optional(),
  type: z
    .enum(['NOTE', 'DOCUMENT', 'WHITEBOARD', 'CODE', 'TODO', 'MINDMAP'])
    .optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// ============= Notebook Collaboration Schemas =============

export const NotebookCollaboratorSchema = z.object({
  id: ULIDSchema,
  notebookId: ULIDSchema,
  userId: ULIDSchema,
  permission: z.enum(['READ', 'WRITE', 'ADMIN', 'OWNER']),
  invitedBy: ULIDSchema,
  joinedAt: DateTimeSchema,
  lastActivityAt: DateTimeSchema.optional(),
  user: UserSchema.pick({
    id: true,
    username: true,
    profile: true,
  }),
  invitedByUser: UserSchema.pick({
    id: true,
    username: true,
    profile: true,
  }),
})

export const InviteNotebookCollaboratorSchema = z.object({
  notebookId: ULIDSchema,
  email: EmailSchema,
  permission: z.enum(['READ', 'WRITE', 'ADMIN']),
  message: z.string().max(500).optional(),
})

export const UpdateNotebookCollaboratorPermissionSchema = z.object({
  notebookId: ULIDSchema,
  userId: ULIDSchema,
  permission: z.enum(['READ', 'WRITE', 'ADMIN']),
})

// ============= Note Collaboration Schemas =============

export const NoteCollaboratorSchema = z.object({
  id: ULIDSchema,
  noteId: ULIDSchema,
  userId: ULIDSchema,
  permission: z.enum(['READ', 'WRITE', 'ADMIN', 'OWNER']),
  joinedAt: DateTimeSchema,
  lastActivityAt: DateTimeSchema.optional(),
  user: UserSchema.pick({
    id: true,
    username: true,
    profile: true,
  }),
})

export const InviteCollaboratorSchema = z.object({
  noteId: ULIDSchema,
  email: EmailSchema,
  permission: z.enum(['READ', 'WRITE', 'ADMIN']),
  message: z.string().max(500).optional(),
})

export const UpdateCollaboratorPermissionSchema = z.object({
  noteId: ULIDSchema,
  userId: ULIDSchema,
  permission: z.enum(['READ', 'WRITE', 'ADMIN']),
})

// ============= YJS Schemas =============

export const YjsUpdateSchema = z.object({
  noteId: ULIDSchema,
  update: z.string().base64(), // Base64 encoded binary data
  origin: z.string().optional(),
})

export const YjsStateVectorSchema = z.object({
  noteId: ULIDSchema,
  stateVector: z.string().base64().optional(),
})

export const NoteSnapshotSchema = z.object({
  id: ULIDSchema,
  noteId: ULIDSchema,
  version: z.number().int().min(0),
  createdAt: DateTimeSchema,
})

// ============= User Awareness Schemas =============

export const UserAwarenessSchema = z.object({
  userId: ULIDSchema,
  noteId: ULIDSchema,
  cursorPosition: z.number().int().min(0).optional(),
  selectionStart: z.number().int().min(0).optional(),
  selectionEnd: z.number().int().min(0).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  lastActivityAt: DateTimeSchema,
  isActive: z.boolean(),
  user: UserSchema.pick({
    id: true,
    username: true,
    profile: true,
  }),
})

export const UpdateAwarenessSchema = z.object({
  noteId: ULIDSchema,
  cursorPosition: z.number().int().min(0).optional(),
  selectionStart: z.number().int().min(0).optional(),
  selectionEnd: z.number().int().min(0).optional(),
})

// ============= Search Schemas =============

export const SearchQuerySchema = z.object({
  query: z.string().min(1).max(500),
  documentType: z.enum(['NOTE', 'DOCUMENT', 'WHITEBOARD', 'CODE']).optional(),
  limit: z.number().int().min(1).max(50).default(20),
  includeVectorSearch: z.boolean().default(true),
})

export const SearchResultSchema = z.object({
  document: NoteSchema,
  relevanceScore: z.number().min(0).max(1),
  matchedContent: z.string().optional(),
  highlights: z.array(z.string()).optional(),
})

// ============= Activity Schemas =============

export const ActivityLogSchema = z.object({
  id: ULIDSchema,
  userId: ULIDSchema,
  noteId: ULIDSchema.optional(),
  action: z.enum([
    'CREATE_DOCUMENT',
    'UPDATE_DOCUMENT',
    'DELETE_DOCUMENT',
    'SHARE_DOCUMENT',
    'LOGIN',
    'LOGOUT',
    'VIEW_DOCUMENT',
  ]),
  details: JsonSchema,
  timestamp: DateTimeSchema,
  user: UserSchema.pick({
    id: true,
    username: true,
    profile: true,
  }),
  document: NoteSchema.pick({
    id: true,
    title: true,
    type: true,
  }).optional(),
})

export const ActivityQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  userId: ULIDSchema.optional(),
  noteId: ULIDSchema.optional(),
  action: z
    .enum([
      'CREATE_DOCUMENT',
      'UPDATE_DOCUMENT',
      'DELETE_DOCUMENT',
      'SHARE_DOCUMENT',
      'LOGIN',
      'LOGOUT',
      'VIEW_DOCUMENT',
    ])
    .optional(),
  fromDate: DateTimeSchema.optional(),
  toDate: DateTimeSchema.optional(),
})

// ============= Health Check Schemas =============

export const HealthCheckSchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  timestamp: DateTimeSchema,
  services: z.object({
    database: z.object({
      status: z.enum(['healthy', 'unhealthy']),
      responseTime: z.number(),
    }),
    redis: z.object({
      status: z.enum(['healthy', 'unhealthy']),
      responseTime: z.number(),
    }),
    websockets: z.object({
      status: z.enum(['healthy', 'unhealthy']),
      activeConnections: z.number().int().min(0),
    }),
  }),
  version: z.string(),
  uptime: z.number(),
})

// ============= WebSocket Event Schemas =============

export const WebSocketEventSchema = z.object({
  type: z.enum([
    'document_update',
    'user_joined',
    'user_left',
    'cursor_moved',
    'awareness_updated',
    'document_saved',
  ]),
  noteId: ULIDSchema,
  userId: ULIDSchema,
  data: JsonSchema,
  timestamp: DateTimeSchema,
})

export const NoteJoinSchema = z.object({
  noteId: ULIDSchema,
  stateVector: z.string().base64().optional(),
})

export const NoteLeaveSchema = z.object({
  noteId: ULIDSchema,
})

// ============= Error Schemas =============

export const ErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: JsonSchema.optional(),
  timestamp: DateTimeSchema,
})

export const ValidationErrorSchema = ErrorSchema.extend({
  code: z.literal('VALIDATION_ERROR'),
  details: z.object({
    field: z.string(),
    message: z.string(),
    value: z.any(),
  }),
})

export const NotFoundErrorSchema = ErrorSchema.extend({
  code: z.literal('NOT_FOUND'),
  details: z.object({
    resource: z.string(),
    id: z.string(),
  }),
})

export const UnauthorizedErrorSchema = ErrorSchema.extend({
  code: z.literal('UNAUTHORIZED'),
})

export const ForbiddenErrorSchema = ErrorSchema.extend({
  code: z.literal('FORBIDDEN'),
  details: z.object({
    action: z.string(),
    resource: z.string(),
  }),
})

// ============= Pagination Schemas =============

export const PaginationMetaSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
})

export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  meta: PaginationMetaSchema,
})

// ============= Export all schemas =============

export const API_Schemas = {
  // User schemas
  User: UserSchema,
  CreateUser: CreateUserSchema,
  UpdateUser: UpdateUserSchema,
  Login: LoginSchema,
  UsernameLogin: UsernameLoginSchema,
  AuthResponse: AuthResponseSchema,
  LoginResponse: LoginResponseSchema,
  RefreshToken: RefreshTokenSchema,

  // Note schemas
  Note: NoteSchema,
  CreateNote: CreateNoteSchema,
  UpdateNote: UpdateNoteSchema,
  NoteListQuery: NoteListQuerySchema,

  // Collaboration schemas
  NoteCollaborator: NoteCollaboratorSchema,
  InviteCollaborator: InviteCollaboratorSchema,
  UpdateCollaboratorPermission: UpdateCollaboratorPermissionSchema,

  // YJS schemas
  YjsUpdate: YjsUpdateSchema,
  YjsStateVector: YjsStateVectorSchema,
  NoteSnapshot: NoteSnapshotSchema,

  // Awareness schemas
  UserAwareness: UserAwarenessSchema,
  UpdateAwareness: UpdateAwarenessSchema,

  // Search schemas
  SearchQuery: SearchQuerySchema,
  SearchResult: SearchResultSchema,

  // Activity schemas
  ActivityLog: ActivityLogSchema,
  ActivityQuery: ActivityQuerySchema,

  // Health check schemas
  HealthCheck: HealthCheckSchema,

  // WebSocket schemas
  WebSocketEvent: WebSocketEventSchema,
  NoteJoin: NoteJoinSchema,
  NoteLeave: NoteLeaveSchema,

  // Error schemas
  Error: ErrorSchema,
  ValidationError: ValidationErrorSchema,
  NotFoundError: NotFoundErrorSchema,
  UnauthorizedError: UnauthorizedErrorSchema,
  ForbiddenError: ForbiddenErrorSchema,

  // Pagination schemas
  PaginationMeta: PaginationMetaSchema,
  PaginatedResponse: PaginatedResponseSchema,
} as const

export type API_SchemaTypes = typeof API_Schemas
