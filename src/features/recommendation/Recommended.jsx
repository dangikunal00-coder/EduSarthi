import { useEffect, useState } from "react";
import CourseCard from "./components/CourseCard";
import ProjectCard from "./components/ProjectCard";
import TutorialCard from "./components/TutorialCard";
import Section from "./components/Section";
import { API_BASE_URL, getBackendUserId } from "../../services/api";

const Recommended = () => {
  const [data, setData] = useState(() => {
    return getBackendUserId() ? null : { courses: [], projects: [], tutorials: [] };
  });

  useEffect(() => {
    const loadRecommendations = () => {
      const userId = getBackendUserId();

      if (!userId) {
        return;
      }

      fetch(`${API_BASE_URL}/recommend/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId
        })
      })
        .then(res => res.json())
        .then(resData => {
          console.log("API Response:", resData);
          setData(resData);
        })
        .catch(err => console.error(err));
    };

    loadRecommendations();
    window.addEventListener("edusarthi-performance-updated", loadRecommendations);

    return () => {
      window.removeEventListener("edusarthi-performance-updated", loadRecommendations);
    };
  }, []);

  if (!data) return <p className="text-white">Loading recommendations...</p>;
  if (!data.courses?.length && !data.projects?.length && !data.tutorials?.length) {
    return <p className="text-white">Login again to load personalized recommendations.</p>;
  }

  return (
    <div className="space-y-10">

      {/* Courses */}
      {data.learning_path?.length > 0 && (
        <Section title="Learning Path">
          {data.learning_path.map((item) => (
            <div key={`${item.step}-${item.topic}`} className="bg-[#1E293B] p-4 rounded-xl border border-[#334155]">
              <p className="text-sm text-indigo-300">Step {item.step}</p>
              <h3 className="text-lg font-semibold text-white">{item.topic}</h3>
              <p className="text-sm text-gray-400 mt-1">{item.focus}</p>
              <p className="text-sm text-gray-300 mt-3">{item.action}</p>
            </div>
          ))}
        </Section>
      )}

      <Section title="Recommended Courses">
        {data.courses.map((c, i) => (
          <CourseCard key={i} course={c} />
        ))}
      </Section>

      {/* Projects */}
      <Section title="Recommended Projects">
        {data.projects.map((p, i) => (
          <ProjectCard key={i} project={p} />
        ))}
      </Section>

      {/* Tutorials */}
      <Section title="Recommended Tutorials">
        {data.tutorials.map((t, i) => (
          <TutorialCard key={i} tutorial={t} />
        ))}
      </Section>

    </div>
  );
};

export default Recommended;
