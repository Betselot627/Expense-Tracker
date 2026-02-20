const Income = require("../models/income");
const Expense = require("../models/Expense");

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const now = new Date();
    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 30);

    const last60Days = new Date(now);
    last60Days.setDate(now.getDate() - 60);

    // -----------------------------
    // TOTALS
    // -----------------------------
    const allIncomes = await Income.find({ user: userId });
    const totalIncome = allIncomes.reduce((sum, item) => sum + item.amount, 0);

    const allExpenses = await Expense.find({ user: userId });
    const totalExpense = allExpenses.reduce((sum, item) => sum + item.amount, 0);

    // -----------------------------
    // LAST 30 DAYS
    // -----------------------------
    const incomeLast30 = await Income.find({
      user: userId,
      date: { $gte: last30Days },
    });
    const totalIncomeLast30 = incomeLast30.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const expenseLast30 = await Expense.find({
      user: userId,
      date: { $gte: last30Days },
    });
    const totalExpenseLast30 = expenseLast30.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    // -----------------------------
    // LAST 60 DAYS INCOME TRANSACTIONS
    // -----------------------------
    const incomeLast60 = await Income.find({
      user: userId,
      date: { $gte: last60Days },
    }).sort({ date: -1 });

    // -----------------------------
    // LAST 5 TRANSACTIONS (Income + Expense)
    // -----------------------------
    let last5Transactions = await Promise.all([
      Income.find({ user: userId }).select("-__v").lean(),
      Expense.find({ user: userId }).select("-__v").lean(),
    ]);

    // Merge, add type field
    last5Transactions = [
      ...last5Transactions[0].map((i) => ({ ...i, type: "Income" })),
      ...last5Transactions[1].map((e) => ({ ...e, type: "Expense" })),
    ];

    // Sort by date descending
    last5Transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Take only last 5
    last5Transactions = last5Transactions.slice(0, 5);

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeLast60, // income transactions in last 60 days
      totalIncomeLast30,
      totalExpenseLast30,
      incomeLast30,
      expenseLast30,
      last5Transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getDashboardData,
};
