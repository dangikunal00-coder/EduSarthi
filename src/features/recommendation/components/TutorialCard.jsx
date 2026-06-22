import React from 'react'

const TutorialCard = ({ tutorial }) => {
  return (
    <div
      onClick={() => window.open(tutorial.video_url, "_blank")}
      className="bg-[#1E293B] p-4 rounded-xl cursor-pointer hover:scale-105 transition"
    >

      <img
        src={tutorial.thumbnail}
        className="w-full h-40 object-cover rounded mb-3"
      />

      <h3 className="text-lg font-semibold">{tutorial.title}</h3>

    </div>
  );
};

export default TutorialCard