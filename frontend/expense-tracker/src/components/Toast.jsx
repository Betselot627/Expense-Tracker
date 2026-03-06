// src/components/Toast.jsx
import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400",
      textColor: "text-green-800 dark:text-green-300",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50 dark:bg-red-900/30",
      borderColor: "border-red-200 dark:border-red-800",
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-800 dark:text-red-300",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/30",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      textColor: "text-yellow-800 dark:text-yellow-300",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
      textColor: "text-blue-800 dark:text-blue-300",
    },
  };

  const config = typeConfig[type] || typeConfig.success;
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideInRight">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${config.bgColor} ${config.borderColor} min-w-[300px] max-w-md`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
        <p className={`flex-1 text-sm font-medium ${config.textColor}`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
