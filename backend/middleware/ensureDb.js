const connectDB = require("../config/db");

async function ensureDb(req, res, next) {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = ensureDb;
