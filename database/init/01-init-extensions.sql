-- 初始化必要的PostgreSQL扩展
-- 执行顺序: 01-init-extensions.sql

-- 启用UUID生成扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 启用pgvector扩展（用于AI向量搜索）
CREATE EXTENSION IF NOT EXISTS "vector";

-- 启用pg_trgm扩展（用于文本相似度搜索）
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 启用btree_gin扩展（用于JSONB索引优化）
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- 打印扩展安装状态
DO $$
BEGIN
    RAISE NOTICE '✅ Extensions initialized:';
    RAISE NOTICE '  - uuid-ossp: UUID generation';
    RAISE NOTICE '  - vector: AI vector search';
    RAISE NOTICE '  - pg_trgm: Text similarity search';
    RAISE NOTICE '  - btree_gin: JSONB index optimization';
END $$;