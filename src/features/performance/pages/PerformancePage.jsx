import { useEffect, useState } from "react";
import Performance from "../components/Performance";
import { API_BASE_URL, getBackendUserId } from "../../../services/api";

const PerformancePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const userId = getBackendUserId();
        if (!userId) {
          setData(null);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/performance/user/${userId}`);
        const result = await res.json();

        console.log("API DATA:", result);

        setData(result);
      } catch (err) {
        console.error("Error fetching performance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
    window.addEventListener("edusarthi-performance-updated", fetchPerformance);

    return () => {
      window.removeEventListener("edusarthi-performance-updated", fetchPerformance);
    };
  }, []);

  // ⏳ Loading State
  if (loading) {
    return (
      <div className="mt-20 text-center text-gray-400">
        Loading performance...
      </div>
    );
  }

  // ❌ No Data
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="mt-20 text-center text-gray-400">
        No performance data available
      </div>
    );
  }

  // ✅ Show UI
  return <Performance data={data} />;
};

export default PerformancePage;
