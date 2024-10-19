import { MongoClient } from "mongodb";
import "dotenv/config";

async function connectToCluster(uri) {
  let mongoClient;

  try {
    mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      socketTimeoutMS: 60000,
    });
    await mongoClient.connect();
    return mongoClient;
  } catch (error) {
    throw error;
  }
}

export async function updateTextGenerationCalls(email) {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("llm_offset");
    const collection = db.collection("users");

    await collection.updateOne(
      { email: email },
      { $inc: { text_count: 1, image_count: 0 } },
      { upsert: true },
    );
  } catch (error) {
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

export async function updateImageGenerationCalls(email) {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("llm_offset");
    const collection = db.collection("users");

    await collection.updateOne(
      { email: email },
      { $inc: { text_count: 0, image_count: 1 } },
      { upsert: true },
    );
  } catch (error) {
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

export async function getUserInfo(email) {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("llm_offset");
    const collection = db.collection("users");

    const result = await collection.findOne({ email: email });
    if (result) {
      return { text_count: result.text_count, image_count: result.image_count };
    } else {
      return { text_count: 0, image_count: 0 };
    }
  } catch (error) {
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

export async function getTextGenerationCalls(email) {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("llm_offset");
    const collection = db.collection("users");

    const result = await collection.findOne({ email: email });
    if (result) {
      return result.text_count;
    } else {
      return 0;
    }
  } catch (error) {
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

export async function getImageGenerationCalls(email) {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("llm_offset");
    const collection = db.collection("users");

    const result = await collection.findOne({ email: email });

    if (result) {
      return result.image_count;
    } else {
      return 0;
    }
  } catch (error) {
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}