-- 创建完整的数据库Schema
-- 执行顺序: 02-create-schema.sql

-- 1. 用户表（与Logto集成）
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 笔记表（React Flow Node兼容 + JSON Slots）
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
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
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 笔记版本历史表
CREATE TABLE note_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
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
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(note_id, version_number)
);

-- 4. 标签表
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#6366f1', -- hex color
  description TEXT,
  metadata JSONB DEFAULT '{}', -- 图标、分类等
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, name)
);

-- 5. 笔记标签关联表
CREATE TABLE note_tags (
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (note_id, tag_id)
);

-- 6. 笔记连接表（React Flow Edge兼容）
CREATE TABLE note_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- React Flow Edge 兼容字段
  source_note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  target_note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
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
  UNIQUE(source_note_id, source_slot, target_note_id, target_slot)
);

-- 7. 工作流表（用于组织笔记集合）
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- 工作流视图设置
  viewport JSONB DEFAULT '{"x": 0, "y": 0, "zoom": 1}', -- React Flow viewport
  settings JSONB DEFAULT '{}', -- 网格、背景等设置
  
  is_template BOOLEAN DEFAULT FALSE,
  is_shared BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 工作流中的笔记关联
CREATE TABLE workflow_notes (
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  display_order INTEGER, -- 在工作流中的显示顺序
  
  PRIMARY KEY (workflow_id, note_id)
);

-- 8. 用户同步日志（可选）
CREATE TABLE user_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  sync_type VARCHAR(20), -- 'create', 'update', 'delete'
  logto_data JSONB, -- 从Logto获取的原始数据
  sync_status VARCHAR(20), -- 'success', 'error'
  error_message TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- 打印表创建状态
DO $$
BEGIN
    RAISE NOTICE '✅ Schema created successfully:';
    RAISE NOTICE '  - users: User management with Logto integration';
    RAISE NOTICE '  - notes: React Flow compatible notes with JSON slots';
    RAISE NOTICE '  - note_versions: Version control system';
    RAISE NOTICE '  - tags & note_tags: Flexible tagging system';
    RAISE NOTICE '  - note_connections: React Flow edge compatible connections';
    RAISE NOTICE '  - workflows & workflow_notes: Workflow organization';
    RAISE NOTICE '  - user_sync_log: Logto synchronization tracking';
END $$;