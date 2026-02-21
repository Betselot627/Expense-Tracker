// src/pages/Dashboard/Transactions.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context";

// You can move this to a separate file later
const categoryIcons = {
  Shopping: <span className="text-lg">🛍️</span>,
  Travel: <span className="text-lg">✈️</span>,
  "Electricity Bill": <span className="text-lg">💡</span>,
  "Loan Repayment": <span className="text-lg">🏦</span>,
  Transport: <span className="text-lg">🚌</span>,
  Food: <span className="text-lg">🍔</span>,
  Salary: <span className="text-lg">💰</span>,
  Freelance: <span className="text-lg">💻</span>,
  Other: <span className="text-lg">•</span>,
};

const Transactions = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // "all", "income", "expense"
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Adjust endpoint according to your backend
        const res = await axiosInstance.get("/api/transactions"); // or API_PATHS.TRANSACTIONS.GET_ALL
        const txs = res.data.map((t) => ({
          ...t,
          type: t.type?.toLowerCase() || "expense",
          amount: Number(t.amount) || 0,
          date: new Date(t.date),
          category: t.category || "Other",
          source: t.source || t.category || "Unknown",
        }));

        setTransactions(txs);
        setFilteredTransactions(txs);
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Apply filters & sorting
  useEffect(() => {
    let result = [...transactions];

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((tx) => tx.type === typeFilter);
    }

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.source?.toLowerCase().includes(term) ||
          tx.category?.toLowerCase().includes(term) ||
          tx.description?.toLowerCase().includes(term)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "date-desc") return b.date - a.date;
      if (sortBy === "date-asc") return a.date - b.date;
      if (sortBy === "amount-desc") return b.amount - a.amount;
      if (sortBy === "amount-asc") return a.amount - b.amount;
      return 0;
    });

    setFilteredTransactions(result);
  }, [transactions, searchTerm, typeFilter, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - same as dashboard */}
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
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <Wallet className="mr-3 h-5 w-5" />
            Dashboard
          </button>
          <button
            className="w-full flex items-center px-4 py-3 bg-purple-50 text-purple-700 rounded-xl font-medium"
          >
            <TrendingUp className="mr-3 h-5 w-5" />
            Transactions
          </button>
          <button
            onClick={() => navigate("/income")}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <TrendingUp className="mr-3 h-5 w-5" />
            Income
          </button>
          <button
            onClick={() => navigate("/expense")}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <TrendingDown className="mr-3 h-5 w-5" />
            Expense
          </button>
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b px-5 py-4 flex items-center justify-between md:justify-start gap-4 shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            All Transactions
          </h1>
        </header>

        <main className="p-5 md:p-8 max-w-7xl mx-auto">
          {/* Filters & Search */}
          <div className="bg-white rounded-xl shadow border p-5 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by category, note or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Type filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    typeFilter === "all"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTypeFilter("income")}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    typeFilter === "income"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setTypeFilter("expense")}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    typeFilter === "expense"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Expense
                </button>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="date-desc">Newest first</option>
                  <option value="date-asc">Oldest first</option>
                  <option value="amount-desc">Highest amount</option>
                  <option value="amount-asc">Lowest amount</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-xl shadow border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredTransactions.length} Transactions
              </h2>
              <button className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800">
                <Download size={16} />
                Export CSV
              </button>
            </div>

            {filteredTransactions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                          tx.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {categoryIcons[tx.category] || (tx.type === "income" ? "+" : "−")}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {tx.source || tx.category}
                        </p>
                        <p className="text-sm text-gray-500">
                          {tx.date.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {tx.description && ` • ${tx.description}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right whitespace-nowrap">
                      <p
                        className={`font-semibold text-lg ${
                          tx.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-gray-500">
                <p className="text-lg font-medium">No transactions found</p>
                <p className="mt-2">
                  {searchTerm || typeFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Start by adding your first transaction"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transactions;