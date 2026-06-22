from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/vector", tags=["Vector AI"])

try:
    from app.vector.vector_store import search
except ModuleNotFoundError:
    search = None


class Query(BaseModel):
    question: str


@router.post("/ask")
def ask_vector(data: Query):
    if search is None:
        raise HTTPException(
            status_code=503,
            detail="Vector search is not installed. Use /ai/chat for Gemini tutoring.",
        )

    answer = search(data.question)
    return {"answer": answer}
