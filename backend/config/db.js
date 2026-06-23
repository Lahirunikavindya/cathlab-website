const mongoose = require("mongoose");
const dns = require("node:dns");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (cached.promise) {
    return cached.promise;
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI (or MONGO_URI) in environment variables");
  }

  if (mongoUri.startsWith("mongodb+srv://") && process.env.DNS_SERVERS) {
    const dnsServers = process.env.DNS_SERVERS
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (dnsServers.length > 0) {
      dns.setServers(dnsServers);
    }
  }

  cached.promise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    })
    .then((connection) => {
      console.log(`MongoDB connected: ${connection.connection.host}`);
      cached.conn = connection;
      return connection;
    })
    .catch((error) => {
      cached.promise = null;
      console.error("Database connection failed:", error.message);
      if (String(error.message || "").includes("querySrv ECONNREFUSED")) {
        console.error(
          "Tip: If SRV DNS fails on your network, use Atlas standard URI (mongodb://...) or set DNS_SERVERS in backend/.env"
        );
      }
      throw error;
    });

  return cached.promise;
};

module.exports = connectDB;
