import json
import os
import re
import uuid
from pathlib import Path
from datetime import datetime, timezone

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.database.models import Performance, Quiz

router = APIRouter(prefix="/quiz", tags=["Quiz"])
load_dotenv()
load_dotenv(Path(__file__).resolve().parents[3] / "ai_Edusarthi" / "backend" / ".env")

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

quiz_sessions = {}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class QuizStartRequest(BaseModel):
    topic: str
    user_id: int | None = None


class AnswerRequest(BaseModel):
    quiz_id: str
    question_index: int
    selected_option: str
    user_id: int | None = None


class QuizSubmit(BaseModel):
    user_id: int
    category: str
    score: int
    total: int
    weak_topics: list[str] = []


def build_quiz_prompt(topic: str) -> str:
    return f"""
You are an expert quiz generator for BTech CSE students.
Generate exactly 10 MCQ questions on the topic: "{topic}".

Difficulty split:
- Questions 1-4 easy
- Questions 5-8 medium
- Questions 9-10 hard

Return only a valid JSON array of exactly 10 objects.
Each object must have exactly these keys: "question", "options", "answer", "explanation".
"options" must be an array of exactly 4 strings prefixed with "A. ", "B. ", "C. ", "D. ".
"answer" must be a single letter: A, B, C, or D.
"explanation" must be 1-2 clear sentences.
"""


def extract_json_array(raw: str) -> list:
    raw = raw.strip()
    raw = re.sub(r"```(?:json)?", "", raw).strip().rstrip("`").strip()
    start = raw.find("[")
    end = raw.rfind("]") + 1
    if start == -1 or end == 0:
        raise ValueError("No JSON array found in Gemini response")
    return json.loads(raw[start:end])


def generate_questions(topic: str) -> list:
    if not api_key:
        raise RuntimeError("Gemini API key is not configured. Add GEMINI_API_KEY to the backend .env file.")

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(build_quiz_prompt(topic))
    questions = extract_json_array(response.text)

    if len(questions) != 10:
        raise ValueError(f"Expected 10 questions, got {len(questions)}")

    for question in questions:
        question["answer"] = question["answer"].strip().upper()[0]

    return questions


@router.post("/start")
def start_quiz(data: QuizStartRequest):
    topic = data.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic cannot be empty")

    try:
        questions = generate_questions(topic)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {exc}") from exc

    quiz_id = str(uuid.uuid4())
    quiz_sessions[quiz_id] = {
        "topic": topic,
        "user_id": data.user_id,
        "questions": questions,
        "score": 0,
        "wrong_topics": [],
        "answered": set(),
        "started_at": datetime.now(timezone.utc),
    }

    return {
        "quiz_id": quiz_id,
        "total_questions": len(questions),
        "questions": [
            {"question": q["question"], "options": q["options"]}
            for q in questions
        ],
    }


@router.post("/answer")
def submit_answer(data: AnswerRequest, db: Session = Depends(get_db)):
    session = quiz_sessions.get(data.quiz_id)
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found. Please start a new quiz.")

    questions = session["questions"]
    idx = data.question_index
    if idx < 0 or idx >= len(questions):
        raise HTTPException(status_code=400, detail="Invalid question index.")

    question = questions[idx]
    selected = data.selected_option.strip().upper()[0]
    correct = question["answer"].upper()
    is_correct = selected == correct

    if idx not in session["answered"]:
        session["answered"].add(idx)
        if is_correct:
            session["score"] += 1
        else:
            session["wrong_topics"].append(question["question"][:80])

    quiz_complete = len(session["answered"]) >= len(questions)
    result = {
        "is_correct": is_correct,
        "correct_answer": correct,
        "explanation": question["explanation"],
        "score": session["score"],
        "question_index": idx,
        "quiz_complete": quiz_complete,
    }

    if quiz_complete:
        user_id = data.user_id or session.get("user_id")
        weak_topics = list(dict.fromkeys(session["wrong_topics"]))[:5]
        total = len(questions)
        final_score = session["score"]
        weak = bool(weak_topics) or final_score < (total * 0.7)
        elapsed = int((datetime.now(timezone.utc) - session["started_at"]).total_seconds())

        if user_id:
            db.add(
                Performance(
                    user_id=user_id,
                    category=session["topic"],
                    score=final_score,
                    total=total,
                    weak=weak,
                    time_spent_seconds=elapsed,
                    created_at=datetime.now(timezone.utc).replace(tzinfo=None),
                )
            )
            db.commit()

        result.update(
            {
                "final_score": final_score,
                "total": total,
                "topic": session["topic"],
                "weak_areas": weak_topics or ([session["topic"]] if weak else []),
                "performance_saved": bool(user_id),
            }
        )
        del quiz_sessions[data.quiz_id]

    return result


@router.post("/submit")
def submit_quiz(data: QuizSubmit, db: Session = Depends(get_db)):
    db.add(
        Performance(
            user_id=data.user_id,
            category=data.category,
            score=data.score,
            total=data.total,
            weak=bool(data.weak_topics) or data.score < (data.total * 0.7),
            time_spent_seconds=0,
            created_at=datetime.now(timezone.utc).replace(tzinfo=None),
        )
    )
    db.commit()
    return {"message": "Performance saved"}


@router.get("/{category}")
def get_quiz(category: str, db: Session = Depends(get_db)):
    questions = db.query(Quiz).filter(Quiz.category == category).limit(5).all()
    return questions
