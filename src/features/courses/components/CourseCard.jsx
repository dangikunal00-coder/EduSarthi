import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/courses/${course.courseId}`)}
      className="bg-[#1E293B] p-5 rounded-xl border border-[#334155] cursor-pointer 
                 hover:scale-105 hover:bg-[#334155] transition duration-300 hover:shadow-xl hover:-translate-y-1.5 mt-4 md:mt-0"

    >
      <h2 className="text-lg md:text-xl font-bold mb-2">
        {course.title}
      </h2>

      <p className="text-sm md:text-base text-[#94A3B8]">
        {course.totalModules} Modules
      </p>

      <p className="text-sm md:text-base text-[#94A3B8]">
        {course.totalMCQs} MCQs
      </p>

      {/* CTA */}
      <button className="mt-4 w-full bg-[#4F46E5] py-2 rounded-lg hover:bg-[#6366F1] transition">
        Start Course
      </button>
    </div>
  );
};

export default CourseCard;