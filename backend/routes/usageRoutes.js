const express = require("express");
const { getAllUsage, getMonthlyUsage } = require("../controllers/usageController");

const router = express.Router();

// GET /api/usage/monthly  → must come BEFORE /api/usage (exact match)
router.get("/monthly", getMonthlyUsage);

// GET /api/usage
router.get("/", getAllUsage);

module.exports = router;
