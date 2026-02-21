// src/pages/auth/Login.jsx

import { useState, useContext } from "react";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPath";
import card2 from "../../assets/images/card2.png";
import { UserContext } from "../../context";
import axiosInstance from "../../utils/axiosInstance";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);

      const token = response.data?.token;

      if (!token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", token);
      login(token);

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "Login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      {/* Left Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 border border-purple-100">
          <h1 className="text-4xl font-bold text-violet-900 mb-3 text-center">
            Welcome Back
          </h1>

          {errorMessage && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {errorMessage}
            </div>
          )}

          <form className="space-y-7" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-11 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-600 font-medium hover:underline"
            >
              SignUp
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side UI */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-violet-500 via-purple-700 to-fuchsia-500 items-center justify-center p-10">
        <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md">
          <TrendingUp className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold">
            Track Your Income & Expenses
          </h3>
          <img src={card2} alt="Chart" className="mt-4 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Login;
