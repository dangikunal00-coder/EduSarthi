import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../../firebase/firebase";
import { db } from "../../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    // Handle input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle email Login
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await signInWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );

            // ✅ Redirect after login
            navigate("/");

        } catch (err) {
            console.error("Login Error:", err);
            alert("Invalid email or password ❌");
        } finally {
            setLoading(false);
        }
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // 🔥 Check if user already exists
            const docRef = doc(db, "users", user.uid);
            const snap = await getDoc(docRef);

            if (!snap.exists()) {
                // 🔥 Create new user in Firestore
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    course: "",
                    semester: "",
                    college: "",
                    phone: "",
                    interests: "",
                    createdAt: new Date(),
                });
            }

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
                className="w-full max-w-md bg-[#1E293B] p-8 rounded-2xl shadow-lg space-y-4"
            >

                <h1 className="text-2xl font-bold text-white text-center">
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

                {/* Forget Password */}
                <p
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-right text-[#4F46E5] cursor-pointer"
                >
                    Forgot Password?
                </p>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#4F46E5] py-3 rounded-lg text-white font-semibold hover:bg-[#6366F1] transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* Redirect to Signup */}
                <p className="text-center text-gray-400 text-sm">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-[#4F46E5] cursor-pointer"
                    >
                        Sign Up
                    </span>
                </p>

                {/* login with google */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-black py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="google"
                        className="w-5 h-5"
                    />
                    Continue with Google
                </button>

            </form>

            {/* 🔥 Reusable Input Style */}
            <style>
                {`
          .input {
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            background: #020617;
            border: 1px solid #334155;
            outline: none;
            color: white;
          }
        `}
            </style>

        </div>
    );
};

export default Login;