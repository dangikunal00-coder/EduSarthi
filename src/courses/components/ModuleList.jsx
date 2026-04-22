import ModuleItem from "./ModuleItem";
import useProgress from "../../courses/hooks/useProgress";

const ModuleList = ({ modules, courseId }) => {
  const { completed, markComplete } = useProgress(courseId);

  return (
    <div className="flex flex-col gap-4">
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