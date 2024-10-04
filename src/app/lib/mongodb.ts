import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

let cachedDb: mongoose.Connection | null = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb; // Return the cached connection if it already exists
  }

  try {
    const opts = { dbName: 'Todo-apps' };
    const conn = await mongoose.connect(uri as string, opts); // Assert that uri is definitely a string

    cachedDb = conn.connection; // Cache the connection
    console.log('Connected to MongoDB');
    return cachedDb;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw new Error('Failed to connect to MongoDB');
  }
}
