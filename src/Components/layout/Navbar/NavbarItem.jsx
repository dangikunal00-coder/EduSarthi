import { Link, useLocation } from "react-router-dom";

const SidebarItem = ({ icon, label, path }) => {
  const location = useLocation();

  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`flex items-center p-3 rounded-lg transition ${
        isActive
          ? "bg-purple-600 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default SidebarItem;