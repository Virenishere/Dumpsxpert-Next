import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://upadhayayyogesh832:123freelanceproject123@cluster0.ga6zbb8.mongodb.net/dumpsxpertDB?retryWrites=true&w=majority&appName=Cluster0";

if (!uri) throw new Error("Missing MongoDB URI");
console.log(uri);
// Mongoose Connection
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null };

export const connectMongoDB = async () => {
  if (cached.conn) return cached.conn;

  const opts = {
    bufferCommands: false,
  };

  cached.conn = await mongoose.connect(uri, opts);
  return cached.conn;
};

// MongoDB Native Client
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export { clientPromise };
console.log("Mongoose connection state:", mongoose.connection.readyState);
