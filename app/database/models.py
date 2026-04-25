from sqlalchemy import Column, Integer, String, Float,Boolean
from .connection import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    email = Column(String(100))



class Interest(Base):
    __tablename__ = "interests"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    interest = Column(String(100))


class History(Base):
    __tablename__ = "history"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    question = Column(String(500))
    answer = Column(String(1000))
class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    description = Column(String(500))
    category = Column(String(100))
    level = Column(String(50))
    image_url = Column(String(300))
    price = Column(Float)
    platform = Column(String(100))
    url = Column(String(300))
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    description = Column(String(500))
    tech_stack = Column(String(200))
    category = Column(String(100))
    image_url = Column(String(300))
    url = Column(String(300))
class Tutorial(Base):
    __tablename__ = "tutorials"

    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    topic = Column(String(100))
    video_url = Column(String(300))
    thumbnail = Column(String(300))
class Quiz(Base):
    __tablename__ = "quiz"

    id = Column(Integer, primary_key=True)
    question = Column(String(500))
    option_a = Column(String(200))
    option_b = Column(String(200))
    option_c = Column(String(200))
    option_d = Column(String(200))
    correct_answer = Column(String(1))  # A/B/C/D
    category = Column(String(100))  

    # DSA, Web Development, etc.
class Performance(Base):
    __tablename__ = "performance"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    category = Column(String(100))
    score = Column(Integer)
    total = Column(Integer)
    weak = Column(Boolean, default=False)