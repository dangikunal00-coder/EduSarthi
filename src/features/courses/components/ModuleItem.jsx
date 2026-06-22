import { useState } from "react";

const ModuleItem = ({ module, completed, markComplete }) => {
  const [open, setOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);

  const handleAnswer = (opt) => {
    if (opt === module.quiz[current].answer) {
      setScore(score + 1);
    }

    const next = current + 1;

    if (next < module.quiz.length) {
      setCurrent(next);
    } else {
      markComplete(module.id);
      setShowQuiz(false);
      alert(`Score: ${score + 1}/${module.quiz.length}`);
    }
  };

  return (
    <div className="bg-[#1E293B] rounded-lg p-4 sm:p-5 border border-[#334155] w-full">

      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center cursor-pointer"
      >
        <h3 className="font-semibold text-sm sm:text-base md:text-lg text-white">
          {module.title}
        </h3>

        <span className="text-sm sm:text-base">
          {completed ? "✅" : "⬜"} {open ? "▲" : "▼"}
        </span>
      </div>

      {/* Content */}
      {open && (
        <div className="mt-4 space-y-4">

          {/* Concept */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {module.content}
          </p>

          {/* Code */}
          <pre className="bg-black p-3 rounded text-xs sm:text-sm overflow-x-auto">
            <code>{module.code}</code>
          </pre>

          {/* Summary */}
          <ul className="list-disc ml-5 text-sm sm:text-base space-y-1">
            {module.summary.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          {/* Video */}
          <div className="w-full aspect-video">
            <iframe
              className="w-full h-full rounded"
              src={module.video}
              title="video"
              allowFullScreen
            />
          </div>

          {/* Quiz Section */}
          {!showQuiz ? (
            <button
              onClick={() => setShowQuiz(true)}
              className="bg-[#4F46E5] px-4 py-2 sm:px-5 sm:py-2.5 rounded text-sm sm:text-base hover:bg-[#6366F1] transition"
            >
              Start Quiz
            </button>
          ) : (
            <div className="bg-[#020617] p-4 rounded">
              <h4 className="mb-3 text-sm sm:text-base">
                Q{current + 1}. {module.quiz[current].question}
              </h4>

              <div className="flex flex-col gap-2">
                {module.quiz[current].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="bg-gray-800 p-2 sm:p-3 rounded text-sm sm:text-base hover:bg-gray-700 transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ModuleItem;