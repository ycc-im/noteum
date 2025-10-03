import { z } from 'zod';
import { ulidSchema, ulidArraySchema } from '@noteum/shared';

// Enum schemas
export const SubscriptionSchema = z.enum(['free', 'pro', 'team', 'enterprise']);
export const ThemeSchema = z.enum(['light', 'dark', 'system']);
export const ProfileVisibilitySchema = z.enum(['private', 'public']);
export const NoteTypeSchema = z.enum(['text', 'markdown', 'code']);
export const InviteStatusSchema = z.enum([
  'pending',
  'accepted',
  'declined',
  'expired',
]);
export const InvitePermissionsSchema = z.enum(['read', 'write', 'admin']);
export const UserActivityActionSchema = z.enum([
  'login',
  'logout',
  'create_note',
  'update_note',
  'delete_note',
  'share_note',
  'search',
]);

// Settings schemas
export const UserSettingsSchema = z.object({
  theme: ThemeSchema,
  language: z.string().min(2).max(5),
  timezone: z.string(),

  // Notification settings
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),

  // Privacy settings
  profileVisibility: ProfileVisibilitySchema,
  allowCollaboration: z.boolean(),

  // Editor settings
  defaultNoteType: NoteTypeSchema,
  autoSave: z.boolean(),
  autoSaveInterval: z.number().int().min(10).max(300), // 10s to 5min

  // AI settings
  enableAI: z.boolean(),
  aiModel: z.string().optional(),
});

export const UserPreferencesSchema = z.object({
  // Layout preferences
  sidebarCollapsed: z.boolean(),
  gridView: z.boolean(),

  // Canvas preferences
  canvasZoom: z.number().min(0.1).max(5.0),
  canvasPosition: z.object({
    x: z.number(),
    y: z.number(),
  }),

  // Recent items
  recentNotes: ulidArraySchema.max(50),
  recentTags: z.array(z.string()).max(20),

  // Custom settings
  customFields: z.record(z.string(), z.any()).optional(),
});

// Main User schema
export const UserSchema = z.object({
  id: ulidSchema,
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),

  // Logto integration
  logtoId: z.string().optional(),
  externalId: z.string().optional(),

  // Profile information
  displayName: z.string().max(100).optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),

  // Settings and preferences
  settings: UserSettingsSchema,
  preferences: UserPreferencesSchema,

  // Account status
  isEmailVerified: z.boolean(),
  isActive: z.boolean(),
  lastLoginAt: z.date().optional(),

  // Subscription and limits
  subscription: SubscriptionSchema,
  notesLimit: z.number().int(),
  storageLimit: z.number().int(), // in MB

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input schemas for API operations

// Create user input
export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  logtoId: z.string().optional(),
  externalId: z.string().optional(),
  displayName: z.string().max(100).optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  subscription: SubscriptionSchema.default('free'),
  settings: UserSettingsSchema.partial().optional(),
  preferences: UserPreferencesSchema.partial().optional(),
});

// Update user input
export const UpdateUserSchema = z.object({
  id: ulidSchema,
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  email: z.string().email().optional(),
  displayName: z.string().max(100).optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
  subscription: SubscriptionSchema.optional(),
});

// Query schemas
export const GetUserByIdSchema = z.object({
  id: ulidSchema,
});

export const GetUserByLogtoIdSchema = z.object({
  logtoId: z.string(),
});

export const GetUserByUsernameSchema = z.object({
  username: z.string().min(3).max(30),
});

export const GetUserByEmailSchema = z.object({
  email: z.string().email(),
});

export const DeleteUserSchema = z.object({
  id: ulidSchema,
});

// Settings management schemas
export const UpdateUserSettingsSchema = z.object({
  userId: ulidSchema,
  settings: UserSettingsSchema.partial(),
});

export const UpdateUserPreferencesSchema = z.object({
  userId: ulidSchema,
  preferences: UserPreferencesSchema.partial(),
});

// Authentication schemas
export const VerifyEmailSchema = z.object({
  userId: ulidSchema,
});

export const UpdateLastLoginSchema = z.object({
  userId: ulidSchema,
});

// Activity tracking schemas
export const RecordUserActivitySchema = z.object({
  userId: ulidSchema,
  action: UserActivityActionSchema,
  resourceId: ulidSchema.optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  ipAddress: z
    .string()
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    )
    .optional(),
  userAgent: z.string().optional(),
});

export const GetUserActivitySchema = z.object({
  userId: ulidSchema,
  limit: z.number().int().min(1).max(100).default(50),
  action: UserActivityActionSchema.optional(),
  since: z.date().optional(),
});

// Statistics schemas
export const GetUserStatsSchema = z.object({
  userId: ulidSchema,
});

export const UpdateStorageUsageSchema = z.object({
  userId: ulidSchema,
  sizeChange: z.number(), // Can be positive or negative
});

// Collaboration schemas
export const CreateInviteSchema = z.object({
  fromUserId: ulidSchema,
  toUserId: ulidSchema,
  noteId: ulidSchema,
  permissions: InvitePermissionsSchema,
  expiresAt: z.date(),
});

export const GetInvitesSchema = z.object({
  userId: ulidSchema,
  status: InviteStatusSchema.optional(),
});

export const UpdateInviteStatusSchema = z.object({
  inviteId: ulidSchema,
  status: InviteStatusSchema,
});

// Search schemas
export const SearchUsersSchema = z.object({
  query: z.string().min(1).max(100),
  limit: z.number().int().min(1).max(50).default(10),
  excludeUserIds: ulidArraySchema.optional(),
});

// Admin operations schemas
export const ListUsersSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  subscription: SubscriptionSchema.optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

export const UpdateSubscriptionSchema = z.object({
  userId: ulidSchema,
  subscription: SubscriptionSchema,
});

// Bulk operations schemas
export const BulkUpdateSettingsSchema = z.object({
  updates: z
    .array(
      z.object({
        userId: ulidSchema,
        settings: UserSettingsSchema.partial(),
      }),
    )
    .min(1)
    .max(100),
});

// Response schemas
export const UserStatsSchema = z.object({
  totalNotes: z.number().int().nonnegative(),
  totalConnections: z.number().int().nonnegative(),
  totalCollaborations: z.number().int().nonnegative(),
  storageUsed: z.number().int().nonnegative(),
  lastActivityAt: z.date(),
  notesCreatedToday: z.number().int().nonnegative(),
  notesCreatedThisWeek: z.number().int().nonnegative(),
  notesCreatedThisMonth: z.number().int().nonnegative(),
});

export const UserActivitySchema = z.object({
  id: ulidSchema,
  userId: ulidSchema,
  action: UserActivityActionSchema,
  resourceId: ulidSchema.optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  timestamp: z.date(),
});

export const CollaborationInviteSchema = z.object({
  id: ulidSchema,
  fromUserId: ulidSchema,
  toUserId: ulidSchema,
  noteId: ulidSchema,
  permissions: InvitePermissionsSchema,
  status: InviteStatusSchema,
  createdAt: z.date(),
  expiresAt: z.date(),
});

export const PaginatedUsersResponseSchema = z.object({
  users: z.array(UserSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

// Authentication and session schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  rememberMe: z.boolean().default(false),
});

export const LogtoCallbackSchema = z.object({
  code: z.string(),
  state: z.string().optional(),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const LogoutSchema = z.object({
  userId: ulidSchema,
  sessionId: z.string().optional(),
});

// Profile management schemas
export const UploadAvatarSchema = z.object({
  userId: ulidSchema,
  file: z.any(), // File will be validated by middleware
});

export const UpdateProfileSchema = z.object({
  userId: ulidSchema,
  displayName: z.string().max(100).optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  bio: z.string().max(500).optional(),
});

export const ChangePasswordSchema = z.object({
  userId: ulidSchema,
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6).max(128),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

export const ConfirmPasswordResetSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6).max(128),
});

// Type exports for TypeScript
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateUserSettingsInput = z.infer<typeof UpdateUserSettingsSchema>;
export type UpdateUserPreferencesInput = z.infer<
  typeof UpdateUserPreferencesSchema
>;
export type RecordUserActivityInput = z.infer<typeof RecordUserActivitySchema>;
export type SearchUsersInput = z.infer<typeof SearchUsersSchema>;
export type ListUsersInput = z.infer<typeof ListUsersSchema>;
export type CreateInviteInput = z.infer<typeof CreateInviteSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
