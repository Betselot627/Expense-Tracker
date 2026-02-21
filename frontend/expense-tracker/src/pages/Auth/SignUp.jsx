// src/pages/Auth/SignUp.jsx
import { useState, useContext } from "react";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import card2 from "../../assets/images/card2.png";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Call signup API
      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        formData,
      );

      const token = response.data?.token;
      if (!token) throw new Error("No token returned from server");

      // Save token in context
      login(token);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "Signup failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      {/* Left side - SignUp Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 md:p-12 border border-purple-100">
          <h1 className="text-4xl font-bold text-violet-900 mb-3 text-center">
            Create Account
          </h1>
          <p className="text-center text-gray-600 mb-10 text-lg">
            Please enter your details to sign up
          </p>

          {errorMessage && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Profile Photo */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500">Photo</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
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
                placeholder="••••••••"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-11 text-gray-500 hover:text-purple-600"
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
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all disabled:opacity-60"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Branding + Chart */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-violet-500 via-purple-700 to-fuchsia-500 items-start justify-center pt-7 px-10 relative overflow-hidden">
        <div className="relative w-full max-w-2xl text-black flex flex-col items-center">
          <div className="bg-white rounded-2xl p-8 border border-white/20 shadow-2xl mb-6 w-full h-auto">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-l font-2xl">
                  Track Your Income & Expenses
                </h3>
                <p className="text-2xl font-bold mt-1">$430,000</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl w-full relative">
            <div className="flex justify-between items-center mb-4 text-white">
              <h4 className="text-lg font-semibold">All Transactions</h4>
              <span className="text-sm opacity-80">2nd Jan to 20th Dec</span>
              <span className="text-sm text-purple-200 hover:underline cursor-pointer">
                View More
              </span>
            </div>

            <img
              src={card2}
              alt="Monthly Income vs Expense"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
