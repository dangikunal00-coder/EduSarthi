from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.database.models import Interest, User

router = APIRouter(prefix="/user", tags=["User"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class UserCreate(BaseModel):
    firebase_uid: str
    name: str
    email: Optional[str] = None
    course: Optional[str] = None
    semester: Optional[str] = None
    college: Optional[str] = None
    phone: Optional[str] = None
    interests: list[str] = []


@router.post("/create")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return sync_user(user, db)


@router.post("/sync")
def sync_user(user: UserCreate, db: Session = Depends(get_db)):
    backend_user = db.query(User).filter(User.firebase_uid == user.firebase_uid).first()

    if backend_user:
        backend_user.name = user.name
        backend_user.email = user.email
        backend_user.course = user.course
        backend_user.semester = user.semester
        backend_user.college = user.college
        backend_user.phone = user.phone
        db.query(Interest).filter(Interest.user_id == backend_user.id).delete()
    else:
        backend_user = User(
            firebase_uid=user.firebase_uid,
            name=user.name,
            email=user.email,
            course=user.course,
            semester=user.semester,
            college=user.college,
            phone=user.phone,
        )
        db.add(backend_user)
        db.flush()

    cleaned_interests = []
    for interest in user.interests:
        value = interest.strip()
        if value and value not in cleaned_interests:
            cleaned_interests.append(value)
            db.add(Interest(user_id=backend_user.id, interest=value))

    db.commit()
    db.refresh(backend_user)

    return {
        "user_id": backend_user.id,
        "firebase_uid": backend_user.firebase_uid,
        "name": backend_user.name,
        "email": backend_user.email,
        "course": backend_user.course,
        "semester": backend_user.semester,
        "college": backend_user.college,
        "phone": backend_user.phone,
        "interests": cleaned_interests,
    }


@router.get("/map/{firebase_uid}")
def get_user_id(firebase_uid: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

    if not user:
        return {"error": "User not found"}

    interests = db.query(Interest).filter(Interest.user_id == user.id).all()

    return {
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "course": user.course,
        "semester": user.semester,
        "college": user.college,
        "phone": user.phone,
        "interests": [i.interest for i in interests],
    }
