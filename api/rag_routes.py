"""
api/rag_routes.py
-----------------
FastAPI Router for Supabase pgvector RAG system.

Endpoints:
- POST   /api/rag/init-db           — Initialize pgvector schema & tables on Supabase
- POST   /api/rag/ingest            — Upload documents or raw text into pgvector
- POST   /api/rag/retrieve          — Semantic similarity retrieval from pgvector
- POST   /api/rag/generate-summary  — Generate RAG-grounded Executive Summary
- GET    /api/rag/documents         — List all indexed documents & chunk stats
- DELETE /api/rag/documents/{doc_id}— Delete a document and its vector chunks
"""

import logging
import os
import shutil
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field

from services.rag_service import RagService
from services.rag_exec_summary_generator import RagExecutiveSummaryGenerator

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/rag", tags=["RAG & pgvector"])

# Lazy service instances
_rag_service: Optional[RagService] = None
_rag_exec_gen: Optional[RagExecutiveSummaryGenerator] = None


def get_rag_service() -> RagService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RagService()
    return _rag_service


def get_rag_exec_generator() -> RagExecutiveSummaryGenerator:
    global _rag_exec_gen
    if _rag_exec_gen is None:
        _rag_exec_gen = RagExecutiveSummaryGenerator(rag_service=get_rag_service())
    return _rag_exec_gen


# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------

class IngestTextRequest(BaseModel):
    title: str = Field(..., description="Title of the document")
    text: str = Field(..., description="Raw text content to chunk and vectorize")
    source_type: str = Field(default="text", description="Source format identifier")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    chunk_size: int = Field(default=600, ge=100, le=4000)
    chunk_overlap: int = Field(default=100, ge=0, le=1000)


class RetrieveRequest(BaseModel):
    query: str = Field(..., description="Search query / prompt")
    top_k: int = Field(default=5, ge=1, le=50)
    threshold: float = Field(default=0.15, ge=0.0, le=1.0)
    filter_document_id: Optional[str] = Field(default=None)


class GenerateSummaryRequest(BaseModel):
    query: str = Field(..., description="Query / topic for executive summary")
    top_k: int = Field(default=5, ge=1, le=20)
    threshold: float = Field(default=0.15, ge=0.0, le=1.0)
    filter_document_id: Optional[str] = Field(default=None)
    tone: str = Field(default="Executive & Authoritative")
    target_audience: str = Field(default="C-Suite Executives")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/init-db")
async def init_rag_database():
    """
    Execute schema.sql on Supabase PostgreSQL to create extensions,
    tables (documents, document_chunks), HNSW indexes, and match RPC function.
    """
    try:
        service = get_rag_service()
        res = service.db.init_db("schema.sql")
        return res
    except Exception as e:
        logger.exception("Failed to initialize RAG database")
        raise HTTPException(status_code=500, detail=f"Database initialization failed: {e}")


@router.post("/ingest-text")
async def ingest_text(request: IngestTextRequest):
    """Chunk, embed, and store raw text in Supabase pgvector."""
    try:
        service = get_rag_service()
        result = service.ingest_text(
            title=request.title,
            text=request.text,
            source_type=request.source_type,
            metadata=request.metadata,
            chunk_size=request.chunk_size,
            chunk_overlap=request.chunk_overlap,
        )
        return result
    except Exception as e:
        logger.exception("Text ingestion failed")
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {e}")


@router.post("/ingest-files")
async def ingest_files(
    title: Optional[str] = Form(default=None),
    files: List[UploadFile] = File(...),
):
    """Upload documents (PDF, DOCX, PPTX, TXT), parse text, and index into pgvector."""
    if not files:
        raise HTTPException(status_code=400, detail="No files provided.")

    service = get_rag_service()
    upload_dir = Path("output/uploads/rag") / uuid.uuid4().hex
    upload_dir.mkdir(parents=True, exist_ok=True)

    results = []
    for upload in files:
        if not upload.filename:
            continue
        dest_path = upload_dir / upload.filename
        with open(dest_path, "wb") as f:
            shutil.copyfileobj(upload.file, f)

        try:
            doc_title = title or upload.filename
            ingest_res = service.ingest_file(str(dest_path), title=doc_title)
            results.append(ingest_res)
        except Exception as e:
            logger.exception("Failed to ingest file %s", upload.filename)
            results.append({
                "filename": upload.filename,
                "status": "error",
                "error": str(e),
            })

    return {"uploaded_count": len(results), "documents": results}


@router.post("/retrieve")
async def retrieve_context(request: RetrieveRequest):
    """Perform semantic vector retrieval on Supabase pgvector."""
    try:
        service = get_rag_service()
        matches = service.retrieve(
            query=request.query,
            top_k=request.top_k,
            threshold=request.threshold,
            filter_doc_id=request.filter_document_id,
        )
        return {
            "query": request.query,
            "count": len(matches),
            "results": matches,
        }
    except Exception as e:
        logger.exception("Retrieval failed")
        raise HTTPException(status_code=500, detail=f"Retrieval failed: {e}")


@router.post("/generate-summary")
async def generate_rag_summary(request: GenerateSummaryRequest):
    """Generate an Executive Summary grounded in retrieved Supabase pgvector knowledge."""
    try:
        generator = get_rag_exec_generator()
        summary_result = generator.generate_summary(
            query=request.query,
            top_k=request.top_k,
            threshold=request.threshold,
            filter_doc_id=request.filter_document_id,
            tone=request.tone,
            target_audience=request.target_audience,
        )
        return summary_result
    except Exception as e:
        logger.exception("RAG summary generation failed")
        raise HTTPException(status_code=500, detail=f"Generation failed: {e}")


@router.get("/documents")
async def list_documents(limit: int = 50):
    """List all indexed documents from Supabase pgvector."""
    try:
        service = get_rag_service()
        docs = service.db.list_documents(limit=limit)
        return {"count": len(docs), "documents": docs}
    except Exception as e:
        logger.exception("Failed to list documents")
        raise HTTPException(status_code=500, detail=f"Failed to list documents: {e}")


@router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document and its associated chunks from pgvector."""
    try:
        service = get_rag_service()
        deleted = service.db.delete_document(document_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Document not found.")
        return {"status": "success", "message": f"Document {document_id} and its chunks deleted."}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to delete document")
        raise HTTPException(status_code=500, detail=f"Delete failed: {e}")
