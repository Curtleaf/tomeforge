
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

// Determine if using local or Atlas MongoDB based on MONGODB_CLUSTER format
const isLocalMongoDB = process.env.MONGODB_CLUSTER?.includes('localhost') || process.env.MONGODB_CLUSTER?.includes('127.0.0.1');
const protocol = isLocalMongoDB ? 'mongodb://' : 'mongodb+srv://';
const clusterSuffix = isLocalMongoDB ? '' : '.mongodb.net';

const uri = process.env.MONGODB_URI ||
  `${protocol}${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}${clusterSuffix}/?authSource=${process.env.MONGODB_DATABASE_NAME}&retryWrites=true&w=majority`;
const dbName = process.env.MONGODB_DATABASE_NAME;

let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection; // Return cached connection if available
  }

  try {
    const connection = await mongoose.connect(uri, {
      dbName: dbName, // Specify the database name here
      // ... other Mongoose connection options ... 
    });

    cachedConnection = connection;

    return connection;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err; 
  }
}
