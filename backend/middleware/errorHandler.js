
const mongoose = require("mongoose");

const errorHandler = (err, req, res, next) => {
  // ── MongoDB duplicate key error (code 11000) ──────────────────────────────
  if (err.code === 11000) {
    // keyValue contains the field(s) that caused the duplicate, e.g. { batchNumber: "B001" }
    const duplicatedField = err.keyValue ? Object.keys(err.keyValue)[0] : null;

    let message = "A record with these details already exists.";

    if (duplicatedField === "batchNumber") {
      message = "Batch number already exists. Please use a different batch number.";
    } else if (duplicatedField === "itemName") {
      message = "An item with this name already exists.";
    } else if (duplicatedField) {
      // Capitalise camelCase field for display, e.g. "itemCode" → "Item Code"
      const readable = duplicatedField.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
      message = `${readable} already exists. Please use a unique value.`;
    }

    return res.status(409).json({ message });
  }

  // ── Mongoose cast error (bad ObjectId) ────────────────────────────────────
  if (err instanceof mongoose.Error.CastError && err.path === "_id") {
    return res.status(400).json({ message: "Invalid item ID." });
  }

  // ── Mongoose validation error ─────────────────────────────────────────────
  if (err instanceof mongoose.Error.ValidationError) {
    const firstErrorMessage = Object.values(err.errors)[0]?.message;
    return res.status(400).json({
      message: firstErrorMessage || "Validation failed.",
    });
  }

  // ── Generic fallback ──────────────────────────────────────────────────────
  console.error(err);
  return res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong.",
  });
};

module.exports = errorHandler;
