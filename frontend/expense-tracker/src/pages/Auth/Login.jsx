import React from "react";
import { TrendingUp, Eye } from "lucide-react";
import card2 from "../../assets/images/card2.png";

const Login = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      {/* Left: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 md:p-12 border border-purple-100">
          <h1 className="text-4xl font-bold text-violet-900 mb-3 text-center">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mb-10 text-lg">
            Please enter your details to log in
          </p>

          <form className="space-y-7">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@timetoprogram.com"
                defaultValue="john@timetoprogram.com"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all text-gray-800"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all pr-12"
              />
              <button
                type="button"
                className="absolute right-4 top-11 text-gray-500 hover:text-purple-600"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              LOGIN
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Don't have an account?{" "}
            <a href="signup" className="text-purple-600 font-medium hover:underline">
              SignUp
            </a>
          </p>
        </div>
      </div>

      {/* Right: Branding + Chart */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-violet-500 via-purple-700 to-fuchsia-500 items-start justify-center pt-7 px-10 relative overflow-hidden">
        {/* Make this container relative for tooltip */}
        <div className="relative w-full max-w-2xl text-black flex flex-col items-center">
          {/* Stats Card */}
          <div className="bg-white rounded-2xl p-8 border border-white/20 shadow-2xl mb-6 w-full h-auto">
            <div className="flex items-center gap-4">
              <div className=" p-4 rounded-full">
                <TrendingUp className="w-8 h-8  text-black " />
              </div>
              <div className="text-black bg-white p-2 rounded-md">
                <h3 className="text-l font-2xl">
                  Track Your Income & Expenses
                </h3>
                <p className="text-2xl font-bold mt-1">$430,000</p>
              </div>
            </div>
          </div>

          {/* Chart */}
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

        {/* Decorative shapes */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-fuchsia-400/30 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Login;
