import { useParams } from "react-router-dom";
import cppCourse from "../../../data/cppCourse.json";
import pythonCourse from "../../../data/pythonCourse.json";
import ModuleList from "../components/ModuleList";
import ProgressBar from "../../../quiz/components/ProgressBar";
import useProgress from "../hooks/useProgress";

const CourseDetail = () => {
  const { courseId } = useParams();

  const courses = [cppCourse, pythonCourse];
  const course = courses.find(c => c.courseId === courseId);

  const { completed } = useProgress(courseId);

  if (!course) return <div>Course not found 🚫</div>;

  return (
    <div className="space-y-6 px-4 md:px-6 py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{course.title}</h1>

      {/* Progress */}
      <ProgressBar
        total={course.modules.length}
        completed={completed.length}
      />

      <ModuleList
        modules={course.modules}
        courseId={courseId}
      />
    </div>
  );
};

export default CourseDetail;