import { MongoClient, ServerApiVersion } from "mongodb"


const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local or Vercel environment variables")
}


console.log(`MongoDB URI starts with: ${uri.substring(0, 20)}...`)

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
 
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}


export default clientPromise

