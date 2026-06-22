import { useEffect, useState } from "react";
import TutorialCard from "../components/TutorialCard";
import { API_BASE_URL, getBackendUserId } from "../../../services/api";

const TutorialsPage = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTutorials = async () => {
      try {
        const userId = getBackendUserId();
        if (!userId) {
          setTutorials([]);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/recommend/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });
        const data = await response.json();
        setTutorials(data.tutorials || []);
      } catch (error) {
        console.error("Tutorial loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTutorials();
    window.addEventListener("edusarthi-performance-updated", loadTutorials);

    return () => {
      window.removeEventListener("edusarthi-performance-updated", loadTutorials);
    };
  }, []);

  if (loading) {
    return <div className="mt-20 text-center text-gray-400">Loading tutorials...</div>;
  }

  return (
    <div className="w-full px-4 sm:px-5 md:px-6 py-6 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white">
        Tutorials
      </h1>

      {!tutorials.length && (
        <p className="text-gray-400">No tutorials found yet. Try taking a quiz from the chatbot.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {tutorials.map((tutorial, index) => (
          <TutorialCard key={`${tutorial.title}-${index}`} tutorial={tutorial} />
        ))}
      </div>
    </div>
  );
};

export default TutorialsPage;
