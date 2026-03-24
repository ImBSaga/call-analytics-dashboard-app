const mongoose = require("mongoose");

/**
 * Robust Database Connection Utility for Serverless (Vercel)
 * Manages connection pooling and provides high timeouts for cloud handshakes.
 */

let cachedConnection = null;

const connectDB = async () => {
  // If we already have a connection, reuse it (crucial for Vercel cold starts)
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const options = {
    // High timeouts for slow Atlas Free Tier handshakes
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
    serverSelectionTimeoutMS: 60000,
    // Optimize for serverless: small pool to avoid hitting Atlas M0 limits
    maxPoolSize: 2,
    minPoolSize: 1,
    // Keep connection alive
    heartbeatFrequencyMS: 10000,
  };

  try {
    console.log("⏳ Attempting Cloud MongoDB Connection...");

    // Create new connection if none exists
    cachedConnection = await mongoose.connect(uri, options);

    console.log("📦 Connected to MongoDB Cloud:", mongoose.connection.host);
    return cachedConnection;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);

    // Clear cache so next attempt tries fresh
    cachedConnection = null;
    throw err;
  }
};

module.exports = connectDB;
