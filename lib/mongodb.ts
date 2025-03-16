// lib/mongodb.ts
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

// Tell TypeScript that our global object has a mongooseConn property.
// We disable the 'no-var' rule only for this declaration line if needed.
declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

/** Returns a cached connection object, or creates a new one. */
function getCachedConnection() {
  if (!global.mongooseConn) {
    global.mongooseConn = { conn: null, promise: null };
  }
  return global.mongooseConn;
}

async function dbConnect(): Promise<Mongoose> {
  const cached = getCachedConnection();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
