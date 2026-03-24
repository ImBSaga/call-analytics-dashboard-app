const mongoose = require('mongoose');

// Mongoose connection options for stability
const options = {
  autoIndex: true, // Build indexes (disable in high-throughput production)
  connectTimeoutMS: 10000, // Give up after 10s
  socketTimeoutMS: 45000,  // Close sockets after 45s of inactivity
};

/**
 * Robust database connector.
 * Handles connection pooling and prevents double-connecting in serverless environments.
 */
async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    throw new Error('Database connection URI missing');
  }

  try {
    console.log('⏳ Connecting to MongoDB Cloud...');
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`📦 Connected to MongoDB: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    // Don't exit process in serverless (let Vercel handle it), 
    // but in local dev we might want to know.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  Falling back to local if possible (not implemented, but API will still run)');
    }
    throw err;
  }
}

module.exports = connectDB;
