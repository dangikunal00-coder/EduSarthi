import DashboardLayout from "../features/DashboardLayout";
import Dashboard from "../features/Dashboard";
import Courses from "../features/courses/pages/Courses";
import CourseDetail from "../features/courses/pages/CourseDetail";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import Profile from "../features/profile/Profile";
import PrivateRoute from "./PrivateRoute";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgotPassword from "../features/auth/ForgotPassword";

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