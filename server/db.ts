import mongoose from 'mongoose';
import dns from 'node:dns';
import dotenv from 'dotenv';

dotenv.config();

// Fix Node.js SRV DNS resolution on Windows/certain network providers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.warn('Could not set custom DNS servers for SRV resolution:', err);
}

export async function connectDB() {
  let mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('⚠️ MONGO_URL is not defined in .env! Database features will not work.');
    return;
  }

  // Ensure default database name if URI ends with /
  if (mongoUri.endsWith('/')) {
    mongoUri += 'cryptoguard';
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected successfully to database: "${mongoose.connection.name}"`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}
