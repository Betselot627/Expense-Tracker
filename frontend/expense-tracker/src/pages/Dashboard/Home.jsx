// src/pages/Dashboard/Home.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  LogOut,
  ShoppingBag,
  Plane,
  Lightbulb,
  Home as HomeIcon,
  Bus,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const categoryIcons = {
  Shopping: <ShoppingBag className="h-5 w-5" />,
  Travel: <Plane className="h-5 w-5" />,
  "Electricity Bill": <Lightbulb className="h-5 w-5" />,
  "Loan Repayment": <HomeIcon className="h-5 w-5" />,
  Transport: <Bus className="h-5 w-5" />,
  Food: <span className="text-lg">🍔</span>,
  Other: <span className="text-lg">•</span>,
};

const Home = () => {
  const navigate = useNavigate();
  const { logout, loading: authLoading, user } = useContext(UserContext);

  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    recentTransactions: [],
  });

  const [monthlyOverview, setMonthlyOverview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
        const txs = (res.data.last5Transactions || []).map((t) => ({
          ...t,
          amount: Number(t.amount) || 0,
          date: new Date(t.date || Date.now()),
          category: t.category || "Other",
          source: t.source || t.category || "Unknown",
          type: t.type?.toLowerCase() === "income" ? "income" : "expense",
        }));

        let income = 0;
        let expense = 0;
        txs.forEach((t) => {
          if (t.type === "income") income += t.amount;
          else expense += t.amount;
        });

        // Monthly overview (last 6 months)
        const months = {};
        const now = new Date();
        for (let i = 0; i < 6; i++) {
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

        const sortedMonths = Object.values(months).reverse();

        setData({
          totalIncome: income,
          totalExpense: expense,
          balance: income - expense,
          recentTransactions: txs
            .sort((a, b) => b.date - a.date)
            .slice(0, 8),
        });

        setMonthlyOverview(sortedMonths);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Separate income & expense transactions
  const incomeTransactions = data.recentTransactions.filter(
    (tx) => tx.type === "income"
  );
  const expenseTransactions = data.recentTransactions.filter(
    (tx) => tx.type === "expense"
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-white border-r border-gray-200">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {user?.name?.[0]?.toUpperCase() || "B"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name || "Betselot"}</p>
              <p className="text-xs text-gray-500">Premium</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            to="/"
            className="flex items-center px-4 py-3 bg-purple-50 text-purple-700 rounded-xl font-medium"
          >
            <Wallet className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/income"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <TrendingUp className="mr-3 h-5 w-5" />
            Income
          </Link>
          <Link
            to="/expense"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <TrendingDown className="mr-3 h-5 w-5" />
            Expense
          </Link>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile top bar */}
        <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
              B
            </div>
            <span className="font-semibold">{user?.name || "Betselot"}</span>
          </div>
          <button onClick={() => logout()} className="text-red-600">
            <LogOut size={22} />
          </button>
        </header>

        <main className="p-5 md:p-8 max-w-7xl mx-auto">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 mb-10">
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Balance</p>
                  <p className="text-3xl font-bold text-purple-700">
                    ${Math.abs(data.balance).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Wallet className="text-purple-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Income</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${data.totalIncome.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
                  <p className="text-3xl font-bold text-red-600">
                    ${data.totalExpense.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <TrendingDown className="text-red-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                <Link
                  to="/transactions"
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
                >
                  See All →
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {data.recentTransactions.length > 0 ? (
                  data.recentTransactions.map((tx) => (
                    <div
                      key={tx._id || tx.id}
                      className="py-4 flex items-center justify-between hover:bg-gray-50 transition rounded-lg px-2 -mx-2"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                          {categoryIcons[tx.category] || "•"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tx.source || tx.category}</p>
                          <p className="text-sm text-gray-500">
                            {tx.date.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold text-lg ${
                            tx.type === "income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    No transactions recorded yet
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Bar Chart */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Overview</h2>
              <div className="h-64 md:h-80">
                {monthlyOverview.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyOverview} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.6} />
                      <XAxis dataKey="month" axisLine={false} tick={{ fill: "#6b7280" }} />
                      <YAxis axisLine={false} tick={{ fill: "#6b7280" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    Not enough data for monthly view
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ────────────── Income Transactions ────────────── */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">Income Transactions</h2>
            <div className="divide-y divide-gray-100">
              {incomeTransactions.length > 0 ? (
                incomeTransactions.map((tx) => (
                  <div
                    key={tx._id || tx.id}
                    className="py-4 flex items-center justify-between hover:bg-green-50/40 transition rounded-lg px-2 -mx-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                        {categoryIcons[tx.category] || "+"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tx.source || tx.category}</p>
                        <p className="text-sm text-gray-600">
                          {tx.date.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-green-600">
                        +${tx.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-500">
                  No income transactions yet
                </div>
              )}
            </div>
          </div>

          {/* ────────────── Expense Transactions ────────────── */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">Expense Transactions</h2>
            <div className="divide-y divide-gray-100">
              {expenseTransactions.length > 0 ? (
                expenseTransactions.map((tx) => (
                  <div
                    key={tx._id || tx.id}
                    className="py-4 flex items-center justify-between hover:bg-red-50/40 transition rounded-lg px-2 -mx-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700">
                        {categoryIcons[tx.category] || "−"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tx.source || tx.category}</p>
                        <p className="text-sm text-gray-600">
                          {tx.date.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-red-600">
                        -${tx.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-500">
                  No expense transactions yet
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;