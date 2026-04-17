const express = require("express");
const {
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
} = require("../controllers/itemController");

const router = express.Router();

// ── Named routes MUST come before /:id wildcard ──────────────────────────────
router.post("/", addItem);
router.get("/", getAllItems);
router.get("/low-stock", getLowStockItems);
router.get("/expiry", getExpiryItems);
router.get("/search", searchItems);

// ── Single-item routes ────────────────────────────────────────────────────────
router.get("/:id", getItemById);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.patch("/:id/use", useItem);
router.patch("/:id/sell", sellItem);

module.exports = router;
