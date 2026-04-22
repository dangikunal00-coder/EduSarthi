import { Bell, Book, BookOpen, BookOpenText, LayoutDashboard, MessageCircle, MessageCircleQuestionMark, Settings } from "lucide-react";
import NavbarItem from "./NavbarItem";
import EdisarthiLogo from "../../../assets/edisarthi-logo.png"

const Navbar = () => {
  return (
    <div className="flex justify-between items-center bg-[#020617] px-6 py-4 border-b border-gray-800">
      
      {/* Logo */}
      <div className="text-2xl font-bold">
              <img className="w-52" src={EdisarthiLogo} alt="Edisarthi Logo" />
              {/* EDUSarthi */}
            </div>


      {/* Right Section */}
      <div className="flex items-center gap-4">

              {/* Nav section */}
      <div className="flex gap-3">
        <NavbarItem
          label="Dashboard"
          path="/"
        />
        <NavbarItem
          label="Courses"
          path="/courses"
        />
        {/* <NavbarItem
          label="Explore Courses"
          path="/explorecourses"
        /> */}
        <NavbarItem
          label="AI"
          path="/chat"
        />
        <NavbarItem
          label="Assignments & Quizzes"
          path="/assignments"
        />
        <NavbarItem
          label="Help & Support"
          path="/help"
        />
      </div>

        <Bell className="cursor-pointer" />
        <Settings className="cursor-pointer" />

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
          H
        </div>
      </div>
    </div>
  );
};

export default Navbar;