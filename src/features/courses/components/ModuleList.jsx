import { useState } from "react";
import ModuleItem from "./ModuleItem";

const ModuleList = ({ modules }) => {
  const [completed, setCompleted] = useState([]);

  const markComplete = (moduleId) => {
    setCompleted((current) =>
      current.includes(moduleId) ? current : [...current, moduleId]
    );
  };

  return (
    <div className="
      w-full 
      max-w-4xl 
      mx-auto 
      flex flex-col 
      gap-4 sm:gap-5 md:gap-6 
      px-2 sm:px-4
    ">
      {modules.map((module) => (
        <ModuleItem
          key={module.id}
          module={module}
          completed={completed.includes(module.id)}
          markComplete={markComplete}
        />
      ))}
    </div>
  );
};

export default ModuleList;
