const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String, required: true },       // icon for the income category
    source: { type: String, required: true },     // source of income (was title)
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
