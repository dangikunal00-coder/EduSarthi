import { useEffect, useMemo, useState } from "react";
import CourseCard from "../../recommendation/components/CourseCard";
import { API_BASE_URL, getBackendUserId } from "../../../services/api";

const Courses = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const userId = getBackendUserId();
        if (!userId) {
          setCourses([]);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/recommend/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error("Course loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
    window.addEventListener("edusarthi-performance-updated", loadCourses);

    return () => {
      window.removeEventListener("edusarthi-performance-updated", loadCourses);
    };
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(courses.map((course) => course.category).filter(Boolean))];
  }, [courses]);

  const filteredCourses = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || course.category === category)
    );
  });

  if (loading) {
    return <div className="mt-20 text-center text-gray-400">Loading courses...</div>;
  }

  return (
    <div className="w-full px-4 sm:px-5 md:px-6 py-6 sm:py-8 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">
        Courses For You
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:flex-1 p-3 rounded-lg bg-[#1E293B] border border-[#334155] outline-none text-white"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-56 p-3 rounded-lg bg-[#1E293B] border border-[#334155] text-white"
        >
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      {!filteredCourses.length && (
        <p className="text-gray-400 mt-6 text-center">
          No courses found. Update interests or attempt a quiz from the chatbot.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {filteredCourses.map((course, index) => (
          <CourseCard key={`${course.title}-${index}`} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Courses;
