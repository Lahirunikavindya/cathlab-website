const mongoose = require("mongoose");

const usageHistorySchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalItem",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    batchNumber: {
      type: String,
      required: true,
      trim: true,
    },
    usedQuantity: {
      type: Number,
      required: true,
      min: [1, "Used quantity must be at least 1."],
    },
    usageDate: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UsageHistory", usageHistorySchema);
