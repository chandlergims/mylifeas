import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://link:JkGebcKbho5TvUu6@cluster0.hxfim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define the mongoose cache interface
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define the global with mongoose property
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize the cache
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Assign to global
if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

export default dbConnect;
