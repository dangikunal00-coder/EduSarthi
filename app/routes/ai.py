from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.database.models import History

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/ask")
def ask_question(question: str, user_id: int):
    db: Session = SessionLocal()

    # dummy answer for now
    answer = f"Answer for: {question}"

    # store in DB
    new_entry = History(user_id=user_id, question=question, answer=answer)
    db.add(new_entry)
    db.commit()

    return {"answer": answer}