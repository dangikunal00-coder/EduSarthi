import { useState } from "react";
import { auth, db } from "../../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = res.user;
      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists() && snap.data().role === "teacher") {
        navigate("/admin/dashboard");
      } else {
        alert("Unauthorized");
      }
    } catch (err) {
      console.error("Admin login failed:", err);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0F172A]">
      <form onSubmit={handleLogin} className="bg-[#1E293B] p-6 rounded-xl space-y-4">
        <h2 className="text-xl text-white">Teacher Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input"
        />

        <button className="bg-indigo-600 w-full py-2 rounded text-white">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
