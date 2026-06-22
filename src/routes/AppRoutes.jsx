import DashboardLayout from "../features/DashboardLayout";
import Dashboard from "../features/Dashboard";
import Courses from "../features/courses/pages/Courses";
import CourseDetail from "../features/courses/pages/CourseDetail";
import LearnModule from "../features/courses/pages/LearnModule";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import Profile from "../features/profile/Profile";
import PrivateRoute from "./PrivateRoute";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgotPassword from "../features/auth/ForgotPassword";
import TeacherDashboard from "../features/teacher/pages/TeacherDashboard";
import AdminLogin from "../features/admin/pages/AdminLogin";
import AdminRoute from "../routes/AdminRoute";
import PerformancePage from "../features/performance/pages/PerformancePage";
import ProjectsPage from "../features/recommendation/pages/ProjectsPage";
import TutorialsPage from "../features/recommendation/pages/TutorialsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 Layout wrapper */}
        <Route path="/" element={<DashboardLayout />}>

          <Route
            index
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="courses"
            element={
              <PrivateRoute>
                <Courses />
              </PrivateRoute>
            }
          />

          <Route
            path="courses/:courseId"
            element={
              <PrivateRoute>
                <CourseDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="learn/:courseId/:moduleId"
            element={
              <PrivateRoute>
                <LearnModule />
              </PrivateRoute>
            }
          />

          <Route
            path="project"
            element={
              <PrivateRoute>
                <ProjectsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="tutorials"
            element={
              <PrivateRoute>
                <TutorialsPage />
              </PrivateRoute>
            }
          />

          {/* ADMIN ROUTE */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <TeacherDashboard />
              </AdminRoute>
            }
          />


          <Route path="/my-performance" element={<PerformancePage />} />
          <Route path="/performance" element={<PerformancePage />} />
          {/* 👤 Profile */}
          <Route path="profile" element={<Profile />} />


        </Route>

        {/* 🔐 Auth (NO Navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
