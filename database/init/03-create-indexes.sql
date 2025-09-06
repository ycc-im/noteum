-- 创建优化索引
-- 执行顺序: 03-create-indexes.sql

-- 基础查询索引
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX idx_note_versions_note_id ON note_versions(note_id, version_number DESC);

-- Slots查询索引（GIN索引用于JSONB）
CREATE INDEX idx_notes_slots ON notes USING GIN(slots);
CREATE INDEX idx_notes_metadata ON notes USING GIN(metadata);

-- 标签搜索索引
CREATE INDEX idx_tags_user_name ON tags(user_id, name);
CREATE INDEX idx_note_tags_note ON note_tags(note_id);
CREATE INDEX idx_note_tags_tag ON note_tags(tag_id);

-- 连接查询索引
CREATE INDEX idx_connections_source ON note_connections(source_note_id);
CREATE INDEX idx_connections_target ON note_connections(target_note_id);
CREATE INDEX idx_connections_active ON note_connections(is_active) WHERE is_active = true;

-- 向量搜索索引（HNSW算法用于高效向量搜索）
CREATE INDEX idx_notes_content_vector ON notes USING hnsw (content_vector vector_cosine_ops);
CREATE INDEX idx_note_versions_content_vector ON note_versions USING hnsw (content_vector vector_cosine_ops);

-- 工作流查询索引
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_workflow_notes_workflow ON workflow_notes(workflow_id, display_order);

-- 文本搜索索引（使用pg_trgm进行模糊搜索）
CREATE INDEX idx_notes_title_trgm ON notes USING gin (title gin_trgm_ops);
CREATE INDEX idx_notes_content_trgm ON notes USING gin (content gin_trgm_ops);

-- 用户同步相关索引
CREATE INDEX idx_users_logto_id ON users(logto_id);
CREATE INDEX idx_users_last_sync ON users(last_sync_at DESC);
CREATE INDEX idx_user_sync_log_user ON user_sync_log(user_id, synced_at DESC);

-- 复合索引用于常见查询模式
CREATE INDEX idx_notes_user_updated ON notes(user_id, updated_at DESC);
CREATE INDEX idx_note_connections_source_active ON note_connections(source_note_id, is_active);

-- 打印索引创建状态
DO $$
BEGIN
    RAISE NOTICE '✅ Indexes created successfully:';
    RAISE NOTICE '  - Basic query indexes for notes, versions, and workflows';
    RAISE NOTICE '  - GIN indexes for JSONB slots and metadata';
    RAISE NOTICE '  - Tag system indexes for efficient searching';
    RAISE NOTICE '  - Connection indexes for graph traversal';
    RAISE NOTICE '  - HNSW vector indexes for AI similarity search';
    RAISE NOTICE '  - Text search indexes using pg_trgm';
    RAISE NOTICE '  - User sync indexes for Logto integration';
    RAISE NOTICE '  - Composite indexes for common query patterns';
END $$;