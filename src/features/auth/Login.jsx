import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../../firebase/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { syncBackendUser } from "../../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = result.user;
      const snap = await getDoc(doc(db, "users", user.uid));
      const profile = snap.exists() ? snap.data() : {};
      await syncBackendUser(user, profile);
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);
      alert("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          course: "",
          semester: "",
          college: "",
          phone: "",
          interests: "",
          role: "student",
          createdAt: new Date(),
        });
      }

      const latestSnap = await getDoc(docRef);
      const profile = latestSnap.exists() ? latestSnap.data() : {};
      await syncBackendUser(user, profile);

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Google login failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-[#1E293B] p-6 sm:p-8 rounded-2xl shadow-xl space-y-5"
      >

        <h1 className="text-xl sm:text-2xl font-bold text-white text-center">
          Welcome Back 👋
        </h1>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          onChange={handleChange}
          className="input"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="input"
        />

        {/* Forgot Password */}
        <p
          onClick={() => navigate("/forgot-password")}
          className="text-xs sm:text-sm text-right text-[#4F46E5] cursor-pointer hover:text-[#6366F1] transition"
        >
          Forgot Password?
        </p>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4F46E5] py-2.5 sm:py-3 rounded-lg text-white font-semibold hover:bg-[#6366F1] transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup Redirect */}
        <p className="text-center text-gray-400 text-xs sm:text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#4F46E5] cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition text-sm sm:text-base"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

      </form>

      {/* Input Styles */}
      <style>
        {`
          .input {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            background: #020617;
            border: 1px solid #334155;
            outline: none;
            color: white;
            font-size: 14px;
          }

          @media (min-width: 640px) {
            .input {
              font-size: 16px;
            }
          }

          .input:focus {
            border-color: #6366F1;
            box-shadow: 0 0 8px #6366F1;
          }
        `}
      </style>

    </div>
  );
};

export default Login;
