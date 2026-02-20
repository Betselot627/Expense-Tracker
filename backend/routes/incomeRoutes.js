const express = require("express");
const router = express.Router();

const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeCSV,
} = require("../controllers/incomeController");

const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.get("/downloadcsv", protect, downloadIncomeCSV);
router.delete("/:id", protect, deleteIncome);

module.exports = router;
