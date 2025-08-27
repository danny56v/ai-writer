// lib/db.ts
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error('Invalid/Missing env var: "MONGODB_URI"');

const options = {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  // opțional: pool tuning
  // maxPoolSize: 10,
};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & { _mongoClient?: MongoClient };
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri, options);
}

// Conectare lazy, reutilizată
export const clientPromise = client.connect();

export async function getDb(dbName = process.env.MONGODB_DB) {
  if (!dbName) throw new Error('Missing env var: "MONGODB_DB"');
  const conn = await clientPromise;
  return conn.db(dbName);
}

export async function db() {
  return getDb(process.env.MONGODB_DB);
}

export default client;
