-- 初始化数据库脚本
-- 启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建笔记表
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    embedding vector(1536), -- OpenAI embedding 维度
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#000000',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建笔记标签关联表
CREATE TABLE IF NOT EXISTS note_tags (
    note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);

-- 创建向量相似度搜索索引
CREATE INDEX IF NOT EXISTS notes_embedding_idx ON notes
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 创建时间索引
CREATE INDEX IF NOT EXISTS notes_created_at_idx ON notes(created_at);
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);

-- 创建全文搜索索引
CREATE INDEX IF NOT EXISTS notes_search_idx ON notes
USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '')));

-- 插入示例数据
INSERT INTO users (email, name, password_hash) VALUES
('demo@example.com', 'Demo User', '$2b$10$example_hash')
ON CONFLICT (email) DO NOTHING;

INSERT INTO tags (name, color) VALUES
('Work', '#007bff'),
('Personal', '#28a745'),
('Ideas', '#ffc107'),
('Important', '#dc3545')
ON CONFLICT (name) DO NOTHING;

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 创建向量搜索函数
CREATE OR REPLACE FUNCTION search_notes_by_embedding(
    query_embedding vector(1536),
    similarity_threshold float DEFAULT 0.7,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    note_id int,
    title text,
    content text,
    similarity float
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        n.id,
        n.title,
        n.content,
        1 - (n.embedding <=> query_embedding) as similarity
    FROM notes n
    WHERE n.embedding IS NOT NULL
      AND 1 - (n.embedding <=> query_embedding) > similarity_threshold
    ORDER BY n.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- 创建混合搜索函数（向量 + 关键词）
CREATE OR REPLACE FUNCTION hybrid_search_notes(
    query_text text,
    query_embedding vector(1536),
    similarity_threshold float DEFAULT 0.7,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    note_id int,
    title text,
    content text,
    similarity float,
    text_rank real
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        n.id,
        n.title,
        n.content,
        1 - (n.embedding <=> query_embedding) as similarity,
        ts_rank(to_tsvector('english', n.title || ' ' || COALESCE(n.content, '')), plainto_tsquery('english', query_text)) as text_rank
    FROM notes n
    WHERE n.embedding IS NOT NULL
      AND (
        1 - (n.embedding <=> query_embedding) > similarity_threshold
        OR to_tsvector('english', n.title || ' ' || COALESCE(n.content, '')) @@ plainto_tsquery('english', query_text)
      )
    ORDER BY
        (CASE WHEN 1 - (n.embedding <=> query_embedding) > similarity_threshold THEN 1 - (n.embedding <=> query_embedding) ELSE 0 END) DESC,
        ts_rank(to_tsvector('english', n.title || ' ' || COALESCE(n.content, '')), plainto_tsquery('english', query_text)) DESC
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- 创建性能监控视图
CREATE OR REPLACE VIEW noteum_stats AS
SELECT
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM notes) as total_notes,
    (SELECT COUNT(*) FROM notes WHERE embedding IS NOT NULL) as notes_with_embeddings,
    (SELECT COUNT(*) FROM tags) as total_tags,
    (SELECT AVG(LENGTH(content)) FROM notes WHERE content IS NOT NULL) as avg_note_length,
    (SELECT MAX(created_at) FROM notes) as last_note_created;

COMMIT;