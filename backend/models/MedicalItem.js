const mongoose = require("mongoose");

const medicalItemSchema = new mongoose.Schema(
  {
    inventoryGroup: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      trim: true,
    },
    subCategory: {
      type: String,
      trim: true,
      default: "",
    },
    itemName: {
      type: String,
      required: [true, "Item name is required."],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity cannot be negative."],
    },
    unitPrice: {
      type: Number,
      min: [0, "Unit price must be 0 or more."],
      default: 0,
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required."],
      validate: {
        validator: function (value) {
          let dateUTCms;

          if (typeof value === "string") {
            const parts = value.split("-");
            if (parts.length !== 3) return false;
            const [y, m, d] = parts.map((p) => Number(p));
            if ([y, m, d].some((n) => Number.isNaN(n))) return false;
            dateUTCms = Date.UTC(y, m - 1, d, 0, 0, 0);
          } else {
            const dateObj = new Date(value);
            if (Number.isNaN(dateObj.getTime())) return false;
            dateUTCms = Date.UTC(
              dateObj.getUTCFullYear(),
              dateObj.getUTCMonth(),
              dateObj.getUTCDate(),
              0,
              0,
              0
            );
          }

          const today = new Date();
          const todayUTCms = Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate(),
            0,
            0,
            0
          );

          return dateUTCms > todayUTCms;
        },
        message: "Expiry date must be a valid future date.",
      },
    },
    batchNumber: {
      type: String,
      trim: true,
      required: [true, "Batch number is required."],
    },
    // ── NEW: optional note field ──────────────────────────────────────────
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalItem", medicalItemSchema);
