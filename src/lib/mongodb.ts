import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {};

const client = new MongoClient(uri, options);
const dbName = 'blogs';
let isConnected = false;

export async function saveBlogData({
  url,
  fullText,
  originalSummary,
  translatedSummary
}: {
  url: string;
  fullText: string;
  originalSummary: string;
  translatedSummary: string;
}) {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }

  const db = client.db(dbName);
  const collection = db.collection('fulltexts');

  await collection.insertOne({
    url,
    fullText,
    originalSummary,
    translatedSummary,
    createdAt: new Date()
  });
}



