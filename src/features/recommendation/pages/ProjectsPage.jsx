import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { API_BASE_URL, getBackendUserId } from "../../../services/api";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const userId = getBackendUserId();
        if (!userId) {
          setProjects([]);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/recommend/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Project loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
    window.addEventListener("edusarthi-performance-updated", loadProjects);

    return () => {
      window.removeEventListener("edusarthi-performance-updated", loadProjects);
    };
  }, []);

  if (loading) {
    return <div className="mt-20 text-center text-gray-400">Loading projects...</div>;
  }

  return (
    <div className="w-full px-4 sm:px-5 md:px-6 py-6 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white">
        Projects For Practice
      </h1>

      {!projects.length && (
        <p className="text-gray-400">No projects found yet. Try taking a quiz from the chatbot.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={`${project.title}-${index}`} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
