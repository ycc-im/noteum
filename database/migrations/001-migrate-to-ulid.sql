-- Migration: Convert UUID primary keys to ULID
-- This migration updates the database schema to use ULID instead of UUID
-- ULID provides better performance and sortability than UUID

-- Note: This is a breaking change and should be executed on a fresh database
-- For existing databases with data, a more complex migration strategy would be needed

-- 1. Create extension for generating ULIDs (if not exists)
-- Note: PostgreSQL doesn't have native ULID support, so we'll use CHAR(26) for storage
-- The application layer will generate ULIDs using the TypeScript library

BEGIN;

-- Drop existing schema (only for fresh installations)
-- WARNING: This will delete all data
DROP TABLE IF EXISTS user_sync_log CASCADE;
DROP TABLE IF EXISTS workflow_notes CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS note_connections CASCADE;
DROP TABLE IF EXISTS note_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS note_versions CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Recreate schema with ULID support
-- Note: ULID is stored as CHAR(26) for consistent length and performance
-- Default values are handled in the application layer

-- 1. 用户表（与Logto集成）
CREATE TABLE users (
  id CHAR(26) PRIMARY KEY, -- ULID format: exactly 26 characters
  logto_id VARCHAR(255) UNIQUE NOT NULL,
  
  -- 从Logto同步的基础信息
  email VARCHAR(255),
  name VARCHAR(255),
  avatar_url TEXT,
  logto_updated_at TIMESTAMPTZ,
  
  -- 应用特定配置
  settings JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  
  -- 同步状态
  sync_status VARCHAR(20) DEFAULT 'synced',
  last_sync_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Add constraint to ensure ULID format
  CONSTRAINT users_id_ulid_format CHECK (
    LENGTH(id) = 26 AND 
    id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  )
);

-- 2. 笔记表（React Flow Node兼容 + JSON Slots）
CREATE TABLE notes (
  id CHAR(26) PRIMARY KEY, -- ULID format
  user_id CHAR(26) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 基本信息
  title TEXT NOT NULL,
  content TEXT,
  content_vector vector(1536), -- OpenAI embedding维度
  
  -- React Flow 兼容字段
  node_type VARCHAR(50) DEFAULT 'default', -- 'input', 'output', 'default', 'custom'
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  
  -- Slots系统（JSON格式）
  slots JSONB DEFAULT '{
    "top-left": {"enabled": true, "label": null, "data": {}, "maxConnections": 1},
    "top": {"enabled": true, "label": null, "data": {}, "maxConnections": 1},
    "top-right": {"enabled": true, "label": null, "data": {}, "maxConnections": 1},
    "right": {"enabled": true, "label": null, "data": {}, "maxConnections": 1},
    "bottom-right": {"enabled": true, "label": null, "data": {}, "maxConnections": 1},
    "bottom": {"enabled": true, "label": null, "data": {}, "maxConnections": 1},
    "bottom-left": {"enabled": true, "label": null, "data": {}, "maxConnections": 1},
    "left": {"enabled": true, "label": null, "data": {}, "maxConnections": 1}
  }',
  
  -- 元数据和样式
  metadata JSONB DEFAULT '{}', -- 自定义属性、样式、React Flow props等
  
  -- 版本控制
  current_version INTEGER DEFAULT 1,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- ULID format constraint
  CONSTRAINT notes_id_ulid_format CHECK (
    LENGTH(id) = 26 AND 
    id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  ),
  CONSTRAINT notes_user_id_ulid_format CHECK (
    LENGTH(user_id) = 26 AND 
    user_id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  )
);

-- 3. 笔记版本历史表
CREATE TABLE note_versions (
  id CHAR(26) PRIMARY KEY, -- ULID format
  note_id CHAR(26) NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  
  -- 版本化的内容
  title TEXT NOT NULL,
  content TEXT,
  content_vector vector(1536),
  position_x FLOAT,
  position_y FLOAT,
  slots JSONB,
  metadata JSONB DEFAULT '{}',
  
  -- 变更信息
  change_summary JSONB DEFAULT '{}', -- 描述具体变更
  change_reason TEXT, -- 版本创建原因
  change_type VARCHAR(20) DEFAULT 'manual', -- 'manual', 'auto', 'merge'
  
  -- 创建信息
  created_by CHAR(26) NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(note_id, version_number),
  
  -- ULID format constraints
  CONSTRAINT note_versions_id_ulid_format CHECK (
    LENGTH(id) = 26 AND 
    id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  ),
  CONSTRAINT note_versions_note_id_ulid_format CHECK (
    LENGTH(note_id) = 26 AND 
    note_id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  ),
  CONSTRAINT note_versions_created_by_ulid_format CHECK (
    LENGTH(created_by) = 26 AND 
    created_by ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  )
);

-- 4. 标签表
CREATE TABLE tags (
  id CHAR(26) PRIMARY KEY, -- ULID format
  user_id CHAR(26) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#6366f1', -- hex color
  description TEXT,
  metadata JSONB DEFAULT '{}', -- 图标、分类等
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, name),
  
  -- ULID format constraints
  CONSTRAINT tags_id_ulid_format CHECK (
    LENGTH(id) = 26 AND 
    id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  ),
  CONSTRAINT tags_user_id_ulid_format CHECK (
    LENGTH(user_id) = 26 AND 
    user_id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  )
);

-- 5. 笔记标签关联表
CREATE TABLE note_tags (
  note_id CHAR(26) NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag_id CHAR(26) NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (note_id, tag_id),
  
  -- ULID format constraints
  CONSTRAINT note_tags_note_id_ulid_format CHECK (
    LENGTH(note_id) = 26 AND 
    note_id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  ),
  CONSTRAINT note_tags_tag_id_ulid_format CHECK (
    LENGTH(tag_id) = 26 AND 
    tag_id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  )
);

-- 6. 笔记连接表（React Flow Edge兼容）
CREATE TABLE note_connections (
  id CHAR(26) PRIMARY KEY, -- ULID format
  
  -- React Flow Edge 兼容字段
  source_note_id CHAR(26) NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  target_note_id CHAR(26) NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  source_slot VARCHAR(20) NOT NULL, -- 'top-left', 'top', etc.
  target_slot VARCHAR(20) NOT NULL,
  
  -- 连接属性
  connection_type VARCHAR(50) DEFAULT 'default',
  label TEXT,
  metadata JSONB DEFAULT '{}', -- 样式、动画、React Flow edge props等
  
  -- 权重和优先级
  weight FLOAT DEFAULT 1.0,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 防止重复连接
  UNIQUE(source_note_id, source_slot, target_note_id, target_slot),
  
  -- ULID format constraints
  CONSTRAINT note_connections_id_ulid_format CHECK (
    LENGTH(id) = 26 AND 
    id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  ),
  CONSTRAINT note_connections_source_note_id_ulid_format CHECK (
    LENGTH(source_note_id) = 26 AND 
    source_note_id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  ),
  CONSTRAINT note_connections_target_note_id_ulid_format CHECK (
    LENGTH(target_note_id) = 26 AND 
    target_note_id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  )
);

-- 7. 工作流表（用于组织笔记集合）
CREATE TABLE workflows (
  id CHAR(26) PRIMARY KEY, -- ULID format
  user_id CHAR(26) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- 工作流视图设置
  viewport JSONB DEFAULT '{"x": 0, "y": 0, "zoom": 1}', -- React Flow viewport
  settings JSONB DEFAULT '{}', -- 网格、背景等设置
  
  is_template BOOLEAN DEFAULT FALSE,
  is_shared BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- ULID format constraints
  CONSTRAINT workflows_id_ulid_format CHECK (
    LENGTH(id) = 26 AND 
    id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  ),
  CONSTRAINT workflows_user_id_ulid_format CHECK (
    LENGTH(user_id) = 26 AND 
    user_id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  )
);

-- 工作流中的笔记关联
CREATE TABLE workflow_notes (
  workflow_id CHAR(26) NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  note_id CHAR(26) NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  display_order INTEGER, -- 在工作流中的显示顺序
  
  PRIMARY KEY (workflow_id, note_id),
  
  -- ULID format constraints
  CONSTRAINT workflow_notes_workflow_id_ulid_format CHECK (
    LENGTH(workflow_id) = 26 AND 
    workflow_id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  ),
  CONSTRAINT workflow_notes_note_id_ulid_format CHECK (
    LENGTH(note_id) = 26 AND 
    note_id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  )
);

-- 8. 用户同步日志（可选）
CREATE TABLE user_sync_log (
  id CHAR(26) PRIMARY KEY, -- ULID format
  user_id CHAR(26) REFERENCES users(id),
  sync_type VARCHAR(20), -- 'create', 'update', 'delete'
  logto_data JSONB, -- 从Logto获取的原始数据
  sync_status VARCHAR(20), -- 'success', 'error'
  error_message TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- ULID format constraints
  CONSTRAINT user_sync_log_id_ulid_format CHECK (
    LENGTH(id) = 26 AND 
    id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
  ),
  CONSTRAINT user_sync_log_user_id_ulid_format CHECK (
    user_id IS NULL OR (
      LENGTH(user_id) = 26 AND 
      user_id ~ '^[0-9A-HJKMNP-TV-Z]{26}$'
    )
  )
);

-- Create indexes for ULID-based tables
-- ULID's lexicographic ordering makes these indexes very efficient
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_note_versions_note_id ON note_versions(note_id);
CREATE INDEX idx_note_versions_created_at ON note_versions(created_at);
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_note_connections_source_note_id ON note_connections(source_note_id);
CREATE INDEX idx_note_connections_target_note_id ON note_connections(target_note_id);
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_user_sync_log_user_id ON user_sync_log(user_id);
CREATE INDEX idx_user_sync_log_synced_at ON user_sync_log(synced_at);

COMMIT;

-- Print migration success message
DO $$
BEGIN
    RAISE NOTICE '✅ ULID Migration completed successfully:';
    RAISE NOTICE '  - All UUID primary keys converted to CHAR(26) ULID format';
    RAISE NOTICE '  - ULID format constraints added to ensure data integrity';
    RAISE NOTICE '  - Indexes optimized for ULID lexicographic ordering';
    RAISE NOTICE '  - Application layer must generate ULIDs using TypeScript library';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Next steps:';
    RAISE NOTICE '  1. Update application schemas to use ULID validation';
    RAISE NOTICE '  2. Update repositories to generate ULIDs for new records';
    RAISE NOTICE '  3. Run tests to ensure everything works correctly';
END $$;