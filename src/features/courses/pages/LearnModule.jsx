import { useNavigate, useParams } from "react-router-dom";
import allCourses from "../../../data/allCourses";

const LearnModule = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  const course = allCourses.find(c => c.courseId === courseId);
  const module = course?.modules.find(m => m.id === moduleId);

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 px-4 text-center">
        Module not found 🚫
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-5 md:px-6 py-6 sm:py-8 max-w-4xl mx-auto space-y-6 text-white">

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
        {module.title}
      </h1>

      {/* Theory */}
      <div>
        <h2 className="text-lg sm:text-xl mb-2">Concept</h2>
        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          {module.content}
        </p>
      </div>

      {/* Code */}
      <div>
        <h2 className="text-lg sm:text-xl mb-2">Code Example</h2>
        <pre className="bg-black p-3 sm:p-4 rounded overflow-x-auto text-xs sm:text-sm md:text-base">
          <code>{module.code}</code>
        </pre>
      </div>

      {/* Summary */}
      <div>
        <h2 className="text-lg sm:text-xl mb-2">Summary</h2>
        <ul className="list-disc ml-5 space-y-1 text-sm sm:text-base">
          {module.summary.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Video */}
      <div>
        <h2 className="text-lg sm:text-xl mb-2">Recommended Video</h2>
        <div className="w-full aspect-video">
          <iframe
            className="w-full h-full rounded"
            src={module.video}
            title="video"
            allowFullScreen
          />
        </div>
      </div>

      {/* Quiz Button */}
      <button
        onClick={() => navigate(`/quiz/${courseId}/${moduleId}`)}
        className="
          w-full sm:w-auto 
          bg-purple-600 
          px-5 py-2 
          rounded 
          hover:bg-purple-700 
          transition
        "
      >
        Take Quiz
      </button>

    </div>
  );
};

export default LearnModule;
