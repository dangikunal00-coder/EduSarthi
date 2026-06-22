import Heroimg from "../assets/heroimg.jpg";
import { useNavigate } from "react-router-dom";
import SplitTextHero from "../features/courses/components/SplitTextHero";
import Recommended from "../features/recommendation/Recommended"; // ✅ IMPORT
import TeacherDashboard from "./teacher/pages/TeacherDashboard";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">

      {/* Hero Section */}
      <div className="
        relative w-full 
        h-[420px] sm:h-[480px] md:h-[520px] 
        overflow-hidden rounded-xl sm:rounded-2xl shadow-lg
      ">

        {/* Background Image */}
        <img
          src={Heroimg}
          alt="Hero"
          className="w-full h-full object-cover scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent" />

        {/* Content */}
        <div className="
          absolute top-1/2 
          left-4 sm:left-6 md:left-10 
          transform -translate-y-1/2 
          max-w-xs sm:max-w-md md:max-w-xl
        ">

          <h1 className="
            text-2xl sm:text-3xl md:text-5xl 
            font-bold leading-tight text-white
          ">
            Upgrade Your <br />
            <span className="text-[#4F46E5]">Skills</span>
          </h1>

          <p className="
            mt-3 sm:mt-4 
            text-sm sm:text-base md:text-lg 
            text-[#94A3B8]
          ">
            Learn in-demand skills with structured courses, quizzes,
            and real-world practice.
          </p>

          {/* Buttons */}
          <div className="
            flex flex-col sm:flex-row 
            gap-3 sm:gap-4 
            mt-5 sm:mt-6
          ">

            <button
              onClick={() => navigate("/courses")}
              className="
                w-full sm:w-auto 
                bg-[#4F46E5] px-5 py-2.5 sm:px-6 sm:py-3 
                rounded-lg text-white font-semibold 
                hover:bg-[#6366F1] transition
              "
            >
              Start Learning 🚀
            </button>

            <button
              onClick={() => navigate("/courses")}
              className="
                w-full sm:w-auto 
                border border-[#4F46E5] 
                px-5 py-2.5 sm:px-6 sm:py-3 
                rounded-lg text-[#4F46E5] 
                hover:bg-[#4F46E5] hover:text-white transition
              "
            >
              Explore Courses
            </button>

          </div>

        </div>

        {/* Glass Card */}
        <div className="
          hidden lg:block 
          absolute right-6 md:right-10 
          top-1/2 transform -translate-y-1/2 
          bg-white/10 backdrop-blur-lg 
          border border-white/20 
          rounded-xl p-5 md:p-6 
          w-[240px] md:w-[260px]
        ">
          <h3 className="text-white text-base md:text-lg font-semibold mb-3">
            Why EduSarthi?
          </h3>

          <ul className="text-xs md:text-sm text-[#E2E8F0] space-y-2">
            <li>✔ Structured Courses</li>
            <li>✔ Interactive Quizzes</li>
            <li>✔ Track Progress</li>
            <li>✔ Learn Anytime</li>
          </ul>
        </div>

      </div>

      {/* 🔥 Split Section */}
      <div className="mt-12 sm:mt-16 md:mt-20">
        <SplitTextHero />
      </div>

      {/* 🔥 RECOMMENDED SECTION (CORRECT MOUNT) */}
      <div className="mt-12 sm:mt-16 md:mt-20 w-full px-3 sm:px-4 md:px-6">
        <Recommended />
      </div>

    </div>
  );
};

export default Dashboard;