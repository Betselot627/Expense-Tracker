const Income = require("../models/Income");

// Add new income
const addIncome = async (req, res) => {
  try {
    const { icon, source, amount, date } = req.body;

    if (!icon || !source || !amount) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const newIncome = new Income({
      user: req.user._id,
      icon,
      source,
      amount: Number(amount),
      date: date || Date.now(),
    });

    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all incomes
const getAllIncome = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id }).sort({
      date: -1,
    });

    res.status(200).json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete income
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await income.deleteOne();

    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Download CSV (FIXED & SAFE)
const downloadIncomeCSV = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id }).sort({
      date: -1,
    });

    let csv = "Icon,Source,Amount,Date\n";

    incomes.forEach((income) => {
      csv += `"${income.icon}","${income.source}",${income.amount},"${new Date(
        income.date,
      ).toISOString()}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=incomes.csv");

    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeCSV,
};
