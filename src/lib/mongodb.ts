import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
if (!uri) {
  // Do not throw at import time; runtime code should guard usage in dev
  // eslint-disable-next-line no-console
  console.warn("MONGODB_URI is not set. Auth features will fail until provided.");
}

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

export function getMongoClient(): Promise<MongoClient> {
  if (!clientPromise) {
    client = new MongoClient(uri, { maxPoolSize: 10 });
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function getDb(dbName = process.env.MONGODB_DB || "mobile_store") {
  const conn = await getMongoClient();
  return conn.db(dbName);
}


