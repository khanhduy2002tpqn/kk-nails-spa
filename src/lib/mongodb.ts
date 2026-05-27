import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, options);
const clientPromise = globalThis._mongoClientPromise || (globalThis._mongoClientPromise = client.connect());

export async function getMongoDb() {
  const client = await clientPromise;
  return client.db();
}
