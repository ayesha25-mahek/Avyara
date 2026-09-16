"""
services/rag_db.py
------------------
Database layer for Supabase PostgreSQL + pgvector.
Manages documents, chunks, vector storage, and similarity search queries.
"""

import json
import logging
import os
from pathlib import Path
from typing import Any, Dict, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor, execute_values
from pgvector.psycopg2 import register_vector

logger = logging.getLogger(__name__)


class RagDatabase:
    """Manages Supabase PostgreSQL connection and pgvector queries."""

    def __init__(self, db_url: Optional[str] = None):
        self.db_url = db_url or os.getenv(
            "SUPABASE_DB_URL",
            "postgresql://postgres:bizzoraai123@db.gsqlabyzhswqjrtwrkut.supabase.co:5432/postgres"
        )

    def get_connection(self):
        """Create and return a configured psycopg2 connection with vector support."""
        conn = psycopg2.connect(self.db_url, sslmode="require")
        register_vector(conn)
        return conn

    def init_db(self, schema_file: Optional[str] = "schema.sql") -> Dict[str, Any]:
        """Execute schema.sql to ensure tables, indexes, and RPC functions exist."""
        schema_path = Path(schema_file) if schema_file else Path("schema.sql")
        if not schema_path.exists():
            raise FileNotFoundError(f"Schema file not found at '{schema_path}'")

        sql_content = schema_path.read_text(encoding="utf-8")

        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql_content)
            conn.commit()

        logger.info("Supabase pgvector schema initialized successfully.")
        return {
            "status": "success",
            "message": "Supabase pgvector schema, tables, and RPC functions created successfully."
        }

    def insert_document(
        self,
        title: str,
        source_type: str = "text",
        filename: Optional[str] = None,
        file_path: Optional[str] = None,
        file_size: int = 0,
        total_chunks: int = 0,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Insert a document record and return its UUID."""
        meta_json = json.dumps(metadata or {})
        sql = """
            INSERT INTO documents (title, source_type, filename, file_path, file_size, total_chunks, metadata)
            VALUES (%s, %s, %s, %s, %s, %s, %s::jsonb)
            RETURNING id;
        """
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    sql,
                    (title, source_type, filename, file_path, file_size, total_chunks, meta_json),
                )
                doc_id = str(cur.fetchone()[0])
            conn.commit()
        return doc_id

    def update_document_chunks_count(self, document_id: str, count: int):
        """Update total_chunks count for a document."""
        sql = "UPDATE documents SET total_chunks = %s WHERE id = %s;"
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (count, document_id))
            conn.commit()

    def insert_chunks(self, document_id: str, chunks_data: List[Dict[str, Any]]) -> int:
        """
        Insert a list of chunk dicts into document_chunks.
        Each item: {'chunk_index': int, 'content': str, 'token_count': int, 'embedding': list[float], 'metadata': dict}
        """
        if not chunks_data:
            return 0

        rows = [
            (
                document_id,
                chunk["chunk_index"],
                chunk["content"],
                chunk.get("token_count", len(chunk["content"].split())),
                chunk["embedding"],
                json.dumps(chunk.get("metadata", {})),
            )
            for chunk in chunks_data
        ]

        sql = """
            INSERT INTO document_chunks (document_id, chunk_index, content, token_count, embedding, metadata)
            VALUES %s;
        """
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                execute_values(
                    cur,
                    sql,
                    rows,
                    template="(%s, %s, %s, %s, %s, %s::jsonb)",
                )
            conn.commit()

        self.update_document_chunks_count(document_id, len(chunks_data))
        return len(chunks_data)

    def search_chunks(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        threshold: float = 0.2,
        filter_doc_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Perform semantic similarity search using pgvector cosine distance (<=> operator).
        Returns list of matching chunks sorted by similarity desc.
        """
        sql = """
            SELECT 
                dc.id,
                dc.document_id,
                dc.chunk_index,
                dc.content,
                dc.metadata,
                d.title as document_title,
                d.source_type,
                d.filename,
                1 - (dc.embedding <=> %s::vector) AS similarity
            FROM document_chunks dc
            JOIN documents d ON d.id = dc.document_id
            WHERE 
                (%s IS NULL OR dc.document_id = %s::uuid)
                AND dc.embedding IS NOT NULL
                AND (1 - (dc.embedding <=> %s::vector)) >= %s
            ORDER BY dc.embedding <=> %s::vector ASC
            LIMIT %s;
        """

        with self.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    sql,
                    (
                        query_embedding,
                        filter_doc_id,
                        filter_doc_id,
                        query_embedding,
                        threshold,
                        query_embedding,
                        top_k,
                    ),
                )
                results = cur.fetchall()

        # Convert RealDictRow to standard dicts and UUIDs to string
        formatted = []
        for r in results:
            formatted.append({
                "id": str(r["id"]),
                "document_id": str(r["document_id"]),
                "document_title": r.get("document_title"),
                "source_type": r.get("source_type"),
                "filename": r.get("filename"),
                "chunk_index": r["chunk_index"],
                "content": r["content"],
                "metadata": r.get("metadata", {}),
                "similarity": float(r["similarity"]) if r["similarity"] is not None else 0.0,
            })
        return formatted

    def list_documents(self, limit: int = 50) -> List[Dict[str, Any]]:
        """List all indexed documents with chunk stats."""
        sql = """
            SELECT 
                id, title, source_type, filename, file_size, total_chunks, metadata, created_at, updated_at
            FROM documents
            ORDER BY created_at DESC
            LIMIT %s;
        """
        with self.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(sql, (limit,))
                rows = cur.fetchall()

        return [
            {
                "id": str(r["id"]),
                "title": r["title"],
                "source_type": r["source_type"],
                "filename": r["filename"],
                "file_size": r["file_size"],
                "total_chunks": r["total_chunks"],
                "metadata": r["metadata"],
                "created_at": r["created_at"].isoformat() if r["created_at"] else None,
                "updated_at": r["updated_at"].isoformat() if r["updated_at"] else None,
            }
            for r in rows
        ]

    def delete_document(self, document_id: str) -> bool:
        """Delete a document and its cascading chunks."""
        sql = "DELETE FROM documents WHERE id = %s RETURNING id;"
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (document_id,))
                deleted = cur.fetchone()
            conn.commit()
        return deleted is not None
