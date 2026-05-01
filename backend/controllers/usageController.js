const mongoose = require("mongoose");
const MedicalItem = require("../models/MedicalItem");
const UsageHistory = require("../models/UsageHistory");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─── POST /api/items/:id/usage ─────────────────────────────────────────────────
// Record usage: reduces item quantity and saves a usage history record
const recordUsage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid item ID." });
    }

    const usedQuantity = Number(req.body.usedQuantity);
    const note = req.body.note || "";

    if (!usedQuantity || usedQuantity <= 0) {
      return res.status(400).json({ message: "Used quantity must be greater than 0." });
    }

    const item = await MedicalItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Medical item not found." });
    }

    if (usedQuantity > item.quantity) {
      return res.status(400).json({
        message: `Not enough stock. Only ${item.quantity} unit(s) available.`,
      });
    }

    // Save usage history record
    await UsageHistory.create({
      itemId: item._id,
      itemName: item.itemName,
      batchNumber: item.batchNumber,
      usedQuantity,
      usageDate: new Date(),
      note,
    });

    const newQuantity = item.quantity - usedQuantity;

    // Auto-delete when quantity reaches zero
    if (newQuantity === 0) {
      await MedicalItem.findByIdAndDelete(id);
      return res.status(200).json({
        message: `All ${usedQuantity} unit(s) recorded. Item removed from inventory (stock depleted).`,
        deleted: true,
      });
    }

    item.quantity = newQuantity;
    await item.save();

    return res.status(200).json({
      message: `${usedQuantity} unit(s) recorded. Remaining quantity: ${newQuantity}.`,
      deleted: false,
      item,
    });
  } catch (error) {
    return next(error);
  }
};

// ─── GET /api/usage ────────────────────────────────────────────────────────────
// Return all usage history records, newest first
const getAllUsage = async (req, res, next) => {
  try {
    const search = req.query.search?.trim() || "";
    const filter = search
      ? { itemName: { $regex: search, $options: "i" } }
      : {};

    const records = await UsageHistory.find(filter).sort({ usageDate: -1 });
    return res.status(200).json(records);
  } catch (error) {
    return next(error);
  }
};

// ─── GET /api/usage/monthly ────────────────────────────────────────────────────
// Returns usage grouped by month: { month, totalUsedQuantity, numberOfUsageRecords }
const getMonthlyUsage = async (req, res, next) => {
  try {
    const summary = await UsageHistory.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$usageDate" },
            month: { $month: "$usageDate" },
          },
          totalUsedQuantity: { $sum: "$usedQuantity" },
          numberOfUsageRecords: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalUsedQuantity: 1,
          numberOfUsageRecords: 1,
        },
      },
    ]);

    return res.status(200).json(summary);
  } catch (error) {
    return next(error);
  }
};

module.exports = { recordUsage, getAllUsage, getMonthlyUsage };
