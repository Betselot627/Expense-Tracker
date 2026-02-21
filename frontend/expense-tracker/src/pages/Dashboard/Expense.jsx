import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Download, TrendingDown } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

const Expense = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    icon: "🛒",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const expenseIcons = [
    "🛒",
    "🍔",
    "⛽",
    "🏠",
    "🚗",
    "💊",
    "🎬",
    "👕",
    "📱",
    "✈️",
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL);
      setExpenses(response.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD, formData);
      setFormData({
        icon: "🛒",
        category: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axiosInstance.delete(API_PATHS.EXPENSE.DELETE(id));
        fetchExpenses();
      } catch (error) {
        console.error("Failed to delete expense:", error);
        alert("Failed to delete expense. Please try again.");
      }
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_CSV, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download CSV:", error);
      alert("Failed to download CSV. Please try again.");
    }
  };

  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <TrendingDown className="h-8 w-8 text-red-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                Expense Management
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownloadCSV}
                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Expenses
              </p>
              <p className="text-3xl font-bold text-red-600">
                ${totalExpense.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {expenses.length} transactions
              </p>
            </div>
          </div>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {expenseIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-3 text-2xl border rounded-lg hover:bg-gray-50 ${
                          formData.icon === icon
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Food, Transport, Entertainment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Expense List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Expense History
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <span className="text-xl">{expense.icon}</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {expense.category}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-semibold text-red-600">
                      -${expense.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <TrendingDown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No expenses recorded yet</p>
                <p className="text-sm">Click "Add Expense" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;
