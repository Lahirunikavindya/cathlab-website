/**
 * drop-indexes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Run this ONCE to remove any stale unique indexes left over from old schema
 * versions (e.g. itemCode, batchNumber, itemName, etc.).
 *
 * Usage:
 *   node drop-indexes.js
 *
 * Safe to run multiple times — it skips indexes that don't exist.
 */

require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cathlab_inventory";

async function dropStaleIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB:", MONGODB_URI);

    const db = mongoose.connection.db;
    const collection = db.collection("medicalitems");

    // List all current indexes
    const indexes = await collection.indexes();
    console.log("\n📋 Current indexes:");
    indexes.forEach((idx) => console.log(" •", JSON.stringify(idx.key), idx.unique ? "[UNIQUE]" : ""));

    // Fields that should NOT have a unique index
    const fieldsToCheck = [
      "itemName",
      "itemCode",
      "batchNumber",
      "category",
      "expiryDate",
      "note",
    ];

    for (const idx of indexes) {
      const indexFields = Object.keys(idx.key);
      // _id index is sacred — never drop it
      if (indexFields.includes("_id")) continue;

      const isStaleUnique =
        idx.unique === true && indexFields.some((f) => fieldsToCheck.includes(f));

      if (isStaleUnique) {
        console.log(`\n🗑️  Dropping stale unique index: "${idx.name}" on fields:`, indexFields);
        await collection.dropIndex(idx.name);
        console.log(`   ✅ Dropped "${idx.name}"`);
      }
    }

    console.log("\n✅ Done. All stale unique indexes removed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

dropStaleIndexes();
