import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { syncBackendUser } from "../../services/api";

const MotionForm = motion.form;
const MotionH1 = motion.h1;

const courseMap = {
  "Python": ["Programming in Python", "ML using Python"],
  "Java": ["Programming in Java"],
  "C": ["Programming in C"],
  "C++": ["Programming in C++"],
  "DSA": ["Data Structures and Algorithms (DSA)"],
  "OS": ["Operating Systems (OS)"],
  "DBMS": ["Database Management Systems (DBMS)"],
  "OOP": ["Object-Oriented Programming (OOP)"],
  "Web": ["HTML & CSS", "JavaScript", "Full Stack Web Development"],
  "React": ["Frontend Development (React)"],
  "Node": ["Backend Development (Node.js / Express)"],
  "AI": ["Artificial Intelligence (AI)", "Machine Learning (ML)"],
  "ML": ["Machine Learning (ML)", "Deep Learning"],
  "Cloud": ["Cloud Computing"],
  "Cyber": ["Cyber Security"],
  "DevOps": ["DevOps"],
  "Android": ["Android Development"],
  "Git": ["Git & GitHub"],
};

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
    interests: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const removeInterest = (skill) => {
    setForm({
      ...form,
      interests: form.interests.filter((s) => s !== skill),
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      setLoading(true);

      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCred.user;

      let recommendedCourses = [];

      form.interests.forEach((skill) => {
        if (courseMap[skill]) {
          recommendedCourses.push(...courseMap[skill]);
        }
      });

      recommendedCourses = [...new Set(recommendedCourses)];

      console.log("Selected Interests:", form.interests);
      console.log("Recommended Courses:", recommendedCourses);

      await setDoc(doc(db, "users", user.uid), {
        ...form,
        email: user.email,
        role: "student",
        recommendedCourses,
        createdAt: new Date(),
      });

      await syncBackendUser(user, {
        name: form.name,
        email: user.email,
        interests: form.interests,
      });

      navigate("/login");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] to-[#0F172A] px-4 py-6">

      <MotionForm
        onSubmit={handleSignup}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-[#1E293B]/80 backdrop-blur-lg p-5 sm:p-6 md:p-8 rounded-2xl shadow-2xl space-y-5"
      >

        <MotionH1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">
          Create EduSarthi Account
        </MotionH1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input name="name" placeholder="Full Name" required onChange={handleChange} className="input" />
          <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="input" />
          <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="input" />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} className="input" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input name="course" placeholder="Course" required onChange={handleChange} className="input" />
          <input name="semester" placeholder="Semester" required onChange={handleChange} className="input" />
          <input name="college" placeholder="College" onChange={handleChange} className="input sm:col-span-2" />
        </div>

        <input name="phone" placeholder="Phone" onChange={handleChange} className="input w-full" />

        {/* 🔥 NEW INTEREST DROPDOWN */}
        <div>
          <h3 className="text-white text-sm sm:text-base mb-2">Select Your Interests</h3>

          <select
            className="input w-full"
            onChange={(e) => {
              const value = e.target.value;
              if (value && !form.interests.includes(value)) {
                setForm({
                  ...form,
                  interests: [...form.interests, value],
                });
              }
            }}
          >
            <option value="">Select Interests</option>
            <option>Programming in C</option>
            <option>Programming in C++</option>
            <option>Programming in Java</option>
            <option>Programming in Python</option>
            <option>Operating Systems (OS)</option>
            <option>Database Management Systems (DBMS)</option>
            <option>Object-Oriented Programming (OOP)</option>
            <option>Data Structures and Algorithms (DSA)</option>
            <option>HTML & CSS</option>
            <option>JavaScript</option>
            <option>Frontend Development (React)</option>
            <option>Backend Development (Node.js / Express)</option>
            <option>Full Stack Web Development</option>
            <option>Artificial Intelligence (AI)</option>
            <option>Machine Learning (ML)</option>
            <option>Deep Learning</option>
            <option>Cloud Computing</option>
            <option>DevOps</option>
            <option>Cyber Security</option>
            <option>Android Development</option>
            <option>Git & GitHub</option>
          </select>

          {/* Selected */}
          <div className="flex flex-wrap gap-2 mt-3">
            {form.interests.map((s, i) => (
              <span
                key={i}
                className="bg-indigo-600 px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-2"
              >
                {s}
                <button type="button" onClick={() => removeInterest(s)}>✕</button>
              </span>
            ))}
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-indigo-600 py-2.5 sm:py-3 rounded-lg text-white font-semibold"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

      </MotionForm>

    </div>
  );
};

export default Signup;
