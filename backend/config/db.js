const mongoose = require("mongoose");
const dns = require("node:dns");

const RETRY_MS = Number(process.env.DB_RETRY_MS || 10000);

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Missing MONGODB_URI (or MONGO_URI) in environment variables");
    }

    // Some networks block local DNS SRV lookups used by mongodb+srv.
    // Allow overriding resolvers so Atlas can still be reached.
    if (mongoUri.startsWith("mongodb+srv://")) {
      const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);

      if (dnsServers.length > 0) {
        dns.setServers(dnsServers);
      }
    }

    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    if (String(error.message || "").includes("querySrv ECONNREFUSED")) {
      console.error(
        "Tip: If SRV DNS fails on your network, use Atlas standard URI (mongodb://...) or set DNS_SERVERS in backend/.env"
      );
    }
    console.log(`Retrying MongoDB connection in ${RETRY_MS / 1000}s...`);
    setTimeout(connectDB, RETRY_MS);
  }
};

module.exports = connectDB;
