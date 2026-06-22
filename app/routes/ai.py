import os
from pathlib import Path

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.database.models import History

router = APIRouter(prefix="/ai", tags=["AI"])
load_dotenv()
load_dotenv(Path(__file__).resolve().parents[3] / "ai_Edusarthi" / "backend" / ".env")

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)


class ChatRequest(BaseModel):
    question: str
    user_id: int | None = None
    mode: str = "beginner"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_prompt(mode: str):
    if mode == "exam":
        return "Give a structured exam-style answer with important points."
    if mode == "revision":
        return "Give short revision notes with bullets."
    return "Explain in simple terms with examples."


@router.post("/chat")
def chat(data: ChatRequest, db: Session = Depends(get_db)):
    if not api_key:
        answer = "Gemini API key is not configured. Add GEMINI_API_KEY to the backend .env file."
    else:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
You are EduSarthi, a helpful AI tutor for BTech CSE students.
{get_prompt(data.mode)}

Student question:
{data.question}
"""
        response = model.generate_content(prompt)
        answer = response.text

    if data.user_id:
        db.add(History(user_id=data.user_id, question=data.question, answer=answer))
        db.commit()

    return {"answer": answer, "response": answer}


@router.post("/ask")
def ask_question(question: str, user_id: int, db: Session = Depends(get_db)):
    return chat(ChatRequest(question=question, user_id=user_id), db)
