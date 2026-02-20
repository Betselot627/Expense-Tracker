const express = require("express");
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenseCSV,
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpenses);
router.get("/downloadcsv", protect, downloadExpenseCSV);
router.delete("/:id", protect, deleteExpense);

module.exports = router;
