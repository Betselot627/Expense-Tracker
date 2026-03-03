// src/pages/Dashboard/Transactions.jsx
import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

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

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        const [incomeRes, expenseRes] = await Promise.all([
          axiosInstance.get(API_PATHS.INCOME.GET_ALL),
          axiosInstance.get(API_PATHS.EXPENSE.GET_ALL),
        ]);

        const incomeTransactions = (incomeRes.data || []).map((t) => ({
          ...t,
          type: "income",
          amount: Number(t.amount) || 0,
          date: new Date(t.date),
          category: t.source || "Income",
          source: t.source || "Unknown",
        }));

        const expenseTransactions = (expenseRes.data || []).map((t) => ({
          ...t,
          type: "expense",
          amount: Number(t.amount) || 0,
          date: new Date(t.date),
          category: t.category || "Other",
          source: t.category || "Unknown",
        }));

        const allTransactions = [...incomeTransactions, ...expenseTransactions];

        setTransactions(allTransactions);
        setFilteredTransactions(allTransactions);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];

    if (typeFilter !== "all") {
      result = result.filter((tx) => tx.type === typeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.source?.toLowerCase().includes(term) ||
          tx.category?.toLowerCase().includes(term) ||
          tx.description?.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "date-desc") return b.date - a.date;
      if (sortBy === "date-asc") return a.date - b.date;
      if (sortBy === "amount-desc") return b.amount - a.amount;
      if (sortBy === "amount-asc") return a.amount - b.amount;
      return 0;
    });

    setFilteredTransactions(result);
  }, [transactions, searchTerm, typeFilter, sortBy]);

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // === CSV Export Function ===
  const handleDownloadCSV = () => {
    if (filteredTransactions.length === 0) return;

    const rows = filteredTransactions.map((tx) => ({
      Type: tx.type,
      Category: tx.category,
      Source: tx.source,
      Date: tx.date.toLocaleDateString("en-US"),
      Amount: tx.amount,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-red-600 text-lg font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                All Transactions
              </h1>
              <p className="text-gray-600">
                View and manage all your financial transactions
              </p>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-md"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Total Transactions
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {transactions.length}
                  </h2>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <ArrowUpDown className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">
                    Total Income
                  </p>
                  <h2 className="text-3xl font-bold">
                    ${totalIncome.toLocaleString()}
                  </h2>
                </div>
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-red-100 text-sm font-medium mb-1">
                    Total Expenses
                  </p>
                  <h2 className="text-3xl font-bold">
                    ${totalExpense.toLocaleString()}
                  </h2>
                </div>
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <TrendingDown className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>

              {/* Type Filter */}
              <div className="flex gap-2">
                {["all", "income", "expense"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium capitalize transition ${
                      typeFilter === type
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition appearance-none bg-white"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredTransactions.length} Transaction
                {filteredTransactions.length !== 1 ? "s" : ""}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category/Source
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr
                        key={tx._id}
                        className={`hover:bg-opacity-30 transition ${
                          tx.type === "income"
                            ? "hover:bg-green-50"
                            : "hover:bg-red-50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                              tx.type === "income"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {tx.type === "income" ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            {tx.type === "income" ? "Income" : "Expense"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                                tx.type === "income"
                                  ? "bg-green-100"
                                  : "bg-red-100"
                              }`}
                            >
                              {categoryIcons[tx.category] || "•"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {tx.source || tx.category}
                              </p>
                              <p className="text-xs text-gray-500">{tx.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {tx.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`text-lg font-bold ${
                              tx.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {tx.type === "income" ? "+" : "-"}$
                            {tx.amount.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ArrowUpDown className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium text-gray-500">
                            No transactions found
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            {searchTerm || typeFilter !== "all"
                              ? "Try adjusting your filters"
                              : "Start by adding your first transaction"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Info */}
            {filteredTransactions.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600 text-center">
                  Showing {filteredTransactions.length} of {transactions.length} total transactions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;