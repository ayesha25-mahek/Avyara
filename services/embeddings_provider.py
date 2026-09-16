"""
services/embeddings_provider.py
-------------------------------
Unified Embedding Provider supporting:
1. Local Sentence-Transformers: 'BAAI/bge-small-en-v1.5' (384-dim)
2. OpenAI: 'text-embedding-3-small' (1536-dim)
3. Fallback HuggingFace / Direct Embedding Generation
"""

import logging
import os
from typing import List, Optional

logger = logging.getLogger(__name__)


class EmbeddingsProvider:
    """Provides vector embeddings for RAG ingestion and retrieval."""

    def __init__(self, model_name: Optional[str] = None):
        self.model_type = model_name or os.getenv("EMBEDDING_MODEL", "bge-small-en-v1.5")
        self.dimension = int(os.getenv("EMBEDDING_DIMENSION", "384"))
        self._local_model = None
        self._openai_client = None

        logger.info(
            "Initializing EmbeddingsProvider with model '%s' (dim: %d)",
            self.model_type,
            self.dimension,
        )

    def _get_local_model(self):
        if self._local_model is None:
            try:
                from sentence_transformers import SentenceTransformer
                # Default to BAAI/bge-small-en-v1.5 (384 dimensions)
                model_id = "BAAI/bge-small-en-v1.5"
                logger.info("Loading local SentenceTransformer model: %s", model_id)
                self._local_model = SentenceTransformer(model_id)
            except Exception as e:
                logger.warning("Could not load SentenceTransformer locally: %s. Using fallback.", e)
        return self._local_model

    def _get_openai_client(self):
        if self._openai_client is None:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OPENAI_API_KEY is not set in environment.")
            from openai import OpenAI
            self._openai_client = OpenAI(api_key=api_key)
        return self._openai_client

    def embed_text(self, text: str) -> List[float]:
        """Generate embedding vector for a single text."""
        return self.embed_batch([text])[0]

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embedding vectors for a batch of texts."""
        if not texts:
            return []

        cleaned_texts = [t.strip() for t in texts]

        # 1. OpenAI Path
        if "openai" in self.model_type.lower():
            try:
                client = self._get_openai_client()
                model_name = "text-embedding-3-small"
                response = client.embeddings.create(input=cleaned_texts, model=model_name)
                return [d.embedding for d in response.data]
            except Exception as e:
                logger.error("OpenAI embedding failed: %s. Falling back to local/fast model.", e)

        # 2. Local Sentence-Transformers Path (bge-small-en-v1.5)
        model = self._get_local_model()
        if model is not None:
            try:
                # bge-small benefits from normalized embeddings for cosine similarity
                embeddings = model.encode(cleaned_texts, normalize_embeddings=True)
                return [emb.tolist() for emb in embeddings]
            except Exception as e:
                logger.error("SentenceTransformer batch encoding failed: %s", e)

        # 3. Deterministic Lightweight Fallback (Hash-based projection for mock/offline testing)
        logger.warning("Using deterministic fallback embedding generator.")
        return [self._fallback_embedding(t, self.dimension) for t in cleaned_texts]

    @staticmethod
    def _fallback_embedding(text: str, dim: int = 384) -> List[float]:
        """Generate normalized deterministic float vector from text hash."""
        import hashlib
        import math

        vector = []
        for i in range(dim):
            seed = f"{text}_{i}".encode("utf-8")
            val = int(hashlib.md5(seed).hexdigest()[:6], 16) / 0xFFFFFF
            vector.append((val * 2.0) - 1.0)

        # Normalize
        norm = math.sqrt(sum(x * x for x in vector)) or 1.0
        return [x / norm for x in vector]
