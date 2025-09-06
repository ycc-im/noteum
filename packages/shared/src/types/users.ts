/**
 * User-related type definitions for Noteum
 * Includes Logto integration and sync logging
 */

import { TimestampFields, SyncStatus, SyncType } from './database';

// User interface with Logto integration
export interface User extends TimestampFields {
  id: string;
  logto_id: string;
  
  // Synced from Logto
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  logto_updated_at: string | null;
  
  // Application-specific configuration
  settings: Record<string, any>;
  preferences: Record<string, any>;
  
  // Sync status
  sync_status: SyncStatus;
  last_sync_at: string;
}

// User sync log for tracking Logto synchronization
export interface UserSyncLog {
  id: string;
  user_id: string | null;
  sync_type: SyncType;
  logto_data: Record<string, any> | null;
  sync_status: 'success' | 'error';
  error_message: string | null;
  synced_at: string;
}

// User creation input
export interface CreateUserInput {
  logto_id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  logto_updated_at?: string;
  settings?: Record<string, any>;
  preferences?: Record<string, any>;
}

// User update input
export interface UpdateUserInput {
  email?: string;
  name?: string;
  avatar_url?: string;
  logto_updated_at?: string;
  settings?: Record<string, any>;
  preferences?: Record<string, any>;
  sync_status?: SyncStatus;
}

// User profile (public-facing)
export interface UserProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  email: string | null;
}

// User preferences structure
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    mentions?: boolean;
    updates?: boolean;
  };
  editor?: {
    font_size?: number;
    font_family?: string;
    line_height?: number;
    auto_save?: boolean;
    vim_mode?: boolean;
  };
  ui?: {
    sidebar_collapsed?: boolean;
    show_line_numbers?: boolean;
    word_wrap?: boolean;
    minimap?: boolean;
  };
}

// User settings structure
export interface UserSettings {
  privacy?: {
    profile_visible?: boolean;
    notes_searchable?: boolean;
    allow_collaboration?: boolean;
  };
  workspace?: {
    default_workflow?: string;
    auto_backup?: boolean;
    backup_frequency?: 'hourly' | 'daily' | 'weekly';
  };
  integrations?: {
    logto?: {
      auto_sync?: boolean;
      sync_frequency?: number;
    };
    external_services?: Record<string, any>;
  };
}

// Logto user data structure
export interface LogtoUserData {
  id: string;
  username?: string;
  primary_email?: string;
  primary_phone?: string;
  name?: string;
  avatar?: string;
  custom_data?: Record<string, any>;
  identities?: Record<string, any>;
  last_sign_in_at?: number;
  created_at?: number;
  updated_at?: number;
}