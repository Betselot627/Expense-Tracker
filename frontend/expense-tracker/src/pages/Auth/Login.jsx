// src/pages/auth/Login.jsx
import { useState, useContext, useEffect } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context";
import { GoogleLogin } from "@react-oauth/google";

const GITHUB_CLIENT_ID = "YOUR_GITHUB_CLIENT_ID"; // replace with your GitHub Client ID
const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Clean up any URL parameters on component mount
  useEffect(() => {
    if (
      searchParams.has("token") ||
      searchParams.has("error") ||
      searchParams.has("success")
    ) {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  // Handle email/password input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle email/password login
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

  // FRONTEND-ONLY Google login
  const handleGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    if (!token) {
      setError("Google sign-in failed. No token received.");
      return;
    }
    localStorage.setItem("token", token);
    login(token);
    navigate("/dashboard", { replace: true });
  };

  const handleGoogleError = () => {
    setError("Google sign-in failed. Please try again.");
  };

  // FRONTEND-ONLY GitHub login
  const handleGithubLogin = () => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const githubWindow = window.open(
      GITHUB_AUTH_URL,
      "GitHub Login",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    // Listen for message from popup
    window.addEventListener("message", function githubListener(e) {
      if (e.origin !== window.location.origin) return;
      const { token } = e.data || {};
      if (token) {
        localStorage.setItem("token", token);
        login(token);
        navigate("/dashboard", { replace: true });
        window.removeEventListener("message", githubListener);
        githubWindow.close();
      }
    });
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

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Divider */}
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

            {/* Social Logins */}
            <div className="space-y-4">
              {/* Google login */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signin_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>

              {/* GitHub login */}
              <button
                onClick={handleGithubLogin}
                className="w-full py-3.5 px-4 bg-gray-900 text-white font-medium rounded-xl shadow-md hover:bg-gray-800 transition-all duration-200"
              >
                Sign in with GitHub
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
