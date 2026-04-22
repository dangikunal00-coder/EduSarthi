import Navbar from "../Components/layout/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      <>
        <div className="flex flex-col flex-1">
          <Navbar />

          <main className="p-2">
            <Outlet /> {/* 🔥 THIS IS IMPORTANT */}
          </main>
        </div>
      </>

    </div>
  );
};

export default DashboardLayout;