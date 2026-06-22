const StudentModal = ({ student, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] px-4">
      <div className="bg-[#1E293B] p-6 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{student.name || "Student"}</h2>

        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <p>Email: {student.email || "-"}</p>
          <p>Course: {student.course || "-"}</p>
          <p>Semester: {student.semester || "-"}</p>
          <p>College: {student.college || "-"}</p>
          <p>Phone: {student.phone || "-"}</p>
          <p>Average: {student.average_score}%</p>
          <p>Accuracy: {student.accuracy}%</p>
          <p>Quizzes: {student.total_quizzes}</p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Interests</h3>
          <p className="text-gray-300">{student.interests?.join(", ") || "-"}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="font-semibold text-red-300">Weak Topics</h3>
            {student.weak_topics?.length ? (
              student.weak_topics.map((topic) => (
                <p key={topic.topic} className="text-sm text-gray-300">
                  {topic.topic}: {topic.percentage}%
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-400">None</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-green-300">Strong Topics</h3>
            {student.strong_topics?.length ? (
              student.strong_topics.map((topic) => (
                <p key={topic.topic} className="text-sm text-gray-300">
                  {topic.topic}: {topic.percentage}%
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-400">None</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Quiz Scores</h3>
          {student.quiz_scores?.length ? (
            student.quiz_scores.map((quiz) => (
              <p key={`${quiz.quiz}-${quiz.topic}`} className="text-sm text-gray-300">
                Quiz {quiz.quiz} - {quiz.topic}: {quiz.score}/{quiz.total} ({quiz.percentage}%)
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-400">No quiz attempts</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 bg-red-500 px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StudentModal;
