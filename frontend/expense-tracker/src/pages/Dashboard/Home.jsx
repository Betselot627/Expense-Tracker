// src/pages/Dashboard/Home.jsx
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const COLORS = {
  income: "#10b981",
  expense: "#ef4444",
  primary: "#8b5cf6",
  secondary: "#6366f1",
};

const categoryIcons = {
  Shopping: "🛍️",
  Travel: "✈️",
  "Electricity Bill": "💡",
  "Loan Repayment": "🏦",
  Transport: "🚌",
  Food: "🍔",
  Salary: "💰",
  Freelance: "💻",
  Other: "•",
};

const Home = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    recentTransactions: [],
  });

  const [monthlyOverview, setMonthlyOverview] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
        const txs = (res.data.last5Transactions || []).map((t) => ({
          ...t,
          amount: Number(t.amount) || 0,
          date: new Date(t.date || Date.now()),
          category: t.category || t.source || "Other",
          source: t.source || t.category || "Unknown",
          type: t.type?.toLowerCase() === "income" ? "income" : "expense",
        }));

        let income = 0;
        let expense = 0;
        const categories = {};

        txs.forEach((t) => {
          if (t.type === "income") {
            income += t.amount;
          } else {
            expense += t.amount;
            categories[t.category] = (categories[t.category] || 0) + t.amount;
          }
        });

        // Monthly overview (last 6 months)
        const months = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const label = d.toLocaleString("default", { month: "short" });
          months[label] = { month: label, Income: 0, Expense: 0 };
        }

        txs.forEach((t) => {
          const m = t.date.toLocaleString("default", { month: "short" });
          if (months[m]) {
            if (t.type === "income") months[m].Income += t.amount;
            else months[m].Expense += t.amount;
          }
        });

        // Category pie chart data
        const catData = Object.entries(categories)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setData({
          totalIncome: income,
          totalExpense: expense,
          balance: income - expense,
          recentTransactions: txs.sort((a, b) => b.date - a.date).slice(0, 6),
        });

        setMonthlyOverview(Object.values(months));
        setCategoryData(catData);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  const balanceChange = data.totalIncome - data.totalExpense;
  const balancePercentage =
    data.totalIncome > 0
      ? ((balanceChange / data.totalIncome) * 100).toFixed(1)
      : 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.fullName?.split(" ")[0] || "User"}! 
            </h1>
            <p className="text-gray-600">Here's your financial overview</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">
                    Total Balance
                  </p>
                  <h2 className="text-4xl font-bold">
                    ${Math.abs(data.balance).toLocaleString()}
                  </h2>
                </div>
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {balanceChange >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-300" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-300" />
                )}
                <span className="font-medium">
                  {balancePercentage}% from last month
                </span>
              </div>
            </div>

            {/* Income Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Total Income
                  </p>
                  <h2 className="text-3xl font-bold text-green-600">
                    ${data.totalIncome.toLocaleString()}
                  </h2>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Activity className="w-4 h-4" />
                <span>Active income streams</span>
              </div>
            </div>

            {/* Expense Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Total Expenses
                  </p>
                  <h2 className="text-3xl font-bold text-red-600">
                    ${data.totalExpense.toLocaleString()}
                  </h2>
                </div>
                <div className="bg-red-100 p-3 rounded-xl">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Activity className="w-4 h-4" />
                <span>Monthly spending</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Monthly Overview - Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Monthly Overview
              </h3>
              <div className="h-80">
                {monthlyOverview.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyOverview}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                      />
                      <YAxis
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="Income"
                        fill={COLORS.income}
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="Expense"
                        fill={COLORS.expense}
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Category Breakdown - Pie Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Top Expenses
              </h3>
              <div className="h-80">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              [
                                "#8b5cf6",
                                "#6366f1",
                                "#ec4899",
                                "#f59e0b",
                                "#10b981",
                              ][index % 5]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No expense data
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h3>
              <Link
                to="/transactions"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1 transition"
              >
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {data.recentTransactions.length > 0 ? (
                data.recentTransactions.map((tx) => (
                  <div
                    key={tx._id || tx.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                          tx.type === "income" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {categoryIcons[tx.category] || "•"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {tx.source || tx.category}
                        </p>
                        <p className="text-sm text-gray-500">
                          {tx.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}$
                      {tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <p className="text-lg font-medium">No transactions yet</p>
                  <p className="text-sm mt-2">
                    Start by adding your first transaction
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Income & Expense Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Transactions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  Income Transactions
                </h3>
                <Link
                  to="/income"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {data.recentTransactions
                  .filter((tx) => tx.type === "income")
                  .slice(0, 5)
                  .map((tx) => (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition border border-green-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-lg">
                          {categoryIcons[tx.category] || "💰"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {tx.source || tx.category}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tx.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-green-600">
                        +${tx.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                {data.recentTransactions.filter((tx) => tx.type === "income")
                  .length === 0 && (
                  <div className="py-8 text-center text-gray-400">
                    <p className="text-sm">No income transactions yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Expense Transactions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  Expense Transactions
                </h3>
                <Link
                  to="/expense"
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {data.recentTransactions
                  .filter((tx) => tx.type === "expense")
                  .slice(0, 5)
                  .map((tx) => (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition border border-red-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-lg">
                          {categoryIcons[tx.category] || "🛒"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {tx.source || tx.category}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tx.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-red-600">
                        -${tx.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                {data.recentTransactions.filter((tx) => tx.type === "expense")
                  .length === 0 && (
                  <div className="py-8 text-center text-gray-400">
                    <p className="text-sm">No expense transactions yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
