import { useNavigate, useParams } from "react-router-dom";
import cppCourse from "../../data/cppCourse.json";
import pythonCourse from "../../data/pythonCourse.json";

const LearnModule = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  const courses = [cppCourse, pythonCourse];

  const course = courses.find(c => c.courseId === courseId);

  const module = course?.modules.find(m => m.id === moduleId);

  if (!module) {
    return <div className="text-red-500">Module not found 🚫</div>;
  }

  return (<>
    <div className="space-y-6">

      {/* Title */}
      <h1 className="text-2xl font-bold">{module.title}</h1>

      {/* Theory */}
      <div>
        <h2 className="text-xl mb-2">Concept</h2>
        <p className="text-gray-300 leading-relaxed">
          {module.content}
        </p>
      </div>

      {/* Code */}
      <div>
        <h2 className="text-xl mb-2">Code Example</h2>
        <pre className="bg-black p-4 rounded overflow-x-auto">
          <code>{module.code}</code>
        </pre>
      </div>

      {/* Summary */}
      <div>
        <h2 className="text-xl mb-2">Summary</h2>
        <ul className="list-disc ml-5 space-y-1">
          {module.summary.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Video */}
      <div>
        <h2 className="text-xl mb-2">Recommended Video</h2>
        <iframe
          className="w-full h-64 rounded"
          src={module.video}
          title="video"
          allowFullScreen
        />
      </div>

      {/* Quiz Button */}
      <button className="bg-purple-600 px-5 py-2 rounded hover:bg-purple-700 transition" onClick={() => navigate(`/quiz/${courseId}/${moduleId}`)}>
        Take Quiz
      </button>

    </div>
  </>);
};

export default LearnModule;