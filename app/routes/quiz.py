from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.database.models import Quiz

router = APIRouter(prefix="/quiz", tags=["Quiz"])


@router.get("/{category}")
def get_quiz(category: str):
    db: Session = SessionLocal()

    questions = db.query(Quiz)\
        .filter(Quiz.category == category)\
        .limit(5)\
        .all()

    return questions
from app.database.models import Performance

@router.post("/submit")
def submit_quiz(user_id: int, category: str, answers: dict):
    db: Session = SessionLocal()

    questions = db.query(Quiz).filter(Quiz.category == category).all()

    score = 0

    for q in questions:
        if str(q.id) in answers and answers[str(q.id)] == q.correct_answer:
            score += 1
    percentage = score / len(questions)

    is_weak = False
    if percentage < 0.5:
        is_weak = True

    new_perf = Performance(
        user_id=user_id,
        category=category,
        score=score,
        total=len(questions)
    )

    db.add(new_perf)
    db.commit()

    return {
        "score": score,
        "total": len(questions)
    }