import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getBackendUserId, syncBackendUser } from "../services/api";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u && !getBackendUserId()) {
        try {
          const snap = await getDoc(doc(db, "users", u.uid));
          const profile = snap.exists() ? snap.data() : {};
          await syncBackendUser(u, profile);
        } catch (error) {
          console.error("Backend user sync failed:", error);
        }
      }

      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  // ⏳ Loading state (Responsive + Centered)
  if (user === undefined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F172A] px-4">

        {/* Spinner */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="mt-4 text-sm sm:text-base text-gray-400 text-center">
          Checking authentication...
        </p>

      </div>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ Logged in
  return children;
};

export default PrivateRoute;
