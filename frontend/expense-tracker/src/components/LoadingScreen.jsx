// src/components/LoadingScreen.jsx
import { Wallet } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          {/* Pulse rings */}
          <div className="absolute inset-0 w-20 h-20 mx-auto bg-purple-400 rounded-2xl animate-ping opacity-20"></div>
        </div>

        {/* Loading text */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Loading...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we fetch your data
        </p>

        {/* Loading bar */}
        <div className="mt-6 w-64 mx-auto h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
