import { useState } from "react";
import cppCourse from "../../../data/cppCourse.json";
import pythonCourse from "../../../data/pythonCourse.json";
import CourseCard from "../components/CourseCard";

const Courses = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const courses = [cppCourse, pythonCourse];

  // 🔍 Filter logic
  const filteredCourses = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || course.category === category)
    );
  });

  return (
    <div className="px-4 md:px-6 py-6">

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        Explore Courses
      </h1>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/3 p-3 mb-6 rounded-lg bg-[#1E293B] border border-[#334155] outline-none"
      />

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-3 rounded-lg bg-[#1E293B] border border-[#334155]"
      >
        <option value="All">All</option>
        <option value="Programming">Programming</option>
      </select>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.courseId} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mt-6">No courses found 😔</p>
      )}

    </div>
  );
};

export default Courses;