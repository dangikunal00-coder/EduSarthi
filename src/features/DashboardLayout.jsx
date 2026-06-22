import RobotAssistant from "../Bot/RobotAssistant";
import Navbar from "../features/layout/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-white">

      {/* Navbar */}
      <Navbar />
      <RobotAssistant />
      {/* Main Content */}
      <main className="flex-1 w-full px-1 sm:px-2 md:px-3 py-1 sm:py-2">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;