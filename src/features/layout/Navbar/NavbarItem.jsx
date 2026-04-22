import { Link, useLocation } from "react-router-dom";

const NavbarItem = ({ icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
        isActive
          ? "bg-[#4F46E5] text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </Link>
  );
};

export default NavbarItem;