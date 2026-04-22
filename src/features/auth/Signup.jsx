import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        course: "",
        semester: "",
        college: "",
        phone: "",
        interests: "",
        photoURL: "",
    });

    const [loading, setLoading] = useState(false);

    // 🔹 Handle input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔹 Handle Signup
    const handleSignup = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match ❌");
            return;
        }

        try {
            setLoading(true);

            // 🔐 Step 1: Create user
            const userCred = await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );

            const user = userCred.user;

            console.log("User created:", user); // ✅ debug

            // 🔥 Step 2: Store data
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: form.name,
                    email: form.email,
                    course: form.course,
                    semester: form.semester,
                    college: form.college,
                    phone: form.phone,
                    interests: form.interests,
                    photoURL: "",
                    createdAt: new Date(),
                });

                console.log("Firestore saved ✅");
            } catch (err) {
                console.error("Firestore error:", err);
            }

            // ✅ Step 3: Success
            // alert("Account Created Successfully 🎉");
            // 🔥 IMPORTANT: Redirect to login
            navigate("/login");

        } catch (err) {
            console.error("Signup Error:", err);
            alert(err.message); // show real error
        } finally {
            setLoading(false); // 🔥 ALWAYS RESET
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">

            <form
                onSubmit={handleSignup}
                className="w-full max-w-2xl bg-[#1E293B] p-8 rounded-2xl shadow-lg space-y-4"
            >

                <h1 className="text-2xl font-bold text-white text-center">
                    Create Your EduSarthi Account
                </h1>

                {/* 🔹 Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        required
                        onChange={handleChange}
                        className="input"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        onChange={handleChange}
                        className="input"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={handleChange}
                        className="input"
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required
                        onChange={handleChange}
                        className="input"
                    />
                </div>

                {/* 🔹 Academic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        type="text"
                        name="course"
                        placeholder="Course / Stream (e.g. B.Tech CSE)"
                        required
                        onChange={handleChange}
                        className="input"
                    />

                    <input
                        type="text"
                        name="semester"
                        placeholder="Year / Semester"
                        required
                        onChange={handleChange}
                        className="input"
                    />

                    <input
                        type="text"
                        name="college"
                        placeholder="College Name (optional)"
                        onChange={handleChange}
                        className="input col-span-2"
                    />

                </div>

                {/* 🔹 Optional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        onChange={handleChange}
                        className="input"
                    />

                    <input
                        type="text"
                        name="interests"
                        placeholder="Interests (Python, DSA, Web Dev)"
                        onChange={handleChange}
                        className="input"
                    />

                    <input
                        type="text"
                        name="photoURL"
                        placeholder="Profile Image URL (optional)"
                        onChange={handleChange}
                        className="input col-span-2"
                    />

                </div>

                {/* 🔹 Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#4F46E5] py-3 rounded-lg text-white font-semibold hover:bg-[#6366F1] transition"
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>

                {/* 🔹 Redirect */}
                <p className="text-center text-gray-400 text-sm">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-[#4F46E5] cursor-pointer"
                    >
                        Login
                    </span>
                </p>

            </form>

            {/* 🔥 Tailwind reusable input style */}
            <style>
                {`
          .input {
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

export default Signup;