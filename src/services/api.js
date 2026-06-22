export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const getBackendUserId = () => {
  const value = localStorage.getItem("backend_user_id");
  return value ? Number(value) : null;
};

export const saveBackendSession = (data) => {
  if (data?.user_id) {
    localStorage.setItem("backend_user_id", String(data.user_id));
  }

  if (Array.isArray(data?.interests)) {
    localStorage.setItem("interests", JSON.stringify(data.interests));
  }
};

export const syncBackendUser = async (firebaseUser, profile = {}) => {
  const interests = Array.isArray(profile.interests) ? profile.interests : [];

  const response = await fetch(`${API_BASE_URL}/user/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firebase_uid: firebaseUser.uid,
      name: profile.name || firebaseUser.displayName || firebaseUser.email || "Student",
      email: profile.email || firebaseUser.email,
      course: profile.course || "",
      semester: profile.semester || "",
      college: profile.college || "",
      phone: profile.phone || "",
      interests,
    }),
  });

  if (!response.ok) {
    throw new Error("Backend user sync failed");
  }

  const data = await response.json();
  saveBackendSession(data);
  return data;
};
