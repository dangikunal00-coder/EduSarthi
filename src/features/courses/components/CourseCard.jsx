import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/courses/${course.courseId}`)}
      className="
        w-full 
        bg-[#1E293B] 
        p-4 sm:p-5 
        rounded-xl 
        border border-[#334155] 
        cursor-pointer 
        transition duration-300 
        hover:scale-[1.03] sm:hover:scale-105 
        hover:bg-[#334155] 
        hover:shadow-xl 
        hover:-translate-y-1
      "
    >
      {/* Title */}
      <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">
        {course.title}
      </h2>

      {/* Details */}
      <p className="text-xs sm:text-sm md:text-base text-[#94A3B8]">
        {course.totalModules} Modules
      </p>

      <p className="text-xs sm:text-sm md:text-base text-[#94A3B8]">
        {course.totalMCQs} MCQs
      </p>

      {/* CTA */}
      <button
        className="
          mt-4 
          w-full 
          bg-[#4F46E5] 
          py-2 sm:py-2.5 
          rounded-lg 
          text-sm sm:text-base 
          hover:bg-[#6366F1] 
          transition
        "
      >
        Start Course
      </button>
    </div>
  );
};

export default CourseCard;