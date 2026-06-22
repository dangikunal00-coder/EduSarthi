from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.database.models import Course, Interest, Performance, Project, Tutorial
from app.routes.performance import summarize_records

router = APIRouter(prefix="/recommend", tags=["Recommendation"])


class RecommendationRequest(BaseModel):
    user_id: int


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def serialize_course(course):
    return {
        "title": course.title,
        "description": course.description,
        "image_url": course.image_url,
        "price": course.price,
        "platform": course.platform,
        "url": course.url,
        "category": course.category,
    }


def serialize_project(project):
    return {
        "title": project.title,
        "description": project.description,
        "tech_stack": project.tech_stack,
        "image_url": project.image_url,
        "url": project.url,
        "category": project.category,
    }


def serialize_tutorial(tutorial):
    return {
        "title": tutorial.title,
        "topic": tutorial.topic,
        "video_url": tutorial.video_url,
        "thumbnail": tutorial.thumbnail,
    }


def unique_by_title(items):
    return list({item.title: item for item in items}.values())


def unique_topics(topics: list[str]):
    return list(dict.fromkeys(topic for topic in topics if topic))


def build_learning_path(priority_topics: list[str], weak_topics: list[str]):
    path = []
    weak_set = {topic_to_category(topic) for topic in weak_topics}

    for index, topic in enumerate(priority_topics, start=1):
        focus = "Weak topic recovery" if topic in weak_set else "Interest-based growth"
        path.append(
            {
                "step": index,
                "topic": topic,
                "focus": focus,
                "action": f"Study one course, watch one tutorial, then build one project for {topic}.",
            }
        )

    return path


def topic_to_category(topic: str):
    value = topic.lower()
    if any(word in value for word in ["web", "html", "css", "javascript", "react", "node", "full stack"]):
        return "Web Development"
    if any(word in value for word in ["ai", "artificial", "machine learning", "deep learning", "ml"]):
        return "AI"
    if any(word in value for word in ["dsa", "data structures", "algorithm"]):
        return "DSA"
    if "operating" in value or value == "os":
        return "OS"
    if any(word in value for word in ["dbms", "database", "sql"]):
        return "DBMS"
    if any(word in value for word in ["python", "java", "c++", "programming in c", "programming"]):
        return "Programming"
    if "cloud" in value:
        return "Cloud"
    if "cyber" in value:
        return "Cyber Security"
    if "blockchain" in value:
        return "Blockchain"
    return topic


def build_recommendations(user_id: int, db: Session):
    interests = db.query(Interest).filter(Interest.user_id == user_id).all()
    interest_list = [item.interest for item in interests]

    weak_records = (
        db.query(Performance)
        .filter(Performance.user_id == user_id, Performance.weak == True)
        .all()
    )
    weak_topics = unique_topics(record.category for record in weak_records)
    all_performance = db.query(Performance).filter(Performance.user_id == user_id).all()
    performance_summary = summarize_records(all_performance)

    priority_topics = list(dict.fromkeys(topic_to_category(topic) for topic in weak_topics + interest_list))

    courses = []
    projects = []
    tutorials = []

    if priority_topics:
        courses = db.query(Course).filter(Course.category.in_(priority_topics)).limit(6).all()
        projects = db.query(Project).filter(Project.category.in_(priority_topics)).limit(6).all()
        tutorials = db.query(Tutorial).filter(Tutorial.topic.in_(priority_topics)).limit(6).all()

    if not courses:
        courses = db.query(Course).limit(6).all()
    if not projects:
        projects = db.query(Project).limit(6).all()
    if not tutorials:
        tutorials = db.query(Tutorial).limit(6).all()

    return {
        "interests": interest_list,
        "weak_topics": weak_topics,
        "strong_topics": performance_summary["strong_topics"],
        "priority_topics": priority_topics,
        "learning_path": build_learning_path(priority_topics, weak_topics),
        "courses": [serialize_course(course) for course in unique_by_title(courses)],
        "projects": [serialize_project(project) for project in unique_by_title(projects)],
        "tutorials": [serialize_tutorial(tutorial) for tutorial in unique_by_title(tutorials)],
    }


@router.post("/")
def recommend_for_user(data: RecommendationRequest, db: Session = Depends(get_db)):
    return build_recommendations(data.user_id, db)


@router.get("/{user_id}")
def get_recommend(user_id: int, db: Session = Depends(get_db)):
    return build_recommendations(user_id, db)
