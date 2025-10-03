// Base User interface with comprehensive fields
export interface User {
  id: string;
  username: string;
  email: string;

  // Logto integration
  logtoId?: string;
  externalId?: string;

  // Profile information
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;

  // Settings and preferences
  settings: UserSettings;
  preferences: UserPreferences;

  // Account status
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;

  // Subscription and limits
  subscription: 'free' | 'pro' | 'team' | 'enterprise';
  notesLimit: number;
  storageLimit: number; // in MB

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// User settings interface
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;

  // Notification settings
  emailNotifications: boolean;
  pushNotifications: boolean;

  // Privacy settings
  profileVisibility: 'private' | 'public';
  allowCollaboration: boolean;

  // Editor settings
  defaultNoteType: 'text' | 'markdown' | 'code';
  autoSave: boolean;
  autoSaveInterval: number; // in seconds

  // AI settings
  enableAI: boolean;
  aiModel?: string;
}

// User preferences interface
export interface UserPreferences {
  // Layout preferences
  sidebarCollapsed: boolean;
  gridView: boolean;

  // Canvas preferences
  canvasZoom: number;
  canvasPosition: { x: number; y: number };

  // Recent items
  recentNotes: string[];
  recentTags: string[];

  // Custom settings
  customFields?: Record<string, any>;
}

// User statistics interface
export interface UserStats {
  totalNotes: number;
  totalConnections: number;
  totalCollaborations: number;
  storageUsed: number; // in MB
  lastActivityAt: Date;

  // Activity stats
  notesCreatedToday: number;
  notesCreatedThisWeek: number;
  notesCreatedThisMonth: number;
}

// User activity tracking
export interface UserActivity {
  id: string;
  userId: string;
  action:
    | 'login'
    | 'logout'
    | 'create_note'
    | 'update_note'
    | 'delete_note'
    | 'share_note'
    | 'search';
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Collaboration invitation
export interface CollaborationInvite {
  id: string;
  fromUserId: string;
  toUserId: string;
  noteId: string;
  permissions: 'read' | 'write' | 'admin';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

// Repository interface with comprehensive methods
export interface IUsersRepository {
  // Basic CRUD operations
  create(
    userData: Omit<
      User,
      'id' | 'createdAt' | 'updatedAt' | 'settings' | 'preferences'
    > & {
      settings?: Partial<UserSettings>;
      preferences?: Partial<UserPreferences>;
    },
  ): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByLogtoId(logtoId: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(
    id: string,
    updateData: Partial<Omit<User, 'id' | 'createdAt'>>,
  ): Promise<User | null>;
  delete(id: string): Promise<boolean>;

  // Settings management
  updateSettings(
    userId: string,
    settings: Partial<UserSettings>,
  ): Promise<User | null>;
  updatePreferences(
    userId: string,
    preferences: Partial<UserPreferences>,
  ): Promise<User | null>;

  // Authentication and verification
  verifyEmail(userId: string): Promise<boolean>;
  updateLastLogin(userId: string): Promise<void>;

  // Activity tracking
  recordActivity(
    activity: Omit<UserActivity, 'id' | 'timestamp'>,
  ): Promise<UserActivity>;
  getActivity(
    userId: string,
    options?: {
      limit?: number;
      action?: UserActivity['action'];
      since?: Date;
    },
  ): Promise<UserActivity[]>;

  // Statistics
  getUserStats(userId: string): Promise<UserStats>;
  updateStorageUsage(userId: string, sizeChange: number): Promise<void>;

  // Collaboration
  createInvite(
    invite: Omit<CollaborationInvite, 'id' | 'createdAt'>,
  ): Promise<CollaborationInvite>;
  getInvites(
    userId: string,
    status?: CollaborationInvite['status'],
  ): Promise<CollaborationInvite[]>;
  updateInviteStatus(
    inviteId: string,
    status: CollaborationInvite['status'],
  ): Promise<CollaborationInvite | null>;

  // Search and discovery
  searchUsers(
    query: string,
    options?: {
      limit?: number;
      excludeUserIds?: string[];
    },
  ): Promise<User[]>;

  // Admin operations
  listUsers(options?: {
    page?: number;
    limit?: number;
    subscription?: User['subscription'];
    isActive?: boolean;
  }): Promise<{ users: User[]; total: number }>;

  updateSubscription(
    userId: string,
    subscription: User['subscription'],
  ): Promise<User | null>;

  // Bulk operations
  bulkUpdateSettings(
    updates: { userId: string; settings: Partial<UserSettings> }[],
  ): Promise<void>;
}
