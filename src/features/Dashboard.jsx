import Heroimg from "../assets/heroimg.jpg";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-6">

      {/* Hero Section */}
      <div className="relative w-full h-[520px] overflow-hidden rounded-2xl shadow-lg">

        {/* Background Image */}
        <img
          src={Heroimg}
          alt="Hero"
          className="w-full h-full object-cover scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent" />

        {/* Content */}
        <div className="absolute top-1/2 left-10 transform -translate-y-1/2 max-w-xl">

          <h1 className="text-5xl font-bold leading-tight text-white">
            Upgrade Your <br />
            <span className="text-[#4F46E5]">Skills</span>
          </h1>

          <p className="mt-4 text-lg text-[#94A3B8]">
            Learn in-demand skills with structured courses, quizzes,
            and real-world practice.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">

            <button
              onClick={() => navigate("/courses")}
              className="bg-[#4F46E5] px-6 py-3 rounded-lg text-white font-semibold hover:bg-[#6366F1] transition"
            >
              Start Learning 🚀
            </button>

            <button
              onClick={() => navigate("/courses")}
              className="border border-[#4F46E5] px-6 py-3 rounded-lg text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white transition"
            >
              Explore Courses
            </button>

          </div>

        </div>

        {/* Glass Card (Right Side) */}
        <div className="hidden md:block absolute right-10 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-[260px]">

          <h3 className="text-white text-lg font-semibold mb-3">
            Why EduSarthi?
          </h3>

          <ul className="text-sm text-[#E2E8F0] space-y-2">
            <li>✔ Structured Courses</li>
            <li>✔ Interactive Quizzes</li>
            <li>✔ Track Progress</li>
            <li>✔ Learn Anytime</li>
          </ul>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;