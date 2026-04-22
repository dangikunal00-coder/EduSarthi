import { useState, useEffect } from "react";

const useProgress = (courseId) => {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(courseId)) || [];
    setCompleted(data);
  }, [courseId]);

  const markComplete = (moduleId) => {
    const updated = [...new Set([...completed, moduleId])];
    setCompleted(updated);
    localStorage.setItem(courseId, JSON.stringify(updated));
  };

  return { completed, markComplete };
};

export default useProgress;