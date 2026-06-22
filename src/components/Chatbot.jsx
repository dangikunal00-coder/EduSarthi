import { useState } from "react";
import { API_BASE_URL, getBackendUserId } from "../services/api";

const getQuizTopic = (message) => {
  const normalized = message.trim();
  const match = normalized.match(/quiz\s+(?:on|about|for)\s+(.+)/i);
  if (match?.[1]) return match[1].trim();
  if (/^quiz$/i.test(normalized)) return "";
  return null;
};

const wantsPerformance = (message) => {
  return /(performance|weak|average|avg|score|marks|quiz data|quizzes|progress)/i.test(message);
};

const formatPerformance = (data) => {
  const quizCount = data?.total_quizzes ?? 0;
  const average = `${data?.average_score ?? 0}%`;
  const accuracy = `${data?.accuracy ?? 0}%`;
  const time = `${Math.round(((data?.time_spent_seconds ?? 0) / 60) * 10) / 10} minutes`;
  const weakTopics = data?.weak_topics?.length
    ? data.weak_topics.map((item) => `${item.topic} (${item.percentage}%)`).join(", ")
    : "No weak topics yet";
  const strongTopics = data?.strong_topics?.length
    ? data.strong_topics.map((item) => `${item.topic} (${item.percentage}%)`).join(", ")
    : "No strong topics yet";
  const recent = data?.quiz_scores?.length
    ? data.quiz_scores.slice(-5).map((item) => `${item.topic}: ${item.score}/${item.total}`).join(", ")
    : "No quiz attempts yet";

  return `Performance summary\nQuizzes attempted: ${quizCount}\nAverage score: ${average}\nAccuracy: ${accuracy}\nTime spent: ${time}\nWeak points: ${weakTopics}\nStrong topics: ${strongTopics}\nRecent quizzes: ${recent}`;
};

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi, I am EduSarthi. Ask me anything, or type quiz on Python." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [pendingQuizTopic, setPendingQuizTopic] = useState(false);

  const addMessage = (role, text) => {
    setMessages((current) => [...current, { role, text }]);
  };

  const startQuiz = async (topic) => {
    const userId = getBackendUserId();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/quiz/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, user_id: userId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Quiz generation failed");
      }

      setQuiz({
        quizId: data.quiz_id,
        topic,
        questions: data.questions,
        current: 0,
        selected: null,
        locked: false,
        score: 0,
      });
      addMessage("bot", `Starting a Gemini quiz on ${topic}.`);
    } catch (error) {
      addMessage("bot", error.message);
    } finally {
      setLoading(false);
    }
  };

  const askAI = async (question) => {
    const userId = getBackendUserId();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, user_id: userId, mode: "beginner" }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "AI request failed");
      }

      addMessage("bot", data.answer || data.response);
    } catch (error) {
      addMessage("bot", error.message);
    } finally {
      setLoading(false);
    }
  };

  const showPerformance = async () => {
    const userId = getBackendUserId();
    if (!userId) {
      addMessage("bot", "Please login again so I can connect your Firebase account with backend performance data.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/performance/user/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not load performance");
      }

      addMessage("bot", formatPerformance(data));
    } catch (error) {
      addMessage("bot", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    addMessage("user", text);

    if (pendingQuizTopic) {
      setPendingQuizTopic(false);
      await startQuiz(text);
      return;
    }

    const quizTopic = getQuizTopic(text);
    if (quizTopic === "") {
      setPendingQuizTopic(true);
      addMessage("bot", "Which topic should I create the quiz on?");
      return;
    }
    if (quizTopic) {
      await startQuiz(quizTopic);
      return;
    }

    if (wantsPerformance(text)) {
      await showPerformance();
      return;
    }

    await askAI(text);
  };

  const submitAnswer = async (option) => {
    if (!quiz || quiz.locked) return;

    const userId = getBackendUserId();
    const selectedLetter = option.trim()[0];
    setQuiz((current) => ({ ...current, selected: option, locked: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/quiz/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz_id: quiz.quizId,
          question_index: quiz.current,
          selected_option: selectedLetter,
          user_id: userId,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not submit answer");
      }

      addMessage(
        "bot",
        `${data.is_correct ? "Correct" : "Incorrect"}. Answer: ${data.correct_answer}. ${data.explanation}`
      );

      if (data.quiz_complete) {
        addMessage(
          "bot",
          `Quiz complete. Score: ${data.final_score}/${data.total}. Weak areas: ${
            data.weak_areas?.length ? data.weak_areas.join(", ") : "none"
          }. Recommendations are updated.`
        );
        window.dispatchEvent(new Event("edusarthi-performance-updated"));
        await showPerformance();
        setQuiz(null);
        return;
      }

      setQuiz((current) => ({
        ...current,
        current: current.current + 1,
        selected: null,
        locked: false,
        score: data.score,
      }));
    } catch (error) {
      addMessage("bot", error.message);
      setQuiz((current) => ({ ...current, locked: false }));
    }
  };

  const currentQuestion = quiz?.questions[quiz.current];

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 w-[min(92vw,380px)] h-[560px] bg-[#0F172A] border border-[#334155] rounded-xl shadow-2xl z-[9999] flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-[#334155]">
        <h2 className="text-white font-semibold">AI Assistant</h2>
        <button onClick={onClose} className="text-gray-300 hover:text-white">x</button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`text-sm rounded-lg px-3 py-2 whitespace-pre-wrap ${
              message.role === "user"
                ? "bg-[#4F46E5] text-white ml-8"
                : "bg-[#1E293B] text-gray-100 mr-8"
            }`}
          >
            {message.text}
          </div>
        ))}

        {currentQuestion && (
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-3 text-white space-y-3">
            <div className="text-xs text-gray-400">
              {quiz.topic} - Question {quiz.current + 1}/{quiz.questions.length}
            </div>
            <p className="text-sm font-medium">{currentQuestion.question}</p>
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  disabled={quiz.locked}
                  onClick={() => submitAnswer(option)}
                  className="w-full text-left bg-[#020617] hover:bg-[#334155] disabled:opacity-70 rounded-md px-3 py-2 text-sm"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <div className="text-xs text-gray-400">Thinking...</div>}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-[#334155] flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask or type quiz on DBMS"
          className="flex-1 bg-[#020617] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#6366F1]"
        />
        <button
          disabled={loading}
          className="bg-[#4F46E5] hover:bg-[#6366F1] disabled:opacity-60 text-white rounded-lg px-4 py-2 text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
