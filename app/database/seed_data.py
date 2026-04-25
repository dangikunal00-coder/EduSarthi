
from app.database.connection import SessionLocal
from app.database.models import Course
from app.database.models import Tutorial
from app.database.models import Project
from app.database.models import Quiz
db = SessionLocal()
courses_data = [

# 🔹 Programming
{
"title": "C Programming Course",
"category": "Programming",
"description": "Learn C programming from basics with hands-on examples.",
"level": "Beginner",
"image_url": "https://codewithharry.com/static/home/img/courses/c.png",
"price": 0,
"platform": "CodeWithHarry",
"url": "https://www.codewithharry.com/videos/c-language-tutorials-in-hindi/"
},
{
"title": "C++ DSA Course",
"category": "Programming",
"description": "Master C++ and DSA concepts.",
"level": "Beginner",
"image_url": "https://img.youtube.com/vi/yGB9jhsEsr8/0.jpg",
"price": 0,
"platform": "Apna College",
"url": "https://www.youtube.com/watch?v=yGB9jhsEsr8"
},
{
"title": "Java Programming Masterclass",
"category": "Programming",
"description": "Complete Java course from beginner to advanced.",
"level": "Intermediate",
"image_url": "https://img-c.udemycdn.com/course/480x270/533682_c10c_4.jpg",
"price": 499,
"platform": "Udemy",
"url": "https://www.udemy.com/course/java-the-complete-java-developer-course/"
},
{
"title": "Python for Everybody",
"category": "Programming",
"description": "Learn Python from University of Michigan.",
"level": "Beginner",
"image_url": "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.coursera.org/python.png",
"price": 0,
"platform": "Coursera",
"url": "https://www.coursera.org/specializations/python"
},

# 🔹 Core CS
{
"title": "Data Structures & Algorithms",
"category": "DSA",
"description": "Complete DSA course for interviews.",
"level": "Intermediate",
"image_url": "https://img-c.udemycdn.com/course/480x270/2776760_f176.jpg",
"price": 599,
"platform": "Udemy",
"url": "https://www.udemy.com/course/datastructurescncpp/"
},
{
"title": "Operating Systems",
"category": "OS",
"description": "Understand OS concepts clearly.",
"level": "Intermediate",
"image_url": "https://img.youtube.com/vi/26QPDBe-NB8/0.jpg",
"price": 0,
"platform": "Apna College",
"url": "https://www.youtube.com/watch?v=26QPDBe-NB8"
},
{
"title": "Database Management Systems",
"category": "DBMS",
"description": "Learn DBMS concepts and SQL.",
"level": "Intermediate",
"image_url": "https://img.youtube.com/vi/HXV3zeQKqGY/0.jpg",
"price": 0,
"platform": "CodeWithHarry",
"url": "https://www.youtube.com/watch?v=HXV3zeQKqGY"
},

# 🔹 Web Development
{
"title": "Full Stack Web Development",
"category": "Web Development",
"description": "Complete full stack course with projects.",
"level": "Intermediate",
"image_url": "https://img-c.udemycdn.com/course/480x270/1565838_e54e_16.jpg",
"price": 699,
"platform": "Udemy",
"url": "https://www.udemy.com/course/the-complete-web-development-bootcamp/"
},
{
"title": "Frontend Development (React)",
"category": "Web Development",
"description": "Learn React from basics.",
"level": "Intermediate",
"image_url": "https://img.youtube.com/vi/bMknfKXIFA8/0.jpg",
"price": 0,
"platform": "Apna College",
"url": "https://www.youtube.com/watch?v=bMknfKXIFA8"
},
{
"title": "Backend Development with Node.js",
"category": "Web Development",
"description": "Build backend apps using Node.js.",
"level": "Intermediate",
"image_url": "https://img.youtube.com/vi/TlB_eWDSMt4/0.jpg",
"price": 0,
"platform": "CodeWithHarry",
"url": "https://www.youtube.com/watch?v=TlB_eWDSMt4"
},

# 🔹 AI/ML
{
"title": "AI for Everyone",
"category": "AI",
"description": "Introduction to Artificial Intelligence.",
"level": "Beginner",
"image_url": "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.coursera.org/ai.png",
"price": 0,
"platform": "Coursera",
"url": "https://www.coursera.org/learn/ai-for-everyone"
},
{
"title": "Machine Learning A-Z",
"category": "AI",
"description": "Hands-on ML course.",
"level": "Intermediate",
"image_url": "https://img-c.udemycdn.com/course/480x270/950390_270f_3.jpg",
"price": 799,
"platform": "Udemy",
"url": "https://www.udemy.com/course/machinelearning/"
},

# 🔹 Modern Tech
{
"title": "Cloud Computing",
"category": "Cloud",
"description": "Learn AWS cloud basics.",
"level": "Beginner",
"image_url": "https://img-c.udemycdn.com/course/480x270/3623286_2c4a.jpg",
"price": 499,
"platform": "Udemy",
"url": "https://www.udemy.com/course/aws-certified-cloud-practitioner/"
},
{
"title": "Cyber Security Basics",
"category": "Cyber Security",
"description": "Intro to cybersecurity concepts.",
"level": "Beginner",
"image_url": "https://img.youtube.com/vi/inWWhr5tnEA/0.jpg",
"price": 0,
"platform": "YouTube",
"url": "https://www.youtube.com/watch?v=inWWhr5tnEA"
},
{
"title": "Blockchain Fundamentals",
"category": "Blockchain",
"description": "Learn blockchain basics.",
"level": "Beginner",
"image_url": "https://img-c.udemycdn.com/course/480x270/2145230_6e73_2.jpg",
"price": 499,
"platform": "Udemy",
"url": "https://www.udemy.com/course/blockchain-and-bitcoin-fundamentals/"
}

]
for course in courses_data:
    new_course = Course(
        title=course["title"],
        category=course["category"],
        description=course["description"],
        level=course["level"],
        image_url=course["image_url"],
        price=course["price"],
        platform=course["platform"],
        url=course["url"]
    )
    db.add(new_course)

db.commit()

print("✅ Courses inserted successfully!")
projects_data = [

# 🔹 Programming / DSA
{
"title": "Sorting Visualizer",
"description": "Visualize sorting algorithms like bubble, merge, quick sort.",
"tech_stack": "HTML, CSS, JavaScript",
"category": "DSA",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/sorting-visualizer"
},
{
"title": "Binary Search Visualizer",
"description": "Interactive visualization of binary search algorithm.",
"tech_stack": "React, JavaScript",
"category": "DSA",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/binary-search"
},

# 🔹 Core CS
{
"title": "Mini DBMS System",
"description": "Basic database system with CRUD operations.",
"tech_stack": "Python, MySQL",
"category": "DBMS",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/dbms-project"
},
{
"title": "Process Scheduling Simulator",
"description": "Simulate CPU scheduling algorithms like FCFS, SJF.",
"tech_stack": "C++, GUI",
"category": "OS",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/operating-system"
},

# 🔹 Web Development
{
"title": "Portfolio Website",
"description": "Personal portfolio website to showcase projects.",
"tech_stack": "HTML, CSS, JavaScript",
"category": "Web Development",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/portfolio-website"
},
{
"title": "Blog Application",
"description": "Full-stack blog app with authentication and CRUD.",
"tech_stack": "React, Node.js, MongoDB",
"category": "Web Development",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/blog-app"
},
{
"title": "E-commerce Website",
"description": "Online shopping platform with cart and payment.",
"tech_stack": "React, Node.js, MySQL",
"category": "Web Development",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/ecommerce"
},
{
"title": "Chat Application",
"description": "Real-time chat app using WebSockets.",
"tech_stack": "Node.js, Socket.io",
"category": "Web Development",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/chat-application"
},

# 🔹 AI / ML
{
"title": "Spam Email Classifier",
"description": "Classify emails as spam or not using ML.",
"tech_stack": "Python, Scikit-learn",
"category": "AI",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/spam-classification"
},
{
"title": "Face Recognition System",
"description": "Recognize faces using computer vision.",
"tech_stack": "Python, OpenCV",
"category": "AI",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/face-recognition"
},
{
"title": "Chatbot using NLP",
"description": "AI chatbot using natural language processing.",
"tech_stack": "Python, NLP",
"category": "AI",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/chatbot"
},

# 🔹 Modern Tech
{
"title": "Cloud File Storage System",
"description": "Upload and manage files on cloud.",
"tech_stack": "AWS, Node.js",
"category": "Cloud",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/cloud-storage"
},
{
"title": "DevOps CI/CD Pipeline",
"description": "Automate build and deployment pipeline.",
"tech_stack": "Docker, Jenkins",
"category": "DevOps",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/devops"
},
{
"title": "Cyber Security Scanner",
"description": "Scan system for vulnerabilities.",
"tech_stack": "Python, Security Tools",
"category": "Cyber Security",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/cyber-security"
},
{
"title": "Blockchain Voting System",
"description": "Secure voting system using blockchain.",
"tech_stack": "Solidity, Ethereum",
"category": "Blockchain",
"image_url": "https://via.placeholder.com/150",
"url": "https://github.com/topics/blockchain"
}

]
for project in projects_data:
    new_project = Project(
        title=project["title"],
        description=project["description"],
        tech_stack=project["tech_stack"],
        category=project["category"],
        image_url=project["image_url"],
        url=project["url"]
    )
    db.add(new_project)

db.commit()
print("✅ Projects inserted successfully!")
tutorials_data = [

# 🔹 Programming
{
"title": "C Programming Full Tutorial",
"topic": "Programming",
"video_url": "https://www.youtube.com/watch?v=KJgsSFOSQv0",
"thumbnail": "https://img.youtube.com/vi/KJgsSFOSQv0/0.jpg"
},
{
"title": "Python Full Course for Beginners",
"topic": "Programming",
"video_url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
"thumbnail": "https://img.youtube.com/vi/rfscVS0vtbw/0.jpg"
},

# 🔹 DSA
{
"title": "Data Structures & Algorithms in One Shot",
"topic": "DSA",
"video_url": "https://www.youtube.com/watch?v=8hly31xKli0",
"thumbnail": "https://img.youtube.com/vi/8hly31xKli0/0.jpg"
},
{
"title": "Recursion Explained with Examples",
"topic": "DSA",
"video_url": "https://www.youtube.com/watch?v=ngCos392W4w",
"thumbnail": "https://img.youtube.com/vi/ngCos392W4w/0.jpg"
},

# 🔹 Core CS
{
"title": "Operating System Full Course",
"topic": "OS",
"video_url": "https://www.youtube.com/watch?v=26QPDBe-NB8",
"thumbnail": "https://img.youtube.com/vi/26QPDBe-NB8/0.jpg"
},
{
"title": "DBMS Complete Tutorial",
"topic": "DBMS",
"video_url": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
"thumbnail": "https://img.youtube.com/vi/HXV3zeQKqGY/0.jpg"
},

# 🔹 Web Development
{
"title": "HTML & CSS Crash Course",
"topic": "Web Development",
"video_url": "https://www.youtube.com/watch?v=mU6anWqZJcc",
"thumbnail": "https://img.youtube.com/vi/mU6anWqZJcc/0.jpg"
},
{
"title": "JavaScript Full Course",
"topic": "Web Development",
"video_url": "https://www.youtube.com/watch?v=W6NZfCO5SIk",
"thumbnail": "https://img.youtube.com/vi/W6NZfCO5SIk/0.jpg"
},

# 🔹 AI / ML
{
"title": "Machine Learning Basics",
"topic": "AI",
"video_url": "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
"thumbnail": "https://img.youtube.com/vi/GwIo3gDZCVQ/0.jpg"
},

# 🔹 Modern Tech
{
"title": "Cloud Computing Explained",
"topic": "Cloud",
"video_url": "https://www.youtube.com/watch?v=2LaAJq1lB1Q",
"thumbnail": "https://img.youtube.com/vi/2LaAJq1lB1Q/0.jpg"
}

]
for tutorial in tutorials_data:
    new_tutorial = Tutorial(
        title=tutorial["title"],
        topic=tutorial["topic"],
        video_url=tutorial["video_url"],
        thumbnail=tutorial["thumbnail"]
    )
    db.add(new_tutorial)

db.commit()
print("✅ Tutorials inserted successfully!")
quiz_data = [

# 🔹 DSA
{
"question": "What is the time complexity of binary search?",
"option_a": "O(n)",
"option_b": "O(log n)",
"option_c": "O(n log n)",
"option_d": "O(1)",
"correct_answer": "B",
"category": "DSA"
},
{
"question": "Which data structure uses FIFO?",
"option_a": "Stack",
"option_b": "Queue",
"option_c": "Tree",
"option_d": "Graph",
"correct_answer": "B",
"category": "DSA"
},

# 🔹 Web Development
{
"question": "Which language is used for styling web pages?",
"option_a": "HTML",
"option_b": "CSS",
"option_c": "Python",
"option_d": "Java",
"correct_answer": "B",
"category": "Web Development"
},
{
"question": "Which is a JavaScript framework?",
"option_a": "Django",
"option_b": "Flask",
"option_c": "React",
"option_d": "Laravel",
"correct_answer": "C",
"category": "Web Development"
},

# 🔹 DBMS
{
"question": "Which SQL command is used to fetch data?",
"option_a": "INSERT",
"option_b": "UPDATE",
"option_c": "SELECT",
"option_d": "DELETE",
"correct_answer": "C",
"category": "DBMS"
},

# 🔹 OS
{
"question": "Which scheduling algorithm is non-preemptive?",
"option_a": "Round Robin",
"option_b": "FCFS",
"option_c": "Priority Scheduling",
"option_d": "Multilevel Queue",
"correct_answer": "B",
"category": "OS"
},

# 🔹 AI
{
"question": "Which algorithm is used in Machine Learning?",
"option_a": "Linear Regression",
"option_b": "Bubble Sort",
"option_c": "Binary Search",
"option_d": "DFS",
"correct_answer": "A",
"category": "AI"
},

# 🔹 Cloud
{
"question": "Which is a cloud service provider?",
"option_a": "AWS",
"option_b": "Linux",
"option_c": "Git",
"option_d": "Docker",
"correct_answer": "A",
"category": "Cloud"
}

]
for q in quiz_data:
    exists = db.query(Quiz).filter(Quiz.question == q["question"]).first()

    if not exists:
        new_q = Quiz(
            question=q["question"],
            option_a=q["option_a"],
            option_b=q["option_b"],
            option_c=q["option_c"],
            option_d=q["option_d"],
            correct_answer=q["correct_answer"],
            category=q["category"]
        )
        db.add(new_q)

db.commit()
print("✅ Quiz inserted successfully!")