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
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">

      <form
        onSubmit={handleReset}
        className="bg-[#1E293B] p-8 rounded-xl space-y-4 w-full max-w-md"
      >
        <h1 className="text-white text-xl font-bold text-center">
          Reset Password
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />

        <button className="w-full bg-[#4F46E5] py-2 rounded text-white">
          Send Reset Link
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-center text-gray-400 cursor-pointer"
        >
          Back to Login
        </p>
      </form>

      <style>
        {`
          .input {
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            background: #020617;
            border: 1px solid #334155;
            color: white;
          }
        `}
      </style>

    </div>
  );
};

export default ForgotPassword;