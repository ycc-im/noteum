/**
 * Database type definitions for Noteum
 * Generated from PostgreSQL schema with vector and JSONB support
 */

// Vector type for OpenAI embeddings (1536 dimensions)
export type Vector = number[];

// Common timestamp fields
export interface TimestampFields {
  created_at: string;
  updated_at?: string;
}

// Slot position types for React Flow compatibility
export type SlotPosition = 
  | 'top-left' 
  | 'top' 
  | 'top-right' 
  | 'right' 
  | 'bottom-right' 
  | 'bottom' 
  | 'bottom-left' 
  | 'left';

// Slot configuration
export interface SlotConfig {
  enabled: boolean;
  label: string | null;
  data: Record<string, any>;
  maxConnections: number;
}

// Slots system - 8 connection points
export type SlotsConfig = Record<SlotPosition, SlotConfig>;

// React Flow viewport
export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

// React Flow node types
export type NodeType = 'input' | 'output' | 'default' | 'custom';

// Connection types
export type ConnectionType = 'default' | 'bezier' | 'smoothstep' | 'step' | 'straight';

// Sync status
export type SyncStatus = 'synced' | 'pending' | 'error';

// Change types for versioning
export type ChangeType = 'manual' | 'auto' | 'merge';

// Sync types for logging
export type SyncType = 'create' | 'update' | 'delete';