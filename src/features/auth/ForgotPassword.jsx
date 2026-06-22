import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent 📩");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">

      <form
        onSubmit={handleReset}
        className="bg-[#1E293B] p-6 sm:p-8 rounded-xl space-y-5 w-full max-w-md shadow-lg"
      >
        <h1 className="text-white text-xl sm:text-2xl font-bold text-center">
          Reset Password
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />

        <button className="w-full bg-[#4F46E5] py-2.5 rounded text-white font-semibold hover:bg-[#6366F1] transition">
          Send Reset Link
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-center text-gray-400 cursor-pointer hover:text-white transition"
        >
          Back to Login
        </p>
      </form>

      <style>
        {`
          .input {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            background: #020617;
            border: 1px solid #334155;
            color: white;
            font-size: 14px;
          }

          @media (min-width: 640px) {
            .input {
              font-size: 16px;
            }
          }

          .input:focus {
            outline: none;
            border-color: #6366F1;
            box-shadow: 0 0 8px #6366F1;
          }
        `}
      </style>

    </div>
  );
};

export default ForgotPassword;