import DashboardLayout from "../../features/DashboardLayout";
import Dashboard from "../../features/Dashboard";
import Courses from "../../courses/pages/Courses";
import CourseDetail from "../../courses/pages/CourseDetail";

import { BrowserRouter, Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 Layout wrapper */}
        <Route path="/" element={<DashboardLayout />}>

          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:courseId" element={<CourseDetail />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;