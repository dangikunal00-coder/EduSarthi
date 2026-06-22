import { Link, useLocation } from "react-router-dom";

const NavbarItem = ({ icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`
        flex items-center gap-2 
        px-3 sm:px-4 py-2 sm:py-2.5 
        rounded-lg transition-all duration-200

        text-sm sm:text-base

        ${
          isActive
            ? "bg-[#4F46E5] text-white shadow-md"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }
      `}
    >
      {/* Icon */}
      {icon && (
        <span className="text-base sm:text-lg">
          {icon}
        </span>
      )}

      {/* Label */}
      <span className="whitespace-nowrap">
        {label}
      </span>
    </Link>
  );
};

export default NavbarItem;