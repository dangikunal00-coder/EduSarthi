from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.database.models import Interest, Course, Project, Tutorial
from app.database.models import Performance

router = APIRouter(prefix="/recommend", tags=["Recommendation"])


@router.get("/{user_id}")
def get_recommendation(user_id: int):
    db: Session = SessionLocal()

    # 🔹 Get user interests
    interests = db.query(Interest).filter(Interest.user_id == user_id).all()
    interest_list = [i.interest for i in interests]

    weak_records = db.query(Performance)\
    .filter(
        Performance.user_id == user_id,
        Performance.weak == True
    ).all()

    weak_topics = [w.category for w in weak_records]

    # 🔹 Fetch courses
    courses = db.query(Course)\
    .filter(Course.category.in_(weak_topics))\
    .limit(3)\
    .all()

    more_courses = db.query(Course)\
    .filter(Course.category.in_(interest_list))\
    .limit(3)\
    .all()

    courses = courses + more_courses


    # 🔹 Fetch projects
    projects = db.query(Project)\
        .filter(Project.category.in_(interest_list))\
        .limit(5)\
        .all()
        
    

    more_projects = db.query(Project)\
    .filter(Project.category.in_(interest_list))\
    .limit(3)\
    .all()

    projects = projects + more_projects


    # 🔹 Fetch tutorials
    tutorials = db.query(Tutorial)\
        .filter(Tutorial.topic.in_(interest_list))\
        .limit(5)\
        .all()
    
   
    more_tutorials = db.query(Tutorial)\
    .filter(Tutorial.category.in_(interest_list))\
    .limit(3)\
    .all()

    tutorials = tutorials + more_tutorials

    # 🔹 Format response
    course_data = [
        {
            "title": c.title,
            "description": c.description,
            "image_url": c.image_url,
            "price": c.price,
            "platform": c.platform,
            "url": c.url,
            "category": c.category
        } for c in courses
    ]

    project_data = [
        {
            "title": p.title,
            "description": p.description,
            "tech_stack": p.tech_stack,
            "image_url": p.image_url,
            "url": p.url,
            "category": p.category
        } for p in projects
    ]

    tutorial_data = [
        {
            "title": t.title,
            "topic": t.topic,
            "video_url": t.video_url,
            "thumbnail": t.thumbnail
        } for t in tutorials
    ]

    return {
        "interests": interest_list,
        "courses": course_data,
        "projects": project_data,
        "tutorials": tutorial_data
    }
