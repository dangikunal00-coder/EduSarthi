const StatCard = ({ title, value }) => {
  return (
    <div className="bg-[#1E293B] p-4 rounded-xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
};

export default StatCard;