import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// MongoDB Native Client (for @next-auth/mongodb-adapter)
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Preserve client across hot reloads in development
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Mongoose Connection
let mongooseConnected = false;
async function connectMongoDB() {
  if (mongooseConnected) return;
  await mongoose.connect(uri);
  mongooseConnected = true;
}

export { connectMongoDB, clientPromise };
