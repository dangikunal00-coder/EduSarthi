import os

from fastapi import FastAPI
from app.routes import user, ai, quiz, performance
from app.database.connection import engine, Base
from app.database import models
from app.routes import recommendation
from app.routes import vector_ai
from fastapi.middleware.cors import CORSMiddleware
from app.routes import admin
from sqlalchemy import inspect, text


app = FastAPI()

def get_allowed_origins():
    configured = os.getenv("ALLOWED_ORIGINS", "")
    origins = [origin.strip() for origin in configured.split(",") if origin.strip()]
    return origins or [
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ]


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(vector_ai.router)
app.include_router(recommendation.router)

app.include_router(user.router)
app.include_router(ai.router)
app.include_router(quiz.router)
app.include_router(performance.router)

@app.get("/")
def root():
    return {"message": "AI Education Backend Running"}

Base.metadata.create_all(bind=engine)

def ensure_performance_columns():
    inspector = inspect(engine)
    user_columns = {column["name"] for column in inspector.get_columns("users")}
    performance_columns = {column["name"] for column in inspector.get_columns("performance")}
    migrations = []

    for column_name, column_type in {
        "course": "VARCHAR(100)",
        "semester": "VARCHAR(50)",
        "college": "VARCHAR(150)",
        "phone": "VARCHAR(50)",
    }.items():
        if column_name not in user_columns:
            migrations.append(f"ALTER TABLE users ADD COLUMN {column_name} {column_type}")

    if "time_spent_seconds" not in performance_columns:
        migrations.append("ALTER TABLE performance ADD COLUMN time_spent_seconds INT DEFAULT 0")
    if "created_at" not in performance_columns:
        migrations.append("ALTER TABLE performance ADD COLUMN created_at DATETIME")

    if migrations:
        with engine.begin() as connection:
            for migration in migrations:
                connection.execute(text(migration))


ensure_performance_columns()
app.include_router(admin.router)
