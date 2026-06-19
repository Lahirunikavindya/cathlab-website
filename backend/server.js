const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const itemRoutes = require("./routes/itemRoutes");
const usageRoutes = require("./routes/usageRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Cath Lab backend is running." });
});

app.use("/api/items", itemRoutes);
app.use("/api/usage", usageRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found." });
});

app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
