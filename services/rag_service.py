"""
services/rag_service.py
-----------------------
Core RAG orchestration service:
- Smart text chunking (paragraph & sentence aware)
- Document & File ingestion into Supabase pgvector
- Semantic vector retrieval with similarity scores
"""

import logging
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

from services.embeddings_provider import EmbeddingsProvider
from services.rag_db import RagDatabase
from services.document_reader import DocumentReader

logger = logging.getLogger(__name__)


class RagService:
    """End-to-end RAG operations for BizzoraAI / aiAdGen."""

    def __init__(
        self,
        db: Optional[RagDatabase] = None,
        embeddings: Optional[EmbeddingsProvider] = None,
    ):
        self.db = db or RagDatabase()
        self.embeddings = embeddings or EmbeddingsProvider()
        self.doc_reader = DocumentReader()

    # -----------------------------------------------------------------------
    # Chunking Strategy
    # -----------------------------------------------------------------------
    @staticmethod
    def chunk_text(
        text: str,
        chunk_size: int = 600,
        chunk_overlap: int = 100,
    ) -> List[str]:
        """
        Split text into overlapping semantic chunks respecting paragraphs and sentence boundaries.
        chunk_size: approximate character length of each chunk.
        chunk_overlap: approximate character overlap between consecutive chunks.
        """
        if not text or not text.strip():
            return []

        # Split into logical paragraphs or double-newlines
        raw_paragraphs = [p.strip() for p in re.split(r'\n\s*\n', text) if p.strip()]

        chunks: List[str] = []
        current_chunk: List[str] = []
        current_len = 0

        for para in raw_paragraphs:
            para_len = len(para)

            # If a single paragraph is larger than chunk_size, split by sentences
            if para_len > chunk_size:
                sentences = re.split(r'(?<=[.?!])\s+', para)
                for sent in sentences:
                    sent_len = len(sent)
                    if current_len + sent_len > chunk_size and current_chunk:
                        chunk_str = " ".join(current_chunk).strip()
                        if chunk_str:
                            chunks.append(chunk_str)
                        # Keep overlap if possible
                        overlap_chunk = []
                        overlap_len = 0
                        for prev_s in reversed(current_chunk):
                            if overlap_len + len(prev_s) <= chunk_overlap:
                                overlap_chunk.insert(0, prev_s)
                                overlap_len += len(prev_s)
                            else:
                                break
                        current_chunk = overlap_chunk
                        current_len = overlap_len

                    current_chunk.append(sent)
                    current_len += sent_len
            else:
                if current_len + para_len > chunk_size and current_chunk:
                    chunk_str = "\n\n".join(current_chunk).strip()
                    if chunk_str:
                        chunks.append(chunk_str)
                    current_chunk = []
                    current_len = 0

                current_chunk.append(para)
                current_len += para_len

        # Append trailing chunk
        if current_chunk:
            chunk_str = "\n\n".join(current_chunk).strip()
            if chunk_str:
                chunks.append(chunk_str)

        return chunks

    # -----------------------------------------------------------------------
    # Ingestion: Raw Text
    # -----------------------------------------------------------------------
    def ingest_text(
        self,
        title: str,
        text: str,
        source_type: str = "text",
        filename: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        chunk_size: int = 600,
        chunk_overlap: int = 100,
    ) -> Dict[str, Any]:
        """Ingest raw text into Supabase pgvector."""
        if not text.strip():
            raise ValueError("Input text is empty.")

        meta = metadata or {}
        chunks = self.chunk_text(text, chunk_size=chunk_size, chunk_overlap=chunk_overlap)

        if not chunks:
            raise ValueError("No chunks could be extracted from input text.")

        logger.info("Ingesting document '%s' (%d chunks)...", title, len(chunks))

        # 1. Insert parent document record
        doc_id = self.db.insert_document(
            title=title,
            source_type=source_type,
            filename=filename,
            file_size=len(text.encode("utf-8")),
            total_chunks=len(chunks),
            metadata=meta,
        )

        # 2. Generate embeddings in batch
        embeddings = self.embeddings.embed_batch(chunks)

        # 3. Prepare chunk payload
        chunks_data = [
            {
                "chunk_index": idx,
                "content": chunk,
                "token_count": len(chunk.split()),
                "embedding": emb,
                "metadata": {**meta, "chunk_index": idx},
            }
            for idx, (chunk, emb) in enumerate(zip(chunks, embeddings))
        ]

        # 4. Insert chunks into pgvector
        inserted_count = self.db.insert_chunks(doc_id, chunks_data)

        logger.info("Document '%s' successfully ingested with ID: %s", title, doc_id)
        return {
            "document_id": doc_id,
            "title": title,
            "chunks_count": inserted_count,
            "status": "indexed",
        }

    # -----------------------------------------------------------------------
    # Ingestion: File (PDF, DOCX, PPTX, TXT)
    # -----------------------------------------------------------------------
    def ingest_file(
        self,
        file_path: str,
        title: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Read a file on disk, extract text, and index it into Supabase pgvector."""
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found at '{path}'")

        doc_title = title or path.stem.replace("_", " ").title()
        ext = path.suffix.lower().lstrip(".")
        source_type = ext if ext in ["pdf", "docx", "pptx", "txt"] else "file"

        # Extract text via DocumentReader
        extracted_text = self.doc_reader.read(str(path))

        meta = metadata or {}
        meta["filename"] = path.name
        meta["file_extension"] = ext
        meta["file_size_bytes"] = path.stat().st_size

        return self.ingest_text(
            title=doc_title,
            text=extracted_text,
            source_type=source_type,
            filename=path.name,
            metadata=meta,
        )

    # -----------------------------------------------------------------------
    # Retrieval
    # -----------------------------------------------------------------------
    def retrieve(
        self,
        query: str,
        top_k: int = 5,
        threshold: float = 0.15,
        filter_doc_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Semantic search against Supabase pgvector for top-k matching chunks."""
        if not query.strip():
            return []

        # 1. Embed query
        query_vector = self.embeddings.embed_text(query)

        # 2. Search database
        results = self.db.search_chunks(
            query_embedding=query_vector,
            top_k=top_k,
            threshold=threshold,
            filter_doc_id=filter_doc_id,
        )

        return results

    def format_context_for_llm(self, retrieved_chunks: List[Dict[str, Any]]) -> str:
        """Format retrieved chunks into a clean grounded context string for LLM prompting."""
        if not retrieved_chunks:
            return "No relevant context found in knowledge base."

        context_blocks = []
        for i, chunk in enumerate(retrieved_chunks, 1):
            source = chunk.get("document_title") or chunk.get("filename") or f"Doc {chunk.get('document_id', '')[:8]}"
            similarity = chunk.get("similarity", 0.0)
            context_blocks.append(
                f"[Source {i}: {source} (Relevance: {similarity:.2f})]\n{chunk['content']}"
            )

        return "\n\n---\n\n".join(context_blocks)
