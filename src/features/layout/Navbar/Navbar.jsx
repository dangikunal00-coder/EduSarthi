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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) setProfile(snap.data());
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="bg-[#020617] border-b border-gray-800 sticky top-0 z-50">

      {/* 🔥 Top Bar */}
      <div className="flex justify-between items-center px-3 sm:px-4 md:px-6 py-3 md:py-4">

        {/* Logo */}
        <img
          className="w-32 sm:w-40 md:w-52 object-contain cursor-pointer"
          onClick={() => navigate("/")}
          src={EdisarthiLogo}
          alt="Logo"
        />


        {/*Nav  Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 relative">

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <NavbarItem label="Courses" path="/courses" />
            <NavbarItem label="Project" path="/project" />
            <NavbarItem label="Tutorials" path="/tutorials" />
            <NavbarItem label="My performance" path="/my-performance" />
          </div>

          {/* Icons */}
          <Bell className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <Settings className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6 text-white" />

          {/* Avatar */}
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden cursor-pointer border border-gray-600"
          >
            <img
              src={profile?.photoURL || "https://via.placeholder.com/40"}
              className="w-full h-full object-cover"
              alt="profile"
            />
          </div>

          {/* 🔥 Profile Dropdown */}
          {profileOpen && (
            <div className="
              absolute right-0 top-12 sm:top-14 
              w-52 sm:w-56 
              bg-[#1E293B] border border-[#334155] 
              rounded-lg shadow-lg p-4 z-50
            ">
              <p className="font-semibold text-sm sm:text-base">
                {profile?.name || "User"}
              </p>

              <p className="text-xs sm:text-sm text-gray-400 break-words">
                {profile?.email}
              </p>

              <hr className="my-3 border-gray-700" />

              <button
                onClick={() => {
                  navigate("/profile");
                  setProfileOpen(false);
                }}
                className="w-full text-left text-sm hover:text-[#4F46E5]"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-red-400 mt-2"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

        </div>
      </div>


      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col px-4 pb-4 gap-2 bg-[#020617] border-t border-gray-800">

          <NavbarItem label="Courses" path="/courses" />
          <NavbarItem label="Project" path="/project" />
          <NavbarItem label="Tutorials" path="/tutorials" />
          <NavbarItem label="My performance" path="/my-performance" />

        </div>
      )}

    </div>
  );
};

export default Navbar;
