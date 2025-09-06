import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc/trpc';
import { UsersRepository } from '../repositories/users.repository';
import {
  CreateUserSchema,
  UpdateUserSchema,
  GetUserByIdSchema,
  GetUserByLogtoIdSchema,
  GetUserByUsernameSchema,
  GetUserByEmailSchema,
  DeleteUserSchema,
  UpdateUserSettingsSchema,
  UpdateUserPreferencesSchema,
  VerifyEmailSchema,
  UpdateLastLoginSchema,
  RecordUserActivitySchema,
  GetUserActivitySchema,
  GetUserStatsSchema,
  UpdateStorageUsageSchema,
  CreateInviteSchema,
  GetInvitesSchema,
  UpdateInviteStatusSchema,
  SearchUsersSchema,
  ListUsersSchema,
  UpdateSubscriptionSchema,
  BulkUpdateSettingsSchema,
  LoginSchema,
  LogtoCallbackSchema,
  RefreshTokenSchema,
  LogoutSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
  ResetPasswordSchema,
  ConfirmPasswordResetSchema,
} from '../schemas/user.schemas';

// Initialize repository
const usersRepository = new UsersRepository();

export const usersRouter = router({
  // Basic CRUD Operations
  create: publicProcedure
    .input(CreateUserSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if username or email already exists
        const existingUsername = await usersRepository.findByUsername(input.username);
        if (existingUsername) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Username already exists',
          });
        }
        
        const existingEmail = await usersRepository.findByEmail(input.email);
        if (existingEmail) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Email already exists',
          });
        }
        
        const user = await usersRepository.create({
          ...input,
          isEmailVerified: false,
          isActive: true,
          notesLimit: input.subscription === 'free' ? 1000 : 
                     input.subscription === 'pro' ? 10000 :
                     input.subscription === 'team' ? 50000 : 1000000,
          storageLimit: input.subscription === 'free' ? 100 :
                       input.subscription === 'pro' ? 1000 :
                       input.subscription === 'team' ? 5000 : 50000
        });
        
        // Record registration activity
        await usersRepository.recordActivity({
          userId: user.id,
          action: 'login', // First login is registration
          metadata: { source: 'direct_registration' },
        });
        
        // Remove sensitive data from response
        const { settings, preferences, ...safeUser } = user;
        return {
          ...safeUser,
          settings: {
            theme: settings.theme,
            language: settings.language,
            // Only return non-sensitive settings
          },
          preferences: {
            sidebarCollapsed: preferences.sidebarCollapsed,
            gridView: preferences.gridView,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
          cause: error,
        });
      }
    }),

  getById: publicProcedure
    .input(GetUserByIdSchema)
    .query(async ({ input }) => {
      try {
        const user = await usersRepository.findById(input.id);
        
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        
        // Return only public profile information
        return {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
          createdAt: user.createdAt,
          // Only return if profile is public
          ...(user.settings.profileVisibility === 'public' && {
            firstName: user.firstName,
            lastName: user.lastName,
          }),
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get user',
          cause: error,
        });
      }
    }),

  getByLogtoId: publicProcedure
    .input(GetUserByLogtoIdSchema)
    .query(async ({ input }) => {
      try {
        const user = await usersRepository.findByLogtoId(input.logtoId);
        
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        
        return user;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get user by Logto ID',
          cause: error,
        });
      }
    }),

  getByUsername: publicProcedure
    .input(GetUserByUsernameSchema)
    .query(async ({ input }) => {
      try {
        const user = await usersRepository.findByUsername(input.username);
        
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        
        // Return only public profile information
        return {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
          createdAt: user.createdAt,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get user by username',
          cause: error,
        });
      }
    }),

  getByEmail: publicProcedure
    .input(GetUserByEmailSchema)
    .query(async ({ input }) => {
      try {
        const user = await usersRepository.findByEmail(input.email);
        
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        
        return user;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get user by email',
          cause: error,
        });
      }
    }),

  update: publicProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;
        
        // Check if username is taken by another user
        if (updateData.username) {
          const existingUser = await usersRepository.findByUsername(updateData.username);
          if (existingUser && existingUser.id !== id) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Username already taken',
            });
          }
        }
        
        // Check if email is taken by another user
        if (updateData.email) {
          const existingUser = await usersRepository.findByEmail(updateData.email);
          if (existingUser && existingUser.id !== id) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Email already taken',
            });
          }
        }
        
        const user = await usersRepository.update(id, updateData);
        
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        
        return user;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user',
          cause: error,
        });
      }
    }),

  delete: publicProcedure
    .input(DeleteUserSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await usersRepository.delete(input.id);
        
        if (!success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        
        return { success, id: input.id };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete user',
          cause: error,
        });
      }
    }),

  // Settings and Preferences Management
  updateSettings: publicProcedure
    .input(UpdateUserSettingsSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await usersRepository.updateSettings(input.userId, input.settings);
        
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        
        return user.settings;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update settings',
          cause: error,
        });
      }
    }),

  updatePreferences: publicProcedure
    .input(UpdateUserPreferencesSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await usersRepository.updatePreferences(input.userId, input.preferences);
        
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        
        return user.preferences;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update preferences',
          cause: error,
        });
      }
    }),

  // Authentication and Verification
  verifyEmail: publicProcedure
    .input(VerifyEmailSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await usersRepository.verifyEmail(input.userId);
        
        if (!success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        
        return { success };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to verify email',
          cause: error,
        });
      }
    }),

  updateLastLogin: publicProcedure
    .input(UpdateLastLoginSchema)
    .mutation(async ({ input }) => {
      try {
        await usersRepository.updateLastLogin(input.userId);
        
        // Record login activity
        await usersRepository.recordActivity({
          userId: input.userId,
          action: 'login',
        });
        
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update last login',
          cause: error,
        });
      }
    }),

  // Activity Tracking
  recordActivity: publicProcedure
    .input(RecordUserActivitySchema)
    .mutation(async ({ input }) => {
      try {
        const activity = await usersRepository.recordActivity(input);
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
    .input(GetUserActivitySchema)
    .query(async ({ input }) => {
      try {
        const activities = await usersRepository.getActivity(input.userId, {
          limit: input.limit,
          action: input.action,
          since: input.since,
        });
        
        return activities;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get activity',
          cause: error,
        });
      }
    }),

  // Statistics
  getStats: publicProcedure
    .input(GetUserStatsSchema)
    .query(async ({ input }) => {
      try {
        const stats = await usersRepository.getUserStats(input.userId);
        return stats;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get user stats',
          cause: error,
        });
      }
    }),

  updateStorageUsage: publicProcedure
    .input(UpdateStorageUsageSchema)
    .mutation(async ({ input }) => {
      try {
        await usersRepository.updateStorageUsage(input.userId, input.sizeChange);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update storage usage',
          cause: error,
        });
      }
    }),

  // Collaboration
  createInvite: publicProcedure
    .input(CreateInviteSchema)
    .mutation(async ({ input }) => {
      try {
        const invite = await usersRepository.createInvite({
          ...input,
          status: 'pending'
        });
        return invite;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create invite',
          cause: error,
        });
      }
    }),

  getInvites: publicProcedure
    .input(GetInvitesSchema)
    .query(async ({ input }) => {
      try {
        const invites = await usersRepository.getInvites(input.userId, input.status);
        return invites;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get invites',
          cause: error,
        });
      }
    }),

  updateInviteStatus: publicProcedure
    .input(UpdateInviteStatusSchema)
    .mutation(async ({ input }) => {
      try {
        const invite = await usersRepository.updateInviteStatus(input.inviteId, input.status);
        
        if (!invite) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invite not found',
          });
        }
        
        return invite;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update invite status',
          cause: error,
        });
      }
    }),

  // Search and Discovery
  search: publicProcedure
    .input(SearchUsersSchema)
    .query(async ({ input }) => {
      try {
        const users = await usersRepository.searchUsers(input.query, {
          limit: input.limit,
          excludeUserIds: input.excludeUserIds,
        });
        
        // Return only public profile data
        return users.map(user => ({
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
        }));
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User search failed',
          cause: error,
        });
      }
    }),

  // Admin Operations
  list: publicProcedure
    .input(ListUsersSchema)
    .query(async ({ input }) => {
      try {
        const result = await usersRepository.listUsers(input);
        
        return {
          users: result.users,
          total: result.total,
          page: input.page,
          limit: input.limit,
          hasNext: (input.page * input.limit) < result.total,
          hasPrev: input.page > 1,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list users',
          cause: error,
        });
      }
    }),

  updateSubscription: publicProcedure
    .input(UpdateSubscriptionSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await usersRepository.updateSubscription(input.userId, input.subscription);
        
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        
        // Record subscription change activity
        await usersRepository.recordActivity({
          userId: input.userId,
          action: 'update_note', // Generic update action
          metadata: { 
            action: 'subscription_change',
            oldSubscription: user.subscription,
            newSubscription: input.subscription,
          },
        });
        
        return user;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update subscription',
          cause: error,
        });
      }
    }),

  // Bulk Operations
  bulkUpdateSettings: publicProcedure
    .input(BulkUpdateSettingsSchema)
    .mutation(async ({ input }) => {
      try {
        await usersRepository.bulkUpdateSettings(input.updates);
        return { success: true, count: input.updates.length };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Bulk settings update failed',
          cause: error,
        });
      }
    }),

  // Authentication Endpoints (Logto Integration)
  login: publicProcedure
    .input(LoginSchema)
    .mutation(async ({ input }) => {
      try {
        // In real implementation:
        // 1. Verify credentials with Logto
        // 2. Generate JWT token
        // 3. Update last login
        // 4. Return user data and token
        
        const user = await usersRepository.findByEmail(input.email);
        
        if (!user || !user.isActive) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid credentials',
          });
        }
        
        // Update last login
        await usersRepository.updateLastLogin(user.id);
        
        return {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            avatar: user.avatar,
            settings: user.settings,
            preferences: user.preferences,
          },
          token: 'mock_jwt_token', // In real implementation, generate actual JWT
          refreshToken: 'mock_refresh_token',
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Login failed',
          cause: error,
        });
      }
    }),

  // Profile Management
  updateProfile: publicProcedure
    .input(UpdateProfileSchema)
    .mutation(async ({ input }) => {
      try {
        const { userId, ...profileData } = input;
        const user = await usersRepository.update(userId, profileData);
        
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }
        
        return {
          id: user.id,
          displayName: user.displayName,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          avatar: user.avatar,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
          cause: error,
        });
      }
    }),

  // Password Management (if not using Logto exclusively)
  changePassword: publicProcedure
    .input(ChangePasswordSchema)
    .mutation(async ({ input }) => {
      try {
        // In real implementation:
        // 1. Verify current password
        // 2. Hash new password
        // 3. Update password in database
        // 4. Invalidate existing sessions
        
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to change password',
          cause: error,
        });
      }
    }),

  resetPassword: publicProcedure
    .input(ResetPasswordSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await usersRepository.findByEmail(input.email);
        
        if (!user) {
          // Don't reveal if email exists
          return { success: true };
        }
        
        // In real implementation:
        // 1. Generate reset token
        // 2. Store token with expiration
        // 3. Send reset email
        
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to initiate password reset',
          cause: error,
        });
      }
    }),
});