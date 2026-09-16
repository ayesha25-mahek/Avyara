-- ===========================================================================
-- BizzoraAI / aiAdGen - Supabase pgvector RAG Schema
-- Database: PostgreSQL + pgvector
-- ===========================================================================

-- 1. Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- 2. Documents Table (Tracks uploaded & ingested source documents/knowledge)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'text', -- 'pdf', 'docx', 'pptx', 'txt', 'text', 'web'
    filename TEXT,
    file_path TEXT,
    file_size BIGINT DEFAULT 0,
    total_chunks INT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3. Document Chunks Table (Stores text chunks + 384-dim BGE / 1536-dim OpenAI vectors)
-- Default dimension: 384 (BAAI/bge-small-en-v1.5)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    token_count INT DEFAULT 0,
    embedding vector(384), -- Change to vector(1536) if using OpenAI text-embedding-3-small
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 4. Fast Vector Indexes (HNSW for high-precision sub-second similarity search)
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_embedding_hnsw 
    ON document_chunks 
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Optional GIN index for JSONB metadata queries
CREATE INDEX IF NOT EXISTS idx_chunks_metadata ON document_chunks USING gin (metadata);
CREATE INDEX IF NOT EXISTS idx_docs_metadata ON documents USING gin (metadata);

-- ---------------------------------------------------------------------------
-- 5. Semantic Search Function (RPC) - Cosine Similarity
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION match_document_chunks (
    query_embedding vector(384),
    match_threshold float DEFAULT 0.2,
    match_count int DEFAULT 5,
    filter_document_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    chunk_index INT,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.document_id,
        dc.chunk_index,
        dc.content,
        dc.metadata,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM document_chunks dc
    WHERE 
        (filter_document_id IS NULL OR dc.document_id = filter_document_id)
        AND dc.embedding IS NOT NULL
        AND (1 - (dc.embedding <=> query_embedding)) >= match_threshold
    ORDER BY dc.embedding <=> query_embedding ASC
    LIMIT match_count;
END;
$$;

-- ---------------------------------------------------------------------------
-- 6. Trigger to automatically update updated_at timestamp on documents
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_documents_updated_at ON documents;
CREATE TRIGGER trg_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
