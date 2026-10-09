import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    const promise = client.connect();
    promise.catch((err) => {
      console.warn("⚠️ MongoDB connection warning:", err.message);
    });
    globalWithMongo._mongoClientPromise = promise;
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  const promise = client.connect();
  promise.catch((err) => {
    console.warn("⚠️ MongoDB connection warning:", err.message);
  });
  clientPromise = promise;
}

export default clientPromise;
