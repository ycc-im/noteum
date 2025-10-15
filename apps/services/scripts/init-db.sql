-- Initialize Noteum Database
-- This script runs when the PostgreSQL container starts

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS noteum_schema;

-- Set default privileges for the postgres user
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;

-- Create indexes for better performance (these will be created by Prisma migrations too)
-- These are just examples, actual indexes will be created by Prisma

-- Log initialization
\echo 'Noteum database initialized successfully'