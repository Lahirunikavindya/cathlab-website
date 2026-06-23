const mongoose = require("mongoose");
const MedicalItem = require("../models/MedicalItem");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const LOW_STOCK_THRESHOLD = 3;

// ─── Add Item ────────────────────────────────────────────────────────────────
const addItem = async (req, res, next) => {
  try {
    // Strip out any fields the form might accidentally send that we don't want
    const {
      inventoryGroup,
      category,
      subCategory,
      itemName,
      quantity,
      unitPrice,
      batchNumber,
      expiryDate,
      note,
    } = req.body;

    const item = await MedicalItem.create({
      inventoryGroup: inventoryGroup || "",
      category,
      subCategory: subCategory || "",
      itemName,
      quantity,
      unitPrice,
      batchNumber,
      expiryDate,
      note: note || "",
    });

    return res.status(201).json({
      message: "Medical item added successfully.",
      item,
    });
  } catch (error) {
    return next(error);
  }
};

// ─── Get All Items (with optional ?search=) ──────────────────────────────────
const getAllItems = async (req, res, next) => {
  try {
    const search = req.query.search?.trim() || "";
    const filter = search
      ? {
          $or: [
            { itemName: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { subCategory: { $regex: search, $options: "i" } },
            { inventoryGroup: { $regex: search, $options: "i" } },
            { batchNumber: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const items = await MedicalItem.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (error) {
    return next(error);
  }
};

// ─── Low Stock (quantity < 3) ─────────────────────────────────────────────────
const getLowStockItems = async (req, res, next) => {
  try {
    const items = await MedicalItem.find({ quantity: { $lt: LOW_STOCK_THRESHOLD } }).sort({
      createdAt: -1,
    });
    return res.status(200).json(items);
  } catch (error) {
    return next(error);
  }
};

// ─── Expiry Items ─────────────────────────────────────────────────────────────
const getExpiryItems = async (req, res, next) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);

    const expired = await MedicalItem.find({
      expiryDate: { $lt: today },
    }).sort({ expiryDate: 1 });

    const nearExpiry = await MedicalItem.find({
      expiryDate: { $gte: today, $lte: in7Days },
    }).sort({ expiryDate: 1 });

    return res.status(200).json({ expired, nearExpiry });
  } catch (error) {
    return next(error);
  }
};

// ─── Smart Search (?q=keyword) ────────────────────────────────────────────────
const searchItems = async (req, res, next) => {
  try {
    const q = req.query.q?.trim() || "";
    if (!q) {
      return res.status(200).json([]);
    }

    const items = await MedicalItem.find({
      $or: [
        { itemName: { $regex: q, $options: "i" } },
        { batchNumber: { $regex: q, $options: "i" } },
      ],
    })
      .sort({ itemName: 1 })
      .limit(20);

    return res.status(200).json(items);
  } catch (error) {
    return next(error);
  }
};

// ─── Get Single Item ──────────────────────────────────────────────────────────
const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid item ID." });
    }

    const item = await MedicalItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Medical item not found." });
    }

    return res.status(200).json(item);
  } catch (error) {
    return next(error);
  }
};

// ─── Update Item ──────────────────────────────────────────────────────────────
const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid item ID." });
    }

    const {
      inventoryGroup,
      category,
      subCategory,
      itemName,
      quantity,
      unitPrice,
      batchNumber,
      expiryDate,
      note,
    } = req.body;

    const updatedItem = await MedicalItem.findByIdAndUpdate(
      id,
      {
        inventoryGroup: inventoryGroup || "",
        category,
        subCategory: subCategory || "",
        itemName,
        quantity,
        unitPrice,
        batchNumber,
        expiryDate,
        note: note || "",
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Medical item not found." });
    }

    return res.status(200).json({
      message: "Medical item updated successfully.",
      item: updatedItem,
    });
  } catch (error) {
    return next(error);
  }
};

// ─── Delete Item ──────────────────────────────────────────────────────────────
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid item ID." });
    }

    const deletedItem = await MedicalItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Medical item not found." });
    }

    return res.status(200).json({ message: "Medical item deleted successfully." });
  } catch (error) {
    return next(error);
  }
};

// ─── Use Item (PATCH /:id/use) ────────────────────────────────────────────────
// Reduces quantity by usedQuantity.
// AUTO-DELETES the item if quantity reaches 0.
const useItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid item ID." });
    }

    const usedQuantity = Number(req.body.usedQuantity);

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

    const newQuantity = item.quantity - usedQuantity;

    // ── Auto-delete when quantity reaches zero ───────────────────────────────
    if (newQuantity === 0) {
      await MedicalItem.findByIdAndDelete(id);
      return res.status(200).json({
        message: `All ${usedQuantity} unit(s) used. Item has been removed from inventory automatically.`,
        deleted: true,
      });
    }

    // ── Otherwise update quantity ────────────────────────────────────────────
    item.quantity = newQuantity;
    await item.save();

    return res.status(200).json({
      message: `${usedQuantity} unit(s) used successfully. Remaining quantity: ${newQuantity}.`,
      deleted: false,
      item,
    });
  } catch (error) {
    return next(error);
  }
};

// ─── Sell Item (PATCH /:id/sell) ──────────────────────────────────────────────
// Reduces quantity when a product is sold.
// AUTO-DELETES the item if quantity reaches 0.
const sellItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid item ID." });
    }

    const soldQuantity = Number(req.body.soldQuantity);

    if (!soldQuantity || soldQuantity <= 0) {
      return res.status(400).json({ message: "Sold quantity must be greater than 0." });
    }

    const item = await MedicalItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Medical item not found." });
    }

    if (soldQuantity > item.quantity) {
      return res.status(400).json({
        message: `Not enough stock available. Current quantity: ${item.quantity}.`,
      });
    }

    const newQuantity = item.quantity - soldQuantity;

    // ── Auto-delete when quantity reaches zero ───────────────────────────────
    if (newQuantity === 0) {
      await MedicalItem.findByIdAndDelete(id);
      return res.status(200).json({
        message: `Successfully sold ${soldQuantity} unit(s). Item stock is now 0 and has been removed from inventory.`,
        deleted: true,
      });
    }

    // ── Otherwise update quantity ────────────────────────────────────────────
    item.quantity = newQuantity;
    await item.save();

    return res.status(200).json({
      message: `Successfully sold ${soldQuantity} unit(s). Remaining: ${newQuantity}.`,
      deleted: false,
      item,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addItem,
  getAllItems,
  getLowStockItems,
  getExpiryItems,
  searchItems,
  getItemById,
  updateItem,
  deleteItem,
  useItem,
  sellItem,
};
