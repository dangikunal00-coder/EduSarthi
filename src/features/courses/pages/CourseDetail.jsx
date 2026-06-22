import { useParams } from "react-router-dom";
import allCourses from "../../../data/allCourses";
import ModuleList from "../components/ModuleList";
// import ProgressBar from "../../../quiz/components/ProgressBar";
// import useProgress from "../hooks/useProgress";

const CourseDetail = () => {
  const { courseId } = useParams();

  const course = allCourses.find(c => c.courseId === courseId);

  // const { completed } = useProgress(courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Course not found 🚫
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-5 md:px-6 py-6 max-w-5xl mx-auto space-y-6">

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
        {course.title}
      </h1>

      {/* <ProgressBar
        total={course.modules.length}
        completed={completed.length}
      /> */}

      <ModuleList
        modules={course.modules}
        courseId={courseId}
      />

    </div>
  );
};

export default CourseDetail;