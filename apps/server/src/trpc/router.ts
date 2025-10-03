import { router, publicProcedure } from './trpc';
import { notesRouter } from '../notes/notes.router';
import { usersRouter } from '../users/users.router';

// Main application router that combines all sub-routers
export const appRouter = router({
  // Notes functionality
  notes: notesRouter,

  // Users functionality
  users: usersRouter,

  // Health check endpoint
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: 'ok', // In real implementation, check database connection
      redis: 'ok', // In real implementation, check Redis connection
      pgvector: 'ok', // In real implementation, check pgvector extension
    },
  })),

  // System information (for debugging)
  info: publicProcedure.query(() => ({
    name: 'Noteum API',
    description: 'Note-taking application with AI-powered features',
    version: '1.0.0',
    features: [
      'Vector/semantic search',
      'React Flow compatibility',
      'Version control',
      'Real-time collaboration',
      'Logto authentication',
      'Multi-format export/import',
      'Activity tracking',
      'Bulk operations',
    ],
    endpoints: {
      notes: [
        'create',
        'getById',
        'getByUser',
        'update',
        'delete',
        'searchSemantic',
        'searchFullText',
        'searchVector',
        'createVersion',
        'getVersions',
        'getVersion',
        'revertToVersion',
        'updatePosition',
        'updateSize',
        'createConnection',
        'getConnections',
        'deleteConnection',
        'bulkCreate',
        'bulkUpdate',
        'bulkDelete',
        'getByTags',
        'getRecent',
        'getPopular',
        'getSimilar',
        'recordActivity',
        'getActivity',
        'export',
        'import',
      ],
      users: [
        'create',
        'getById',
        'getByLogtoId',
        'getByUsername',
        'getByEmail',
        'update',
        'delete',
        'updateSettings',
        'updatePreferences',
        'verifyEmail',
        'updateLastLogin',
        'recordActivity',
        'getActivity',
        'getStats',
        'updateStorageUsage',
        'createInvite',
        'getInvites',
        'updateInviteStatus',
        'search',
        'list',
        'updateSubscription',
        'bulkUpdateSettings',
        'login',
        'updateProfile',
        'changePassword',
        'resetPassword',
      ],
    },
  })),
});

// Export the type definition for the router
export type AppRouter = typeof appRouter;
