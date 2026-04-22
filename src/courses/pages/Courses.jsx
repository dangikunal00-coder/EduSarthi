import Navbar from "../../Components/layout/Navbar/Navbar";
import cppCourse from "../../data/cppCourse.json";
import pythonCourse from "../../data/pythonCourse.json";
import CourseCard from "../components/CourseCard";

const Courses = () => {
  const courses = [cppCourse, pythonCourse];

  return (
    <>
    <div className="grid grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.courseId} course={course} />
      ))}
    </div>
    </>
  );
};

export default Courses;



