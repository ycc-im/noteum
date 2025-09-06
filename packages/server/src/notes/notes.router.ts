import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc/trpc';
import { NotesRepository } from '../repositories/notes.repository';
import {
  CreateNoteSchema,
  UpdateNoteSchema,
  GetNoteByIdSchema,
  GetNotesByUserSchema,
  DeleteNoteSchema,
  SemanticSearchSchema,
  FullTextSearchSchema,
  VectorSearchSchema,
  CreateVersionSchema,
  GetVersionsSchema,
  GetVersionSchema,
  RevertToVersionSchema,
  UpdatePositionSchema,
  UpdateSizeSchema,
  CreateConnectionSchema,
  GetConnectionsSchema,
  DeleteConnectionSchema,
  BulkCreateNotesSchema,
  BulkUpdateNotesSchema,
  BulkDeleteNotesSchema,
  GetNotesByTagsSchema,
  GetRecentNotesSchema,
  GetPopularNotesSchema,
  GetSimilarNotesSchema,
  RecordActivitySchema,
  GetActivitySchema,
  ExportNotesSchema,
  ImportNotesSchema,
} from '../schemas/note.schemas';

// Initialize repository
const notesRepository = new NotesRepository();

export const notesRouter = router({
  // Basic CRUD Operations
  create: publicProcedure
    .input(CreateNoteSchema)
    .mutation(async ({ input }) => {
      try {
        const note = await notesRepository.create({
          ...input,
          children: [],
          connections: [],
          versionHistory: []
        });
        
        // Record activity
        await notesRepository.recordActivity({
          noteId: note.id,
          userId: input.userId,
          action: 'created',
          metadata: { title: note.title, type: note.type },
        });
        
        return note;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create note',
          cause: error,
        });
      }
    }),

  getById: publicProcedure
    .input(GetNoteByIdSchema)
    .query(async ({ input }) => {
      try {
        const note = await notesRepository.findById(input.id);
        
        if (!note) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Note not found',
          });
        }
        
        // Record view activity
        await notesRepository.recordActivity({
          noteId: note.id,
          userId: note.userId,
          action: 'viewed',
        });
        
        return note;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get note',
          cause: error,
        });
      }
    }),

  getByUser: publicProcedure
    .input(GetNotesByUserSchema)
    .query(async ({ input }) => {
      try {
        const result = await notesRepository.findByUserId(input.userId, {
          page: input.page,
          limit: input.limit,
          status: input.status,
          type: input.type,
        });
        
        return result;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get notes',
          cause: error,
        });
      }
    }),

  update: publicProcedure
    .input(UpdateNoteSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;
        const note = await notesRepository.update(id, updateData);
        
        if (!note) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Note not found or access denied',
          });
        }
        
        // Record activity
        await notesRepository.recordActivity({
          noteId: note.id,
          userId: note.userId,
          action: 'updated',
          metadata: { changes: Object.keys(updateData) },
        });
        
        return note;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update note',
          cause: error,
        });
      }
    }),

  delete: publicProcedure
    .input(DeleteNoteSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await notesRepository.delete(input.id);
        
        if (!success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Note not found or access denied',
          });
        }
        
        return { success, id: input.id };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete note',
          cause: error,
        });
      }
    }),

  // Vector/Semantic Search Operations
  searchSemantic: publicProcedure
    .input(SemanticSearchSchema)
    .query(async ({ input }) => {
      try {
        const results = await notesRepository.searchSemantic(input.query, {
          userId: input.userId,
          limit: input.limit,
          threshold: input.threshold,
          filters: input.filters,
        });
        
        return {
          results,
          query: input.query,
          total: results.length,
          executionTime: Date.now(), // In real implementation, measure actual time
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Semantic search failed',
          cause: error,
        });
      }
    }),

  searchFullText: publicProcedure
    .input(FullTextSearchSchema)
    .query(async ({ input }) => {
      try {
        const results = await notesRepository.searchFullText(input.query, {
          userId: input.userId,
          limit: input.limit,
          filters: input.filters,
        });
        
        return {
          results,
          query: input.query,
          total: results.length,
          executionTime: Date.now(),
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Full-text search failed',
          cause: error,
        });
      }
    }),

  searchVector: publicProcedure
    .input(VectorSearchSchema)
    .query(async ({ input }) => {
      try {
        const results = await notesRepository.searchSemantic(input.embedding, {
          userId: input.userId,
          limit: input.limit,
          threshold: input.threshold,
          filters: input.filters,
        });
        
        return {
          results,
          total: results.length,
          executionTime: Date.now(),
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Vector search failed',
          cause: error,
        });
      }
    }),

  // Version Management
  createVersion: publicProcedure
    .input(CreateVersionSchema)
    .mutation(async ({ input }) => {
      try {
        const version = await notesRepository.createVersion(input.noteId, {
          noteId: input.noteId,
          version: input.version,
          title: input.title,
          content: input.content,
          metadata: input.metadata,
          createdBy: input.createdBy,
        });
        
        return version;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create version',
          cause: error,
        });
      }
    }),

  getVersions: publicProcedure
    .input(GetVersionsSchema)
    .query(async ({ input }) => {
      try {
        const versions = await notesRepository.getVersions(input.noteId);
        return versions;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get versions',
          cause: error,
        });
      }
    }),

  getVersion: publicProcedure
    .input(GetVersionSchema)
    .query(async ({ input }) => {
      try {
        const version = await notesRepository.getVersion(input.noteId, input.version);
        
        if (!version) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Version not found',
          });
        }
        
        return version;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get version',
          cause: error,
        });
      }
    }),

  revertToVersion: publicProcedure
    .input(RevertToVersionSchema)
    .mutation(async ({ input }) => {
      try {
        const note = await notesRepository.revertToVersion(input.noteId, input.version);
        
        if (!note) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Note or version not found',
          });
        }
        
        // Record activity
        await notesRepository.recordActivity({
          noteId: note.id,
          userId: note.userId,
          action: 'updated',
          metadata: { action: 'revert', version: input.version },
        });
        
        return note;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to revert to version',
          cause: error,
        });
      }
    }),

  // React Flow Position and Size Operations
  updatePosition: publicProcedure
    .input(UpdatePositionSchema)
    .mutation(async ({ input }) => {
      try {
        const note = await notesRepository.updatePosition(input.id, input.position);
        
        if (!note) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Note not found',
          });
        }
        
        return note;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update position',
          cause: error,
        });
      }
    }),

  updateSize: publicProcedure
    .input(UpdateSizeSchema)
    .mutation(async ({ input }) => {
      try {
        const note = await notesRepository.updateSize(input.id, input.size);
        
        if (!note) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Note not found',
          });
        }
        
        return note;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update size',
          cause: error,
        });
      }
    }),

  // Connection Management
  createConnection: publicProcedure
    .input(CreateConnectionSchema)
    .mutation(async ({ input }) => {
      try {
        const connection = await notesRepository.createConnection(input);
        return connection;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create connection',
          cause: error,
        });
      }
    }),

  getConnections: publicProcedure
    .input(GetConnectionsSchema)
    .query(async ({ input }) => {
      try {
        const connections = await notesRepository.getConnections(input.noteId);
        return connections;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get connections',
          cause: error,
        });
      }
    }),

  deleteConnection: publicProcedure
    .input(DeleteConnectionSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await notesRepository.deleteConnection(input.connectionId);
        
        if (!success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Connection not found',
          });
        }
        
        return { success, id: input.connectionId };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete connection',
          cause: error,
        });
      }
    }),

  // Bulk Operations
  bulkCreate: publicProcedure
    .input(BulkCreateNotesSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await notesRepository.bulkCreate(
          input.notes.map(note => ({
            ...note,
            children: [],
            connections: [],
            versionHistory: []
          }))
        );
        return result;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Bulk create operation failed',
          cause: error,
        });
      }
    }),

  bulkUpdate: publicProcedure
    .input(BulkUpdateNotesSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await notesRepository.bulkUpdate(input.updates);
        return result;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Bulk update operation failed',
          cause: error,
        });
      }
    }),

  bulkDelete: publicProcedure
    .input(BulkDeleteNotesSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await notesRepository.bulkDelete(input.ids);
        return result;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Bulk delete operation failed',
          cause: error,
        });
      }
    }),

  // Advanced Query Operations
  getByTags: publicProcedure
    .input(GetNotesByTagsSchema)
    .query(async ({ input }) => {
      try {
        const notes = await notesRepository.findByTags(input.tags, input.userId);
        return notes;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get notes by tags',
          cause: error,
        });
      }
    }),

  getRecent: publicProcedure
    .input(GetRecentNotesSchema)
    .query(async ({ input }) => {
      try {
        const notes = await notesRepository.findRecent(input.userId, input.limit);
        return notes;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get recent notes',
          cause: error,
        });
      }
    }),

  getPopular: publicProcedure
    .input(GetPopularNotesSchema)
    .query(async ({ input }) => {
      try {
        const notes = await notesRepository.findPopular(input.userId, input.limit);
        return notes;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get popular notes',
          cause: error,
        });
      }
    }),

  getSimilar: publicProcedure
    .input(GetSimilarNotesSchema)
    .query(async ({ input }) => {
      try {
        const notes = await notesRepository.findSimilar(input.noteId, input.limit);
        return notes;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get similar notes',
          cause: error,
        });
      }
    }),

  // Activity Tracking
  recordActivity: publicProcedure
    .input(RecordActivitySchema)
    .mutation(async ({ input }) => {
      try {
        const activity = await notesRepository.recordActivity(input);
        return activity;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to record activity',
          cause: error,
        });
      }
    }),

  getActivity: publicProcedure
    .input(GetActivitySchema)
    .query(async ({ input }) => {
      try {
        const activities = await notesRepository.getActivity(input.noteId, input.limit);
        return activities;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get activity',
          cause: error,
        });
      }
    }),

  // Export/Import Operations
  export: publicProcedure
    .input(ExportNotesSchema)
    .query(async ({ input }) => {
      try {
        const data = await notesRepository.exportNotes(input.userId, input.format);
        return {
          data,
          format: input.format,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Export operation failed',
          cause: error,
        });
      }
    }),

  import: publicProcedure
    .input(ImportNotesSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await notesRepository.importNotes(input.userId, input.data, input.format);
        return result;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Import operation failed',
          cause: error,
        });
      }
    }),
});