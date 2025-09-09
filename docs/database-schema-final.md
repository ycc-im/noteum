# 数据库Schema设计 - 最终版本

## 设计决策总结

✅ **PostgreSQL版本控制**: 组合方案（主表 + 历史表 + AI向量）  
✅ **Slots系统**: JSON字段方案（简洁、高效、React Flow友好）  
✅ **Tags系统**: 独立表（灵活搜索和管理）  

## 完整数据库Schema

```sql
-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  settings JSONB DEFAULT '{}', -- 用户偏好设置
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
  change_summary JSONB DEFAULT '{}', -- 描述具体变更 {"type": "content", "changes": [...]}
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

-- 6. 笔记连接表（简化版 - 直接使用slot位置名）
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

-- 8. 索引优化
-- 基础查询索引
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX idx_note_versions_note_id ON note_versions(note_id, version_number DESC);

-- Slots查询索引（GIN索引用于JSONB）
CREATE INDEX idx_notes_slots ON notes USING GIN(slots);

-- 标签搜索索引
CREATE INDEX idx_tags_user_name ON tags(user_id, name);
CREATE INDEX idx_note_tags_note ON note_tags(note_id);
CREATE INDEX idx_note_tags_tag ON note_tags(tag_id);

-- 连接查询索引
CREATE INDEX idx_connections_source ON note_connections(source_note_id);
CREATE INDEX idx_connections_target ON note_connections(target_note_id);

-- 向量搜索索引（需要指定距离函数）
CREATE INDEX idx_notes_content_vector ON notes USING hnsw (content_vector vector_cosine_ops);
CREATE INDEX idx_note_versions_content_vector ON note_versions USING hnsw (content_vector vector_cosine_ops);

-- 工作流查询索引
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_workflow_notes_workflow ON workflow_notes(workflow_id, display_order);
```

## TypeScript类型定义

```typescript
// 对应数据库的TypeScript接口
export interface DatabaseNote {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  content_vector?: number[];
  node_type: 'input' | 'output' | 'default' | 'custom';
  position_x: number;
  position_y: number;
  slots: {
    [K in SlotPosition]: SlotConfig;
  };
  metadata: Record<string, any>;
  current_version: number;
  created_at: string;
  updated_at: string;
}

export type SlotPosition = 
  | 'top-left' | 'top' | 'top-right'
  | 'right' | 'bottom-right' | 'bottom' 
  | 'bottom-left' | 'left';

export interface SlotConfig {
  enabled: boolean;
  label?: string;
  data: Record<string, any>;
  maxConnections: number;
}

export interface DatabaseConnection {
  id: string;
  source_note_id: string;
  target_note_id: string;
  source_slot: SlotPosition;
  target_slot: SlotPosition;
  connection_type: string;
  label?: string;
  metadata: Record<string, any>;
  weight: number;
  priority: number;
  is_active: boolean;
  created_at: string;
}

// React Flow转换函数
export function convertNoteToReactFlowNode(note: DatabaseNote): ReactFlowNode {
  return {
    id: note.id,
    type: note.node_type,
    data: {
      title: note.title,
      content: note.content,
      slots: note.slots,
      ...note.metadata
    },
    position: { x: note.position_x, y: note.position_y }
  };
}

export function convertConnectionToReactFlowEdge(conn: DatabaseConnection): ReactFlowEdge {
  return {
    id: conn.id,
    source: conn.source_note_id,
    target: conn.target_note_id,
    sourceHandle: conn.source_slot,
    targetHandle: conn.target_slot,
    label: conn.label,
    data: conn.metadata
  };
}
```

## 数据样例

```sql
-- 插入示例用户
INSERT INTO users (id, email, name) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'user@example.com', 'Test User');

-- 插入示例笔记
INSERT INTO notes (id, user_id, title, content, position_x, position_y, slots) VALUES 
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 
 'Start Note', 'This is the starting point', 250, 25,
 '{
   "top-left": {"enabled": false, "label": null, "data": {}, "maxConnections": 1},
   "top": {"enabled": false, "label": null, "data": {}, "maxConnections": 1},
   "top-right": {"enabled": false, "label": null, "data": {}, "maxConnections": 1},
   "right": {"enabled": true, "label": "Output", "data": {"color": "#10b981"}, "maxConnections": 2},
   "bottom-right": {"enabled": true, "label": "Next", "data": {}, "maxConnections": 1},
   "bottom": {"enabled": true, "label": "Flow", "data": {}, "maxConnections": 1},
   "bottom-left": {"enabled": false, "label": null, "data": {}, "maxConnections": 1},
   "left": {"enabled": false, "label": null, "data": {}, "maxConnections": 1}
 }');
```

这个schema设计满足了所有需求：
- ✅ React Flow完全兼容
- ✅ JSON slots简洁高效
- ✅ 版本控制系统完备
- ✅ AI向量搜索就绪
- ✅ 灵活的标签系统
- ✅ 工作流组织功能