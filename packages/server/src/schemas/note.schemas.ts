import { z } from 'zod';
import { ulidSchema, ulidArraySchema } from '@noteum/shared';

// Base schemas for common types
export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const SizeSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});

// Note type enum
export const NoteTypeSchema = z.enum([
  'text',
  'markdown',
  'code',
  'image',
  'link',
  'canvas',
]);

// Note status and permissions
export const NoteStatusSchema = z.enum(['draft', 'published', 'archived']);
export const NotePermissionsSchema = z.enum(['private', 'shared', 'public']);

// Connection type enum
export const ConnectionTypeSchema = z.enum([
  'reference',
  'parent-child',
  'related',
  'custom',
]);

// Main Note schema (for validation of full note objects)
export const NoteSchema = z.object({
  id: ulidSchema,
  title: z.string().min(1).max(500),
  content: z.string(),
  userId: ulidSchema,

  // React Flow compatibility
  type: NoteTypeSchema,
  position: PositionSchema.optional(),
  size: SizeSchema.optional(),
  style: z.record(z.string(), z.any()).optional(),

  // Content and metadata
  tags: z.array(z.string()).default([]),
  embedding: z.array(z.number()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  slots: z.record(z.string(), z.any()).optional(),

  // Hierarchy and connections
  parentId: ulidSchema.optional(),
  children: ulidArraySchema.default([]),
  connections: ulidArraySchema.default([]),

  // Version control
  version: z.number().int().positive(),
  versionHistory: ulidArraySchema.default([]),
  isLatest: z.boolean(),

  // Collaboration and status
  isPublic: z.boolean(),
  permissions: NotePermissionsSchema,
  collaborators: ulidArraySchema.default([]),
  status: NoteStatusSchema,

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
  lastAccessedAt: z.date().optional(),
});

// Input schemas for API operations

// Create note input
export const CreateNoteSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string(),
  userId: ulidSchema,
  type: NoteTypeSchema.default('text'),
  position: PositionSchema.optional(),
  size: SizeSchema.optional(),
  style: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).max(20).default([]),
  metadata: z.record(z.string(), z.any()).optional(),
  slots: z.record(z.string(), z.any()).optional(),
  parentId: ulidSchema.optional(),
  isPublic: z.boolean().default(false),
  permissions: NotePermissionsSchema.default('private'),
  collaborators: ulidArraySchema.max(50).default([]),
  status: NoteStatusSchema.default('draft'),
});

// Update note input
export const UpdateNoteSchema = z.object({
  id: ulidSchema,
  title: z.string().min(1).max(500).optional(),
  content: z.string().optional(),
  type: NoteTypeSchema.optional(),
  position: PositionSchema.optional(),
  size: SizeSchema.optional(),
  style: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).max(20).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  slots: z.record(z.string(), z.any()).optional(),
  parentId: ulidSchema.optional(),
  isPublic: z.boolean().optional(),
  permissions: NotePermissionsSchema.optional(),
  collaborators: ulidArraySchema.max(50).optional(),
  status: NoteStatusSchema.optional(),
});

// Query schemas
export const GetNoteByIdSchema = z.object({
  id: ulidSchema,
});

export const GetNotesByUserSchema = z.object({
  userId: ulidSchema,
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  status: NoteStatusSchema.optional(),
  type: NoteTypeSchema.optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
});

export const DeleteNoteSchema = z.object({
  id: ulidSchema,
});

// Search schemas
export const SemanticSearchSchema = z.object({
  query: z.string().min(1).max(1000),
  userId: ulidSchema.optional(),
  limit: z.number().int().min(1).max(50).default(10),
  threshold: z.number().min(0).max(1).default(0.7),
  filters: z
    .object({
      type: NoteTypeSchema.optional(),
      status: NoteStatusSchema.optional(),
      tags: z.array(z.string()).optional(),
      dateFrom: z.date().optional(),
      dateTo: z.date().optional(),
    })
    .optional(),
});

export const FullTextSearchSchema = z.object({
  query: z.string().min(1).max(1000),
  userId: ulidSchema.optional(),
  limit: z.number().int().min(1).max(50).default(10),
  filters: z
    .object({
      type: NoteTypeSchema.optional(),
      status: NoteStatusSchema.optional(),
      tags: z.array(z.string()).optional(),
      dateFrom: z.date().optional(),
      dateTo: z.date().optional(),
    })
    .optional(),
});

// Vector search with embedding array
export const VectorSearchSchema = z.object({
  embedding: z.array(z.number()).length(1536), // OpenAI embedding dimension
  userId: ulidSchema.optional(),
  limit: z.number().int().min(1).max(50).default(10),
  threshold: z.number().min(0).max(1).default(0.7),
  filters: z
    .object({
      type: NoteTypeSchema.optional(),
      status: NoteStatusSchema.optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
});

// Version management schemas
export const CreateVersionSchema = z.object({
  noteId: ulidSchema,
  version: z.number().int().positive(),
  title: z.string().min(1).max(500),
  content: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
  createdBy: ulidSchema,
});

export const GetVersionsSchema = z.object({
  noteId: ulidSchema,
});

export const GetVersionSchema = z.object({
  noteId: ulidSchema,
  version: z.number().int().positive(),
});

export const RevertToVersionSchema = z.object({
  noteId: ulidSchema,
  version: z.number().int().positive(),
});

// Position and React Flow schemas
export const UpdatePositionSchema = z.object({
  id: ulidSchema,
  position: PositionSchema,
});

export const UpdateSizeSchema = z.object({
  id: ulidSchema,
  size: SizeSchema,
});

// Connection schemas
export const CreateConnectionSchema = z.object({
  sourceId: ulidSchema,
  targetId: ulidSchema,
  type: ConnectionTypeSchema,
  label: z.string().max(100).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const GetConnectionsSchema = z.object({
  noteId: ulidSchema,
});

export const DeleteConnectionSchema = z.object({
  connectionId: ulidSchema,
});

// Bulk operation schemas
export const BulkCreateNotesSchema = z.object({
  notes: z.array(CreateNoteSchema).min(1).max(100),
});

export const BulkUpdateNotesSchema = z.object({
  updates: z
    .array(
      z.object({
        id: ulidSchema,
        data: UpdateNoteSchema.omit({ id: true }),
      }),
    )
    .min(1)
    .max(100),
});

export const BulkDeleteNotesSchema = z.object({
  ids: ulidArraySchema.min(1).max(100),
});

// Advanced query schemas
export const GetNotesByTagsSchema = z.object({
  tags: z.array(z.string()).min(1).max(10),
  userId: ulidSchema.optional(),
  limit: z.number().int().min(1).max(100).default(10),
});

export const GetRecentNotesSchema = z.object({
  userId: ulidSchema,
  limit: z.number().int().min(1).max(50).default(10),
});

export const GetPopularNotesSchema = z.object({
  userId: ulidSchema.optional(),
  limit: z.number().int().min(1).max(50).default(10),
  timeframe: z.enum(['day', 'week', 'month', 'year']).default('week'),
});

export const GetSimilarNotesSchema = z.object({
  noteId: ulidSchema,
  limit: z.number().int().min(1).max(20).default(5),
});

// Activity tracking schemas
export const RecordActivitySchema = z.object({
  noteId: ulidSchema,
  userId: ulidSchema,
  action: z.enum(['created', 'updated', 'viewed', 'shared', 'deleted']),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const GetActivitySchema = z.object({
  noteId: ulidSchema,
  limit: z.number().int().min(1).max(100).default(50),
});

// Export/Import schemas
export const ExportNotesSchema = z.object({
  userId: ulidSchema,
  format: z.enum(['json', 'markdown', 'csv']),
  filters: z
    .object({
      status: NoteStatusSchema.optional(),
      type: NoteTypeSchema.optional(),
      tags: z.array(z.string()).optional(),
      dateFrom: z.date().optional(),
      dateTo: z.date().optional(),
    })
    .optional(),
});

export const ImportNotesSchema = z.object({
  userId: ulidSchema,
  data: z.string().min(1),
  format: z.enum(['json', 'markdown']),
  options: z
    .object({
      overwrite: z.boolean().default(false),
      preserveIds: z.boolean().default(false),
      defaultStatus: NoteStatusSchema.default('draft'),
    })
    .optional(),
});

// Response schemas
export const PaginatedNotesResponseSchema = z.object({
  items: z.array(NoteSchema),
  total: z.number().int(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const SearchResultSchema = z.object({
  note: NoteSchema,
  score: z.number().min(0).max(1),
  highlights: z.array(z.string()).optional(),
});

export const SearchResultsResponseSchema = z.object({
  results: z.array(SearchResultSchema),
  total: z.number().int(),
  query: z.string(),
  executionTime: z.number().positive(),
});

export const BulkOperationResultSchema = z.object({
  successful: ulidArraySchema,
  failed: z.array(
    z.object({
      id: ulidSchema,
      error: z.string(),
    }),
  ),
  total: z.number().int(),
});

// Type exports for TypeScript
export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
export type SemanticSearchInput = z.infer<typeof SemanticSearchSchema>;
export type FullTextSearchInput = z.infer<typeof FullTextSearchSchema>;
export type VectorSearchInput = z.infer<typeof VectorSearchSchema>;
export type BulkCreateNotesInput = z.infer<typeof BulkCreateNotesSchema>;
export type ExportNotesInput = z.infer<typeof ExportNotesSchema>;
export type ImportNotesInput = z.infer<typeof ImportNotesSchema>;
