// src/components/Sidebar.jsx
import { useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  User,
  LogOut,
} from "lucide-react";
import { UserContext } from "../context";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(UserContext);

  const navItems = [
    { path: "/dashboard", icon: Wallet, label: "Dashboard" },
    { path: "/transactions", icon: Receipt, label: "Transactions" },
    { path: "/income", icon: TrendingUp, label: "Income" },
    { path: "/expense", icon: TrendingDown, label: "Expense" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <Link
          to="/profile"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          {user?.profileImageURL ? (
            <img
              src={
                user.profileImageURL.startsWith("http")
                  ? user.profileImageURL
                  : `http://localhost:8000${user.profileImageURL}`
              }
              alt={user.fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.fullName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {user?.fullName || "User"}
            </p>
            <p className="text-xs text-gray-500">View Profile</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
