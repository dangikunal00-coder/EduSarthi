import os
import json
import re
import uuid
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from google import genai
from fastapi.middleware.cors import CORSMiddleware

# ── Load environment ────────────────────────────────────────────────
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Gemini client (same as your original) ──────────────────────────
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# ════════════════════════════════════════════════════════════════════
#  EXISTING CHAT LOGIC  (unchanged from your original)
# ════════════════════════════════════════════════════════════════════

class Query(BaseModel):
    question: str
    mode: str


def get_prompt(mode):
    if mode == "beginner":
        return "Explain in simple terms with examples."
    elif mode == "exam":
        return "Give a structured 5-mark answer."
    elif mode == "revision":
        return "Give short bullet points."
    else:
        return "Explain clearly."


# Global chat memory
chat_history = []


@app.post("/chat")
def chat(query: Query):
    chat_history.append(f"User: {query.question}")

    full_prompt = f"""
You are an AI tutor for BTech CSE students.

{get_prompt(query.mode)}

Conversation:
{chr(10).join(chat_history)}

AI:
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt
        )
        bot_reply = response.text
        chat_history.append(f"AI: {bot_reply}")

        if len(chat_history) > 10:
            chat_history.pop(0)

        return {"response": bot_reply}

    except Exception as e:
        return {"error": str(e)}


# ════════════════════════════════════════════════════════════════════
#  QUIZ FEATURE  (new addition)
# ════════════════════════════════════════════════════════════════════

# In-memory quiz sessions  { quiz_id: { ...session data... } }
quiz_sessions: dict = {}


class StartQuizRequest(BaseModel):
    topic: str


class AnswerRequest(BaseModel):
    quiz_id: str
    question_index: int
    selected_option: str   # just the letter: "A", "B", "C", or "D"


# ── Single Gemini prompt — all 10 questions in one call ───────────
def build_quiz_prompt(topic: str) -> str:
    return f"""
You are an expert quiz generator for BTech CSE students.
Generate exactly 10 MCQ questions on the topic: "{topic}".

Difficulty split (STRICT — do not change the order):
- Questions 1-4  → EASY   (basic definitions, simple recall)
- Questions 5-8  → MEDIUM (application, comparison, analysis)
- Questions 9-10 → HARD   (complex scenarios, tricky edge cases)

STRICT OUTPUT RULES:
- Return ONLY a valid JSON array of exactly 10 objects. No markdown, no explanation, nothing else.
- Each object must have these exact keys: "question", "options", "answer", "explanation"
- "options" must be an array of exactly 4 strings, each prefixed: "A. ...", "B. ...", "C. ...", "D. ..."
- "answer" must be ONLY a single letter: A, B, C, or D
- "explanation" must be 1-2 clear sentences explaining the correct answer

Return format:
[
  {{
    "question": "Question text here?",
    "options": ["A. Option one", "B. Option two", "C. Option three", "D. Option four"],
    "answer": "A",
    "explanation": "Explanation of why A is correct."
  }}
]

Return ONLY the JSON array. Exactly 10 questions.
"""


def extract_json_array(raw: str) -> list:
    """Safely extract JSON array from Gemini response."""
    raw = raw.strip()
    raw = re.sub(r"```(?:json)?", "", raw).strip().rstrip("`").strip()
    start = raw.find("[")
    end   = raw.rfind("]") + 1
    if start == -1 or end == 0:
        raise ValueError("No JSON array found in response")
    return json.loads(raw[start:end])


def generate_all_questions(topic: str) -> list:
    """ONE Gemini call → 10 questions (4 easy + 4 medium + 2 hard)."""
    prompt   = build_quiz_prompt(topic)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    questions = extract_json_array(response.text)

    if len(questions) != 10:
        raise ValueError(f"Expected 10 questions, got {len(questions)}")

    # Normalise answer to single uppercase letter
    for q in questions:
        q["answer"] = q["answer"].strip().upper()[0]

    return questions


# ── Quiz Endpoints ─────────────────────────────────────────────────

@app.post("/quiz/start")
def start_quiz(body: StartQuizRequest):
    """
    ONE Gemini call generates all 10 questions.
    Stores them in session. Returns quiz_id + all questions
    (answers stripped) so the frontend never needs to call back
    for the next question — zero Gemini calls during the quiz.
    """
    topic = body.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic cannot be empty")

    try:
        all_questions = generate_all_questions(topic)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")


    quiz_id = str(uuid.uuid4())
    quiz_sessions[quiz_id] = {
        "topic":         topic,
        "questions":     all_questions,   # full data with answers, server-side only
        "current_index": 0,
        "score":         0,
        "wrong_topics":  [],
    }

    # Strip answers before sending to frontend. Frontend stores all 10
    # and shows one at a time locally — no per-question API calls.
    questions_for_client = [
        {"question": q["question"], "options": q["options"]}
        for q in all_questions
    ]

    return {
        "quiz_id":         quiz_id,
        "total_questions": 10,
        "questions":       questions_for_client,
    }


@app.post("/quiz/answer")
def submit_answer(body: AnswerRequest):
    """
    Validate a single answer. No Gemini call needed — all questions
    are already in the session from /quiz/start.
    Frontend handles navigation; this just checks correct/wrong,
    updates score, and returns explanation.
    On the final question it returns the full result summary.
    """
    session = quiz_sessions.get(body.quiz_id)
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found. Please start a new quiz.")

    idx       = body.question_index
    questions = session["questions"]

    if idx < 0 or idx >= len(questions):
        raise HTTPException(status_code=400, detail="Invalid question index.")

    q              = questions[idx]
    correct_letter = q["answer"].upper()
    given_letter   = body.selected_option.strip().upper()[0]
    is_correct     = given_letter == correct_letter

    if is_correct:
        session["score"] += 1
    else:
        session["wrong_topics"].append(q["question"][:80])

    quiz_done = (idx + 1) >= len(questions)

    result = {
        "is_correct":     is_correct,
        "correct_answer": correct_letter,
        "explanation":    q["explanation"],
        "score":          session["score"],
        "question_index": idx,
        "quiz_complete":  quiz_done,
    }

    if quiz_done:
        seen, weak = set(), []
        for w in session["wrong_topics"]:
            short = w[:60]
            if short not in seen:
                seen.add(short)
                weak.append(short)

        result["final_score"] = session["score"]
        result["total"]       = len(questions)
        result["topic"]       = session["topic"]
        result["weak_areas"]  = weak[:5]

        # Clean up session memory
        del quiz_sessions[body.quiz_id]

    return result