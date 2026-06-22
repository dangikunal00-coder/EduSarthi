from collections import defaultdict

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.database.models import Performance, User

router = APIRouter(prefix="/performance", tags=["Performance"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def percent(score, total):
    return round((score / total) * 100) if total else 0


def summarize_records(records):
    total_quizzes = len(records)
    total_score = sum(record.score or 0 for record in records)
    total_possible = sum(record.total or 0 for record in records)
    average_score = percent(total_score, total_possible)
    total_time_seconds = sum(record.time_spent_seconds or 0 for record in records)

    by_topic = defaultdict(lambda: {"score": 0, "total": 0, "time": 0, "attempts": 0})
    quiz_scores = []

    for index, record in enumerate(records):
        score = record.score or 0
        total = record.total or 0
        time_spent = record.time_spent_seconds or 0
        topic = record.category or "General"
        by_topic[topic]["score"] += score
        by_topic[topic]["total"] += total
        by_topic[topic]["time"] += time_spent
        by_topic[topic]["attempts"] += 1
        quiz_scores.append(
            {
                "quiz": index + 1,
                "topic": topic,
                "score": score,
                "total": total,
                "percentage": percent(score, total),
                "time_spent_seconds": time_spent,
                "created_at": record.created_at.isoformat() if record.created_at else None,
            }
        )

    topic_summary = []
    for topic, values in by_topic.items():
        topic_summary.append(
            {
                "topic": topic,
                "score": values["score"],
                "total": values["total"],
                "percentage": percent(values["score"], values["total"]),
                "time_spent_seconds": values["time"],
                "attempts": values["attempts"],
            }
        )

    weak_topics = [item for item in topic_summary if item["percentage"] < 70]
    strong_topics = [item for item in topic_summary if item["percentage"] >= 70]

    colors = ["bg-indigo-500", "bg-green-500", "bg-amber-500", "bg-red-500", "bg-sky-500"]
    topics = [
        {"name": item["topic"], "value": item["percentage"], "color": colors[index % len(colors)]}
        for index, item in enumerate(topic_summary)
    ]

    return {
        "total_quizzes": total_quizzes,
        "average_score": average_score,
        "accuracy": average_score,
        "total_score": total_score,
        "total_possible": total_possible,
        "time_spent_seconds": total_time_seconds,
        "weak_topics": weak_topics,
        "strong_topics": strong_topics,
        "quiz_scores": quiz_scores,
        "topic_performance": [
            {"topic": item["topic"], "score": item["percentage"], "attempts": item["attempts"]}
            for item in topic_summary
        ],
        "time_spent": [
            {
                "topic": item["topic"],
                "seconds": item["time_spent_seconds"],
                "minutes": round(item["time_spent_seconds"] / 60, 1),
            }
            for item in topic_summary
        ],
        "dateRange": "All time",
        "stats": [
            {"title": "Quizzes", "value": total_quizzes, "sub": "completed", "color": "bg-indigo-500"},
            {"title": "Average", "value": f"{average_score}%", "sub": "overall", "color": "bg-green-500"},
            {"title": "Accuracy", "value": f"{average_score}%", "sub": "correct answers", "color": "bg-sky-500"},
            {"title": "Weak Topics", "value": len(weak_topics), "sub": "need practice", "color": "bg-red-500"},
            {"title": "Time", "value": f"{round(total_time_seconds / 60, 1)}m", "sub": "quiz time", "color": "bg-amber-500"},
        ],
        "progress": [
            {"day": f"Quiz {item['quiz']}", "score": item["percentage"]}
            for item in quiz_scores
        ],
        "topics": topics,
        "weakAreas": [
            {"name": item["topic"], "score": item["percentage"]}
            for item in weak_topics
        ],
        "strongAreas": [
            {"name": item["topic"], "score": item["percentage"]}
            for item in strong_topics
        ],
        "timeSpent": [
            {
                "name": item["topic"],
                "value": max(round(item["time_spent_seconds"] / 60, 1), 0.1),
                "color": "#6366f1",
            }
            for item in topic_summary
        ],
        "totalTime": f"{round(total_time_seconds / 60, 1)} minutes",
        "recent": [
            {"title": item["topic"], "score": f"{item['score']}/{item['total']}"}
            for item in quiz_scores[-5:]
        ],
        "insight": "Focus first on weak topics. Recommendations update after every submitted quiz.",
        "quote": "Small, regular practice beats one long session.",
    }


@router.get("/students")
def get_all_students(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.get("/analytics/{user_id}")
def get_user_analytics(user_id: int, db: Session = Depends(get_db)):
    records = db.query(Performance).filter(Performance.user_id == user_id).all()
    summary = summarize_records(records)
    return {
        "topic_performance": summary["topic_performance"],
        "time_spent": summary["time_spent"],
        "weak_topics": summary["weak_topics"],
        "strong_topics": summary["strong_topics"],
        "quiz_scores": summary["quiz_scores"],
    }


@router.get("/user/{user_id}")
def get_user_performance(user_id: int, db: Session = Depends(get_db)):
    records = db.query(Performance).filter(Performance.user_id == user_id).all()
    return summarize_records(records)


@router.get("/summary")
def get_global_summary(db: Session = Depends(get_db)):
    records = db.query(Performance).all()
    summary = summarize_records(records)
    total_students = db.query(func.count(User.id)).scalar()
    return {
        "total_students": total_students,
        "avg_quiz_score": f"{summary['average_score']}%",
        "average_score": summary["average_score"],
        "accuracy": summary["accuracy"],
        "total_quizzes": summary["total_quizzes"],
        "weak_topics": summary["weak_topics"],
        "strong_topics": summary["strong_topics"],
        "time_spent": summary["time_spent"],
    }
