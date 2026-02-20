const Expense = require("../models/Expense");

// Add Expense
const addExpense = async (req, res) => {
  try {
    const { icon, category, amount, date } = req.body;

    if (!icon || !category || !amount) {
      return res.status(400).json({
        message: "Please provide icon, category and amount",
      });
    }

    const newExpense = new Expense({
      user: req.user._id,
      icon,
      category,
      amount: Number(amount),
      date: date || Date.now(),
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Expenses
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      date: -1,
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Expense CSV
const downloadExpenseCSV = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      date: -1,
    });

    let csv = "Icon,Category,Amount,Date\n";

    expenses.forEach((expense) => {
      csv += `"${expense.icon}","${expense.category}",${expense.amount},"${new Date(
        expense.date
      ).toISOString().split("T")[0]}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=expenses.csv");

    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenseCSV,
};
