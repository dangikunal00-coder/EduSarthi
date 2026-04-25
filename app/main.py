from fastapi import FastAPI
from app.routes import user, ai, quiz, performance
from app.database.connection import engine, Base
from app.database import models
from app.routes import recommendation

app = FastAPI()

app.include_router(user.router)
app.include_router(ai.router)
app.include_router(quiz.router)
app.include_router(performance.router)

@app.get("/")
def root():
    return {"message": "AI Education Backend Running"}

Base.metadata.create_all(bind=engine)
app.include_router(recommendation.router)