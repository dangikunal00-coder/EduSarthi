from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.database.models import Interest, Performance, User
from app.routes.performance import summarize_records

router = APIRouter(prefix="/admin", tags=["Admin"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def student_payload(user: User, db: Session):
    interests = db.query(Interest).filter(Interest.user_id == user.id).all()
    records = db.query(Performance).filter(Performance.user_id == user.id).all()
    summary = summarize_records(records)

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "course": user.course,
        "semester": user.semester,
        "college": user.college,
        "phone": user.phone,
        "interests": [item.interest for item in interests],
        "average_score": summary["average_score"],
        "accuracy": summary["accuracy"],
        "total_quizzes": summary["total_quizzes"],
        "time_spent_seconds": summary["time_spent_seconds"],
        "weak_topics": summary["weak_topics"],
        "strong_topics": summary["strong_topics"],
        "quiz_scores": summary["quiz_scores"],
        "topic_performance": summary["topic_performance"],
        "time_spent": summary["time_spent"],
    }


@router.get("/students")
def get_students(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [student_payload(user, db) for user in users]


@router.get("/performance/{user_id}")
def get_student_performance(user_id: int, db: Session = Depends(get_db)):
    records = db.query(Performance).filter(Performance.user_id == user_id).all()
    return summarize_records(records)


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    users = db.query(User).all()
    students = [student_payload(user, db) for user in users]
    all_records = db.query(Performance).all()
    summary = summarize_records(all_records)

    at_risk = sum(1 for student in students if student["weak_topics"])

    return {
        "stats": {
            "total_students": len(students),
            "at_risk": at_risk,
            "average_score": summary["average_score"],
            "accuracy": summary["accuracy"],
            "total_quizzes": summary["total_quizzes"],
            "time_spent_minutes": round(summary["time_spent_seconds"] / 60, 1),
        },
        "students": students,
        "topic_performance": summary["topic_performance"],
        "time_spent": summary["time_spent"],
        "weak_topics": summary["weak_topics"],
        "strong_topics": summary["strong_topics"],
        "quiz_scores": summary["quiz_scores"],
    }
