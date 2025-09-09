import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

// Initialize tRPC
const t = initTRPC.create();

// Export router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// User schemas
const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

const UpdateUserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
});

// Note schemas
const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const CreateNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  userId: z.string(),
});

const UpdateNoteSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  content: z.string().optional(),
});

// User router
export const userRouter = router({
  // Create user
  create: publicProcedure
    .input(CreateUserSchema)
    .mutation(async ({ input }) => {
      // Mock implementation
      const user = {
        id: `user_${Date.now()}`,
        email: input.email,
        name: input.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return user;
    }),

  // Get user by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Mock implementation
      const user = {
        id: input.id,
        email: 'mock@example.com',
        name: 'Mock User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return user;
    }),

  // Update user
  update: publicProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ input }) => {
      // Mock implementation
      const user = {
        id: input.id,
        email: input.email || 'mock@example.com',
        name: input.name || 'Mock User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return user;
    }),

  // Delete user
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Mock implementation
      return { success: true, id: input.id };
    }),

  // List users
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
      }),
    )
    .query(async ({ input }) => {
      // Mock implementation
      const users = [
        {
          id: 'user_1',
          email: 'user1@example.com',
          name: 'User 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'user_2',
          email: 'user2@example.com',
          name: 'User 2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return {
        users,
        total: users.length,
        limit: input.limit || 10,
        offset: input.offset || 0,
      };
    }),

  // Authenticate user
  authenticate: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      // Mock implementation
      if (
        input.email === 'admin@example.com' &&
        input.password === 'password'
      ) {
        return {
          success: true,
          user: {
            id: 'user_admin',
            email: input.email,
            name: 'Admin User',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock_jwt_token_123',
        };
      }

      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }),
});

// Note router
export const noteRouter = router({
  // Create note
  create: publicProcedure
    .input(CreateNoteSchema)
    .mutation(async ({ input }) => {
      // Mock implementation
      const note = {
        id: `note_${Date.now()}`,
        title: input.title,
        content: input.content,
        userId: input.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return note;
    }),

  // Get note by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Mock implementation
      const note = {
        id: input.id,
        title: 'Mock Note',
        content: 'This is a mock note content.',
        userId: 'user_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return note;
    }),

  // Update note
  update: publicProcedure
    .input(UpdateNoteSchema)
    .mutation(async ({ input }) => {
      // Mock implementation
      const note = {
        id: input.id,
        title: input.title || 'Updated Note',
        content: input.content || 'Updated content',
        userId: 'user_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return note;
    }),

  // Delete note
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Mock implementation
      return { success: true, id: input.id };
    }),

  // List notes for user
  listByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
      }),
    )
    .query(async ({ input }) => {
      // Mock implementation
      const notes = [
        {
          id: 'note_1',
          title: 'First Note',
          content: 'Content of the first note.',
          userId: input.userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'note_2',
          title: 'Second Note',
          content: 'Content of the second note.',
          userId: input.userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return {
        notes,
        total: notes.length,
        limit: input.limit || 10,
        offset: input.offset || 0,
      };
    }),

  // Search notes
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        userId: z.string().optional(),
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
      }),
    )
    .query(async ({ input }) => {
      // Mock implementation
      const notes = [
        {
          id: 'note_search_1',
          title: `Note matching "${input.query}"`,
          content: `This note contains the search term: ${input.query}`,
          userId: input.userId || 'user_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return {
        notes,
        total: notes.length,
        query: input.query,
        limit: input.limit || 10,
        offset: input.offset || 0,
      };
    }),
});

// Main app router
export const appRouter = router({
  user: userRouter,
  note: noteRouter,

  // Health check
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })),
});

export type AppRouter = typeof appRouter;
