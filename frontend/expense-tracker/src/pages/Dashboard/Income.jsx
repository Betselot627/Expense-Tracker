// src/pages/Dashboard/Income.jsx
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Download,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Toast from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    icon: "💰",
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Toast and modal states
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    incomeId: null,
  });

  const incomeIcons = ["💰", "💵", "🏦", "💳", "📈", "🎯", "💼", "🏢"];

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL);
      setIncomes(response.data);
    } catch (error) {
      console.error("Failed to fetch incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD, formData);
      setFormData({
        icon: "💰",
        source: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowForm(false);
      fetchIncomes();
      setToast({ message: "Income added successfully!", type: "success" });
    } catch (error) {
      console.error("Failed to add income:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add income. Please try again.";
      setToast({ message: errorMessage, type: "error" });
    }
  };

  const handleDelete = async (id) => {
    setConfirmModal({ isOpen: true, incomeId: id });
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(
        API_PATHS.INCOME.DELETE(confirmModal.incomeId),
      );
      fetchIncomes();
      setToast({ message: "Income deleted successfully!", type: "success" });
    } catch (error) {
      console.error("Failed to delete income:", error);
      setToast({
        message: "Failed to delete income. Please try again.",
        type: "error",
      });
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_CSV, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "incomes.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToast({ message: "CSV downloaded successfully!", type: "success" });
    } catch (error) {
      console.error("Failed to download CSV:", error);
      setToast({
        message: "Failed to download CSV. Please try again.",
        type: "error",
      });
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  // Monthly data for chart
  const monthlyData = incomes.reduce((acc, income) => {
    const month = new Date(income.date).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + income.amount;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />

      <div className="flex-1 overflow-auto pt-16 md:pt-0">
        <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Income Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Track and manage your income sources
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleDownloadCSV}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm flex-1 sm:flex-initial"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-md text-sm flex-1 sm:flex-initial"
              >
                <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
                Add Income
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-4 sm:p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-green-100 text-xs sm:text-sm font-medium mb-1">
                    Total Income
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-bold">
                    ${totalIncome.toLocaleString()}
                  </h2>
                </div>
                <div className="bg-white/20 p-2 sm:p-3 rounded-xl backdrop-blur-sm">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">
                    Total Transactions
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {incomes.length}
                  </h2>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-xl">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">
                    Average Income
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    $
                    {incomes.length > 0
                      ? Math.round(
                          totalIncome / incomes.length,
                        ).toLocaleString()
                      : 0}
                  </h2>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-xl">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 md:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Monthly Income Overview
              </h3>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      fill="#10b981"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Income List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Income History
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {incomes.length > 0 ? (
                    incomes.map((income, index) => (
                      <tr
                        key={income._id}
                        className="hover:bg-green-50/30 dark:hover:bg-green-900/20 transition"
                      >
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                              {income.icon}
                            </div>
                            <div className="min-w-0">
                              <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base block truncate">
                                {income.source}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                                {new Date(income.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                          {new Date(income.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                          <span className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                            +${income.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                          <button
                            onClick={() => handleDelete(income._id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 sm:px-6 py-12 sm:py-16 text-center"
                      >
                        <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-base sm:text-lg font-medium text-gray-500 dark:text-gray-400">
                          No income recorded yet
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2">
                          Click "Add Income" to get started
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Income Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Income
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {incomeIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-3 text-2xl border-2 rounded-xl hover:scale-110 transition ${
                        formData.icon === icon
                          ? "border-green-500 bg-green-50 dark:bg-green-900/30 shadow-md"
                          : "border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Income Source
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  placeholder="e.g., Salary, Freelance, Investment"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-medium shadow-md"
                >
                  Add Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, incomeId: null })}
        onConfirm={confirmDelete}
        title="Delete Income"
        message="Are you sure you want to delete this income? This action cannot be undone."
        type="danger"
      />
    </div>
  );
};

export default Income;
