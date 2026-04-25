from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.database.models import User, Interest

router = APIRouter(prefix="/user", tags=["User"])


# Request Schema
class UserCreate(BaseModel):
    name: str
    email: str
    interests: list[str]


@router.post("/register")
def register_user(data: UserCreate):
    db: Session = SessionLocal()

    # create user
    new_user = User(name=data.name, email=data.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # store interests
    for i in data.interests:
        db.add(Interest(user_id=new_user.id, interest=i))

    db.commit()

    return {
        "message": "User created successfully",
        "user_id": new_user.id
    }