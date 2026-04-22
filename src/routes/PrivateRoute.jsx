import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  // ⏳ Loading state
  if (user === undefined) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ Logged in
  return children;
};

export default PrivateRoute;