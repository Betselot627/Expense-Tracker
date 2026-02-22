// src/pages/auth/Login.jsx
import { useState, useContext } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);
      const token = res.data?.token;
      if (!token) throw new Error("No token received from server");

      localStorage.setItem("token", token);
      login(token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to sign in. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setSocialLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.GOOGLE, {
        credential: credentialResponse.credential,
      });

      const token = res.data?.token;
      if (!token) throw new Error("No token received from server");

      localStorage.setItem("token", token);
      login(token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Google sign-in failed. Please try again.",
      );
    } finally {
      setSocialLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    setSocialLoading(true);
    // Redirect to backend GitHub OAuth route
    window.location.href = "http://localhost:8000/api/v1/auth/github";
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center shadow-md">
                <LogIn className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              Sign In
            </h1>
            <p className="mt-2 text-center text-gray-500 text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Form content */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email & Password fields (unchanged) */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-colors"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-colors pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-4">
              {/* Google – popup */}
              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign-in failed")}
                  text="signin_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  width="100%"
                  logo_alignment="left"
                  disabled={socialLoading}
                />
              </div>

              {/* GitHub – redirect */}
              <button
                type="button"
                onClick={handleGitHubLogin}
                disabled={socialLoading}
                className="flex items-center justify-center gap-3 w-full py-3.5 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 text-gray-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.69c-2.78.61-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.56 9.56 0 0112 6.8c.85.004 1.71.11 2.52.33 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .26.18.57.69.49C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>

            <div className="mt-8 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-purple-600 font-medium hover:text-purple-800 transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Expense Tracker. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
