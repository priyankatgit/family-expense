import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

let client;

export async function connectToDatabase() {
  // set the connection options
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxIdleTimeMS: 10000,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
  };

  // check the MongoDB URI
  if (!MONGODB_URI) {
    throw new Error("Define the MONGODB_URI environmental variable");
  }
  // check the MongoDB DB
  if (!MONGODB_DB) {
    throw new Error("Define the MONGODB_DB environmental variable");
  }
  
  // Connect to cluster
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClient) {
      console.log("Dev server new connection ====>>>");

      client = new MongoClient(MONGODB_URI, options);
      global._mongoClient = await client.connect();
    }

    console.log("Dev server Cached connection retrieved ====>>>");
    client = global._mongoClient;
  } else {
    console.log("Live server new connection ====>>>");
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(MONGODB_URI, options);
    await client.connect();
  }

  let db = client.db(MONGODB_DB);

  return {
    client,
    db,
  };
}