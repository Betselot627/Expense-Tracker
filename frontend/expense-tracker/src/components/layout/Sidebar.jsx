// src/components/Sidebar.jsx
import { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  User,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { UserContext } from "../context";
import { ThemeContext } from "../context/ThemeContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(UserContext);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", icon: Wallet, label: "Dashboard" },
    { path: "/transactions", icon: Receipt, label: "Transactions" },
    { path: "/income", icon: TrendingUp, label: "Income" },
    {
      path: "/expense",
      icon: TrendingDown,
      icon: TrendingDown,
      label: "Expense",
    },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {user?.profileImageURL ? (
              <img
                src={
                  user.profileImageURL.startsWith("http")
                    ? user.profileImageURL
                    : `https://expense-tracker-s9zd.onrender.com${user.profileImageURL}`
                }
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 dark:border-purple-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                {user?.fullName?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <span className="font-semibold text-gray-900 dark:text-white">
              {user?.fullName || "User"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <svg
                className="w-6 h-6 text-gray-900 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <nav className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
                      active
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-medium"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link
            to="/profile"
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            {user?.profileImageURL ? (
              <img
                src={
                  user.profileImageURL.startsWith("http")
                    ? user.profileImageURL
                    : `https://expense-tracker-s9zd.onrender.com${user.profileImageURL}`
                }
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 dark:border-purple-700"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user?.fullName?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                View Profile
              </p>
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
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Dark Mode Toggle & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={toggleDarkMode}
            className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all font-medium"
          >
            {isDarkMode ? (
              <>
                <Sun className="mr-3 h-5 w-5" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-3 h-5 w-5" />
                Dark Mode
              </>
            )}
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-medium"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
