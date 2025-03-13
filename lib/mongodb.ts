// lib/mongodb.ts

import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

// 1) Augment the global object so TypeScript knows about our custom property.
// (This can also live in a separate `global.d.ts` if you prefer.)
declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

// 2) Helper to ensure global.mongooseConn is always initialized
function getCachedConnection() {
  if (!global.mongooseConn) {
    global.mongooseConn = { conn: null, promise: null };
  }
  return global.mongooseConn;
}

// 3) The main connection function
async function dbConnect(): Promise<Mongoose> {
  // Retrieve (and if needed, initialize) the global cache
  const cached = getCachedConnection();

  // If a valid connection already exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no existing connection promise, create one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  // Await the promise, store the connection, and return it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

