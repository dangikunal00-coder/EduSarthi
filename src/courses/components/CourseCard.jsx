import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  // 🔒 Safety check (VERY IMPORTANT)
  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div
      onClick={() => navigate(`/courses/${course.courseId}`)}
      className="bg-[#020617] p-5 rounded-xl hover:scale-105 transition cursor-pointer"
    >
      <h2 className="text-lg font-bold mb-2">{course.title}</h2>
      <p className="text-gray-400">{course.totalModules} Modules</p>
      <p className="text-gray-400">{course.totalMCQs} MCQs</p>
    </div>
  );
};

export default CourseCard;