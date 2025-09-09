/**
 * Note-related type definitions for Noteum
 * Includes notes, versions, connections, and workflow types
 */

import {
  Vector,
  TimestampFields,
  SlotsConfig,
  NodeType,
  ConnectionType,
  ChangeType,
} from "./database";

// Base note interface
export interface Note extends TimestampFields {
  id: string;
  user_id: string;

  // Basic information
  title: string;
  content: string | null;
  content_vector: Vector | null;

  // React Flow compatibility
  node_type: NodeType;
  position_x: number;
  position_y: number;

  // Slots system for connections
  slots: SlotsConfig;

  // Metadata and styling
  metadata: Record<string, any>;

  // Version control
  current_version: number;
}

// Note version history
export interface NoteVersion {
  id: string;
  note_id: string;
  version_number: number;

  // Versioned content
  title: string;
  content: string | null;
  content_vector: Vector | null;
  position_x: number | null;
  position_y: number | null;
  slots: SlotsConfig | null;
  metadata: Record<string, any>;

  // Change information
  change_summary: Record<string, any>;
  change_reason: string | null;
  change_type: ChangeType;

  // Creation info
  created_by: string;
  created_at: string;
}

// Note connections (React Flow Edge compatible)
export interface NoteConnection extends Omit<TimestampFields, "updated_at"> {
  id: string;

  // React Flow Edge compatibility
  source_note_id: string;
  target_note_id: string;
  source_slot: string;
  target_slot: string;

  // Connection properties
  connection_type: ConnectionType;
  label: string | null;
  metadata: Record<string, any>;

  // Weight and priority
  weight: number;
  priority: number;
  is_active: boolean;
}

// Tags
export interface Tag extends TimestampFields {
  id: string;
  user_id: string;
  name: string;
  color: string;
  description: string | null;
  metadata: Record<string, any>;
}

// Note-tag association
export interface NoteTag {
  note_id: string;
  tag_id: string;
  created_at: string;
}

// Workflows
export interface Workflow extends TimestampFields {
  id: string;
  user_id: string;
  name: string;
  description: string | null;

  // View settings
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  settings: Record<string, any>;

  is_template: boolean;
  is_shared: boolean;
}

// Workflow-note association
export interface WorkflowNote {
  workflow_id: string;
  note_id: string;
  added_at: string;
  display_order: number | null;
}

// React Flow compatible node type
export interface FlowNode {
  id: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  data: {
    title: string;
    content: string | null;
    slots: SlotsConfig;
    metadata: Record<string, any>;
    note_id: string;
  };
}

// React Flow compatible edge type
export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type?: ConnectionType;
  label?: string;
  data?: {
    connection_id: string;
    weight: number;
    priority: number;
    is_active: boolean;
    metadata: Record<string, any>;
  };
}

// Note creation input
export interface CreateNoteInput {
  title: string;
  content?: string;
  node_type?: NodeType;
  position_x?: number;
  position_y?: number;
  slots?: Partial<SlotsConfig>;
  metadata?: Record<string, any>;
}

// Note update input
export interface UpdateNoteInput {
  title?: string;
  content?: string;
  node_type?: NodeType;
  position_x?: number;
  position_y?: number;
  slots?: Partial<SlotsConfig>;
  metadata?: Record<string, any>;
}

// Connection creation input
export interface CreateConnectionInput {
  source_note_id: string;
  target_note_id: string;
  source_slot: string;
  target_slot: string;
  connection_type?: ConnectionType;
  label?: string;
  metadata?: Record<string, any>;
  weight?: number;
  priority?: number;
}
