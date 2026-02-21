// src/pages/Dashboard/Home.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Download,
  LogOut,
  User,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context";

const Home = () => {
  const navigate = useNavigate();
  const {  logout, loading } = useContext(UserContext);

  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    last5Transactions: [],
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);

      // Map last5Transactions safely
      const last5 = (response.data.last5Transactions || []).map((t) => ({
        _id: t._id,
        type: t.type,
        icon: t.icon || "",
        source: t.source ?? t.category ?? "N/A",
        amount: t.amount ?? 0,
        date: t.date ? new Date(t.date) : new Date(),
      }));

      setDashboardData({
        totalIncome: response.data.totalIncome ?? 0,
        totalExpense: response.data.totalExpense ?? 0,
        balance: (response.data.totalIncome ?? 0) - (response.data.totalExpense ?? 0),
        last5Transactions: last5,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-purple-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                Expense Tracker
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span>Welcome back!</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-red-600 hover:text-red-800"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${dashboardData.totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${dashboardData.totalExpense.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg ${
                  dashboardData.balance >= 0 ? "bg-blue-100" : "bg-red-100"
                }`}
              >
                <Wallet
                  className={`h-6 w-6 ${
                    dashboardData.balance >= 0 ? "text-blue-600" : "text-red-600"
                  }`}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    dashboardData.balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${dashboardData.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate("/income")}
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow flex items-center justify-center space-x-2 transition-colors"
          >
            <Plus className="h-6 w-6" />
            <span className="text-lg font-semibold">Add Income</span>
          </button>

          <button
            onClick={() => navigate("/expense")}
            className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-lg shadow flex items-center justify-center space-x-2 transition-colors"
          >
            <Plus className="h-6 w-6" />
            <span className="text-lg font-semibold">Add Expense</span>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h2>
            <button className="flex items-center text-sm text-purple-600 hover:text-purple-800">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {dashboardData.last5Transactions.length > 0 ? (
              dashboardData.last5Transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === "Income" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <span className="text-lg">{transaction.icon}</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.source ?? "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        transaction.type === "Income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "Income" ? "+" : "-"}$
                      {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>No transactions yet</p>
                <p className="text-sm">Start by adding your first income or expense</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;