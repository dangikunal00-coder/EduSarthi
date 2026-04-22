import { useEffect, useState } from "react";
import { auth, db } from "../..//firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate=useNavigate()
  const user = auth.currentUser;

  // 🔥 Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setData(snap.data());
      }
    };

    fetchData();
  }, []);

  // 🔹 Handle input
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // 🔥 Update profile
  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateDoc(doc(db, "users", user.uid), {
        ...data,
      });

    //   alert("Profile Updated ✅");
      navigate('/')

    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-[#1E293B] p-6 rounded-xl space-y-4">

      <h1 className="text-2xl font-bold text-white">Edit Profile</h1>

      {/* Profile Image */}
      <div className="flex items-center gap-4">
        <img
          src={data.photoURL || "https://via.placeholder.com/80"}
          alt="profile"
          className="w-20 h-20 rounded-full object-cover"
        />

        <input
          type="text"
          name="photoURL"
          placeholder="Paste Image URL"
          value={data.photoURL || ""}
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* Fields */}
      <input name="name" value={data.name || ""} onChange={handleChange} className="input" placeholder="Full Name" />
      <input name="course" value={data.course || ""} onChange={handleChange} className="input" placeholder="Course" />
      <input name="semester" value={data.semester || ""} onChange={handleChange} className="input" placeholder="Semester" />
      <input name="college" value={data.college || ""} onChange={handleChange} className="input" placeholder="College" />
      <input name="phone" value={data.phone || ""} onChange={handleChange} className="input" placeholder="Phone" />
      <input name="interests" value={data.interests || ""} onChange={handleChange} className="input" placeholder="Interests" />

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-[#4F46E5] py-2 rounded text-white"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>

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

export default Profile;