import React from 'react'

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-[#1E293B] p-4 rounded-xl">

      <img
        src={project.image_url}
        className="w-full h-40 object-cover rounded mb-3"
      />

      <h3 className="text-lg font-semibold">{project.title}</h3>

      <p className="text-sm text-gray-400">
        {project.description}
      </p>

      <p className="text-xs text-purple-400 mt-2">
        {project.tech_stack}
      </p>

      <button
        onClick={() => window.open(project.url, "_blank")}
        className="mt-3 w-full bg-[#4F46E5] py-2 rounded"
      >
        View Project
      </button>

    </div>
  );
};

export default ProjectCard