const ProgressBar = ({ total, completed }) => {
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="mb-6">
      <p className="text-sm mb-1">Progress: {percent}%</p>

      <div className="w-full bg-[#334155] h-3 rounded">
        <div
          className="bg-[#4F46E5] h-3 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;