import {
  Bell,
  Settings,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarItem from "./NavbarItem";
import EdisarthiLogo from "../../../assets/edisarthi-logo.png";

// 🔥 Firebase
import { auth, db } from "../../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  // 🔥 Fetch logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setProfile(snap.data());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login"); // 🔥 redirect after logout
  };

  return (
    <div className="bg-[#020617] border-b border-gray-800 relative">

      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 md:px-6 py-4">

        {/* Logo */}
        <img className="w-40 md:w-52" src={EdisarthiLogo} alt="Logo" />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3">
          <NavbarItem label="Dashboard" path="/" />
          <NavbarItem label="Courses" path="/courses" />
          <NavbarItem label="AI" path="/chat" />
          <NavbarItem label="Assignments" path="/assignments" />
          <NavbarItem label="Help" path="/help" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 relative">

          <Bell className="cursor-pointer" />
          <Settings className="cursor-pointer" />

          {/* 🔥 Avatar */}
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#4F46E5] flex items-center justify-center cursor-pointer text-white font-semibold"
          >
            {/* profile Image */}
            {/* {profile?.name?.charAt(0) || "U"} */}
            <img
              src={profile?.photoURL || "https://via.placeholder.com/40"}
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
          </div>

          {/* 🔥 Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-14 w-56 bg-[#1E293B] border border-[#334155] rounded-lg shadow-lg p-4 z-50">

              <p className="font-semibold">
                {profile?.name || "User"}
              </p>

              <p className="text-sm text-gray-400">
                {profile?.email}
              </p>

              <hr className="my-3 border-gray-700" />

              <button
                onClick={() => {
                  navigate("/profile");
                  setProfileOpen(false);
                }}
                className="w-full text-left hover:text-[#4F46E5]"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left text-red-400 mt-2"
              >
                Logout
              </button>

            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col px-4 pb-4 gap-2 bg-[#020617] border-t border-gray-800">

          <NavbarItem label="Dashboard" path="/" />
          <NavbarItem label="Courses" path="/courses" />
          <NavbarItem label="AI" path="/chat" />
          <NavbarItem label="Assignments" path="/assignments" />
          <NavbarItem label="Help" path="/help" />

        </div>
      )}

    </div>
  );
};

export default Navbar;