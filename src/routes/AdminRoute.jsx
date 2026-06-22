import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists() && snap.data().role === "teacher") {
          setAllowed(true);
        } else {
          setAllowed(false);
        }
      } else {
        setAllowed(false);
      }
    });

    return () => unsub();
  }, []);

  if (allowed === null) return <div>Loading...</div>;

  return allowed ? children : <Navigate to="/admin" />;
};

export default AdminRoute;