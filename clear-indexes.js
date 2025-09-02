// Run this script to clear duplicate indexes if needed
// node clear-indexes.js

const { MongoClient } = require('mongodb');

async function clearIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/freedom-running');
  
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('users');
    
    // Drop all indexes except _id
    await collection.dropIndexes();
    console.log('✅ Dropped all indexes');
    
    // Recreate the email index properly
    await collection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Created unique email index');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

clearIndexes();