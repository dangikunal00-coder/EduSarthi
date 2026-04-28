/* ════════════════════════════════════════════════════════════════════
   EduSarthi AI — script.js
   Handles: chat messages, quiz intent detection, quiz overlay UI
════════════════════════════════════════════════════════════════════ */

const API_BASE = "http://127.0.0.1:8000"; // ← your FastAPI backend URL

/* ════════════════════════════════════════════════════════════════════
   QUIZ STATE  (all quiz data lives here)
════════════════════════════════════════════════════════════════════ */
const quiz = {
  id: null,
  topic: "",
  questions: [], // ALL 10 questions stored here after /quiz/start
  currentIndex: 0,
  totalQuestions: 10,
  score: 0,
  selectedLetter: null, // which option the user clicked
  answered: false, // whether current Q has been submitted
};

/* ════════════════════════════════════════════════════════════════════
   DOM REFERENCES
════════════════════════════════════════════════════════════════════ */
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Quiz overlay elements
const quizOverlay = document.getElementById("quiz-overlay");
const progressFill = document.getElementById("progress-fill");
const qCounter = document.getElementById("question-counter");
const diffTag = document.getElementById("difficulty-tag");
const liveScore = document.getElementById("live-score-badge");
const quizTopicDisp = document.getElementById("quiz-topic-display");

// Quiz states
const stateLoading = document.getElementById("state-loading");
const stateAskTopic = document.getElementById("state-ask-topic");
const stateQuestion = document.getElementById("state-question");
const stateResult = document.getElementById("state-result");

// Question elements
const qNumberLabel = document.getElementById("q-number-label");
const qText = document.getElementById("q-text");
const optionsList = document.getElementById("options-list");
const feedbackBox = document.getElementById("feedback-box");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");

/* ════════════════════════════════════════════════════════════════════
   CHAT LOGIC
════════════════════════════════════════════════════════════════════ */

// Patterns that trigger quiz mode via chat message
const QUIZ_PATTERNS = [
  /generate quiz on (.+)/i,
  /generate quiz about (.+)/i,
  /quiz (?:me )?on (.+)/i,
  /quiz (?:me )?about (.+)/i,
  /start quiz on (.+)/i,
  /start quiz about (.+)/i,
  /take quiz on (.+)/i,
];

sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});

function handleSend() {
  const message = userInput.value.trim();
  if (!message) return;

  // Show user message in chat
  appendUserMessage(message);
  userInput.value = "";

  // Check if it's a quiz request
  for (const pattern of QUIZ_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      const topic = match[1].trim();
      showQuizStartMessage(topic);
      return;
    }
  }

  // Normal chat: send to /chat endpoint
  sendChatMessage(message);
}

function appendUserMessage(text) {
  const div = document.createElement("div");
  div.className = "user-msg";
  div.innerText = text;
  chatBox.appendChild(div);
  scrollChatToBottom();
}

function appendBotMessage(html) {
  const div = document.createElement("div");
  div.className = "bot-msg";
  div.innerHTML = html;
  chatBox.appendChild(div);
  scrollChatToBottom();
  return div;
}

function scrollChatToBottom() {
  const container = document.getElementById("chat-container");
  container.scrollTop = container.scrollHeight;
}

async function sendChatMessage(message) {
  // Show a "typing…" placeholder
  const placeholder = appendBotMessage("⏳ Thinking…");

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: message, mode: "beginner" }),
    });
    const data = await res.json();
    placeholder.innerText =
      data.response || "Sorry, I could not get a response.";
  } catch {
    placeholder.innerText =
      "❌ Cannot connect to server. Make sure the backend is running.";
  }

  scrollChatToBottom();
}

/* ─── Show quiz start prompt inside chat ─── */
function showQuizStartMessage(topic) {
  const msgDiv = appendBotMessage(
    `📚 Great! I'll generate a quiz on <strong>${escapeHtml(topic)}</strong>.<br/>
     It will have <strong>10 questions</strong> (4 Easy → 4 Medium → 2 Hard).<br/><br/>
     <button class="chat-quiz-btn" onclick="openQuizFromChat('${escapeHtml(topic)}')">
       🚀 Start Quiz
     </button>`,
  );
}

function escapeHtml(str) {
  return str.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

/* ════════════════════════════════════════════════════════════════════
   QUIZ OVERLAY — OPEN / CLOSE
════════════════════════════════════════════════════════════════════ */

/*
  WAY 1: User typed "Generate quiz on DSA" → topic already known
*/
function openQuizFromChat(topic) {
  quiz.topic = topic;
  quizTopicDisp.textContent = topic + " Quiz";
  showQuizOverlay();
  switchQuizState("loading");
  fetchAndStartQuiz(topic);
}

/*
  WAY 2: User clicked "🎯 Take a Quiz" header button → ask topic first
*/
function openQuizFromButton() {
  quizTopicDisp.textContent = "Quiz";
  showQuizOverlay();
  switchQuizState("ask-topic");
  document.getElementById("topic-input").value = "";
  // Focus the input after animation
  setTimeout(() => document.getElementById("topic-input").focus(), 450);
}

/* Called when user submits topic from the ask-topic screen */
function submitTopic() {
  const topic = document.getElementById("topic-input").value.trim();
  if (!topic) {
    document.getElementById("topic-input").style.borderColor = "#ef4444";
    setTimeout(() => {
      document.getElementById("topic-input").style.borderColor = "#2b74c7";
    }, 1500);
    return;
  }
  quiz.topic = topic;
  quizTopicDisp.textContent = topic + " Quiz";
  switchQuizState("loading");
  fetchAndStartQuiz(topic);
}

// Allow pressing Enter in topic input
document.getElementById("topic-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") submitTopic();
});

function showQuizOverlay() {
  quizOverlay.classList.add("open");
  resetProgressBar();
}

function closeQuiz() {
  quizOverlay.classList.remove("open");
  // Post a friendly message in chat when closing mid-quiz
  setTimeout(() => {
    if (quiz.id) {
      appendBotMessage("Quiz closed. Feel free to ask me anything! 😊");
      quiz.id = null;
    }
  }, 400);
}

/* ════════════════════════════════════════════════════════════════════
   QUIZ STATE SWITCHER
════════════════════════════════════════════════════════════════════ */
function switchQuizState(state) {
  // Hide all states
  stateLoading.style.display = "none";
  stateAskTopic.style.display = "none";
  stateQuestion.style.display = "none";
  stateResult.style.display = "none";

  // Show requested state
  if (state === "loading") stateLoading.style.display = "flex";
  if (state === "ask-topic") stateAskTopic.style.display = "flex";
  if (state === "question") stateQuestion.style.display = "flex";
  if (state === "result") stateResult.style.display = "flex";
}

/* ════════════════════════════════════════════════════════════════════
   FETCH QUIZ FROM BACKEND
════════════════════════════════════════════════════════════════════ */
async function fetchAndStartQuiz(topic) {
  try {
    const res = await fetch(`${API_BASE}/quiz/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    if (!res.ok) throw new Error("Server error: " + res.status);

    const data = await res.json();

    // Store ALL questions locally — no more per-question API calls
    quiz.id = data.quiz_id;
    quiz.questions = data.questions; // array of 10 {question, options}
    quiz.totalQuestions = data.total_questions;
    quiz.currentIndex = 0;
    quiz.score = 0;

    // Render first question immediately from local data
    renderQuestion(quiz.questions[0], 0);
  } catch (err) {
    stateLoading.innerHTML = `
      <p style="color:#ef4444;text-align:center;">
        ⚠ Failed to generate quiz.<br/>
        <span style="font-size:13px;color:#8b949e;">${err.message}</span><br/><br/>
        <button class="btn-back-chat" onclick="closeQuiz()">← Back to Chat</button>
      </p>`;
  }
}

/* ════════════════════════════════════════════════════════════════════
   RENDER A QUESTION
════════════════════════════════════════════════════════════════════ */
function renderQuestion(questionData, index) {
  // Reset state
  quiz.selectedLetter = null;
  quiz.answered = false;

  switchQuizState("question");
  updateProgressBar(index);

  // Reset card animation
  const card = document.getElementById("question-card");
  card.style.animation = "none";
  void card.offsetWidth;
  card.style.animation = "";

  // Question number
  qNumberLabel.textContent = `Q${index + 1} / ${quiz.totalQuestions}`;
  qText.textContent = questionData.question;

  // Difficulty label
  const diffClass =
    index < 4 ? "diff-easy" : index < 8 ? "diff-medium" : "diff-hard";
  const diffText = index < 4 ? "🟢 Easy" : index < 8 ? "🟡 Medium" : "🔴 Hard";
  diffTag.className = diffClass;
  diffTag.textContent = diffText;

  // Live score
  liveScore.textContent = `Score: ${quiz.score}`;

  // Build option buttons
  optionsList.innerHTML = "";
  const letters = ["A", "B", "C", "D"];
  questionData.options.forEach((optText, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.dataset.letter = letters[i];
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span> <span>${optText}</span>`;
    btn.addEventListener("click", () => selectOption(btn, letters[i]));
    optionsList.appendChild(btn);
  });

  // Reset action buttons & feedback
  feedbackBox.style.display = "none";
  feedbackBox.innerHTML = "";
  submitBtn.style.display = "inline-block";
  submitBtn.disabled = true;
  nextBtn.style.display = "none";
}

function selectOption(clickedBtn, letter) {
  if (quiz.answered) return;

  // Deselect all
  document
    .querySelectorAll(".option-btn")
    .forEach((b) => b.classList.remove("selected"));

  // Select clicked
  clickedBtn.classList.add("selected");
  quiz.selectedLetter = letter;
  submitBtn.disabled = false;
}

/* ════════════════════════════════════════════════════════════════════
   SUBMIT ANSWER
════════════════════════════════════════════════════════════════════ */
async function submitAnswer() {
  if (!quiz.selectedLetter || quiz.answered) return;

  quiz.answered = true;
  submitBtn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/quiz/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quiz_id: quiz.id,
        question_index: quiz.currentIndex,
        selected_option: quiz.selectedLetter,
      }),
    });

    const data = await res.json();
    quiz.score = data.score;
    liveScore.textContent = `Score: ${quiz.score}`;

    // Highlight options
    document.querySelectorAll(".option-btn").forEach((btn) => {
      btn.disabled = true;
      const letter = btn.dataset.letter;
      if (letter === data.correct_answer) btn.classList.add("correct");
      else if (letter === quiz.selectedLetter) btn.classList.add("wrong");
    });

    // Show feedback
    feedbackBox.style.display = "block";
    feedbackBox.innerHTML = `
      <div class="feedback-banner ${data.is_correct ? "correct" : "wrong"}">
        ${data.is_correct ? "✅ Correct!" : "❌ Incorrect"}
      </div>
      <div class="explanation-text">
        <strong>Explanation:</strong> ${data.explanation}
      </div>`;

    // Hide submit, show next
    submitBtn.style.display = "none";

    if (data.quiz_complete) {
      nextBtn.textContent = "See Results 🏆";
      nextBtn.onclick = () => showResultScreen(data);
    } else {
      nextBtn.textContent = "Next Question →";
      nextBtn.onclick = goToNext;
    }
    nextBtn.style.display = "inline-block";
  } catch (err) {
    quiz.answered = false;
    submitBtn.disabled = false;
    feedbackBox.style.display = "block";
    feedbackBox.innerHTML = `<p style="color:#ef4444;padding:10px;">⚠ Error submitting. Please try again.</p>`;
  }
}

function goToNext() {
  quiz.currentIndex += 1;
  renderQuestion(quiz.questions[quiz.currentIndex], quiz.currentIndex);
}

/* ════════════════════════════════════════════════════════════════════
   RESULT SCREEN
════════════════════════════════════════════════════════════════════ */
function showResultScreen(data) {
  switchQuizState("result");
  updateProgressBar(quiz.totalQuestions); // fill to 100%
  qCounter.textContent = "Quiz Complete!";
  diffTag.textContent = "";

  const score = data.final_score;
  const total = data.total;
  const pct = Math.round((score / total) * 100);

  // Score ring
  document.getElementById("score-ring").style.setProperty("--pct", pct);
  document.getElementById("score-ring-text").textContent = `${score}/${total}`;

  // Title
  let title = "Keep Practising! 💪";
  if (pct >= 90) title = "Outstanding! 🏆";
  else if (pct >= 70) title = "Well Done! 🎉";
  else if (pct >= 50) title = "Good Effort! 📚";
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-subtitle").textContent =
    `You scored ${score} out of ${total} on "${data.topic}" (${pct}%)`;

  // Weak areas
  if (data.weak_areas && data.weak_areas.length > 0) {
    const box = document.getElementById("weak-areas-box");
    const list = document.getElementById("weak-areas-list");
    box.style.display = "block";
    list.innerHTML = data.weak_areas.map((w) => `<li>${w}</li>`).join("");
  } else {
    document.getElementById("weak-areas-box").style.display = "none";
  }

  // Post result back to chat
  appendBotMessage(
    `🎯 Quiz on <strong>${escapeHtml(data.topic)}</strong> done! ` +
      `You scored <strong>${score}/${total}</strong>. ` +
      (pct >= 70 ? "Excellent! 🎉" : "Keep practising! 💪"),
  );

  quiz.id = null; // clear session so close doesn't re-post
}

async function retryQuiz() {
  const topic = quiz.topic;
  quiz.id = null;
  quiz.questions = [];
  await openQuizFromChat(topic);
}

/* ════════════════════════════════════════════════════════════════════
   PROGRESS BAR HELPERS
════════════════════════════════════════════════════════════════════ */
function resetProgressBar() {
  progressFill.style.width = "0%";
  qCounter.textContent = "Question 1 of 10";
  diffTag.textContent = "";
}

function updateProgressBar(index) {
  const pct = (index / quiz.totalQuestions) * 100;
  progressFill.style.width = pct + "%";
  qCounter.textContent =
    index >= quiz.totalQuestions
      ? "Quiz Complete!"
      : `Question ${index + 1} of ${quiz.totalQuestions}`;
}
