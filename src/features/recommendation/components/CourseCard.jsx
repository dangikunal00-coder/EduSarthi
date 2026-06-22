const CourseCard = ({ course }) => {
  return (
    <div className="bg-[#1E293B] p-4 rounded-xl hover:scale-105 transition">

      <img
        src={course.image_url}
        alt={course.title}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />

      <h3 className="text-lg font-semibold">{course.title}</h3>

      <p className="text-sm text-gray-400 mb-2">
        {course.description}
      </p>

      <p className="text-green-400 font-bold mb-3">
        ₹{course.price}
      </p>

      <button
        onClick={() => window.open(course.url, "_blank")}
        className="w-full bg-[#4F46E5] py-2 rounded"
      >
        View Course
      </button>

    </div>
  );
};

export default CourseCard;