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

export async function insertNewUser(email, tag){
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("llm_offset");
    const collection = db.collection("users");

    await collection.insertOne({ email: email, tag: tag, text_count: 0, image_count: 0, amount_offset: 0.0, date: Date.now() });
  } catch (error) {
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
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
      { $inc: { text_count: 1} },
      { upsert: false },
    );
  } catch (error) {
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

export async function updateAmountOffset(email, amount) {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("llm_offset");
    const collection = db.collection("users");

    await collection.updateOne(
      { email: email },
      { $inc: { amount_offset: amount } },
      { upsert: true }
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
      { $inc: { image_count: 1 } },
      { upsert: false },
    );
  } catch (error) {
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

export async function checkIfUserExists(email) {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("llm_offset");
    const collection = db.collection("users");

    const result = await collection.findOne({ email: email });
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

export async function checkIfTagExists(tag) {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("llm_offset");
    const collection = db.collection("users");

    const result = await collection.findOne({ tag: tag });
    if (result) {
      return true;
    } else {
      return false;
    }
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
      return { text_count: result.text_count, image_count: result.image_count, amount_offset: result.amount_offset };
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

export async function verifyTagOffset(tag) {
  const uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("llm_offset");
    const collection = db.collection("users");

    const result = await collection.findOne({ tag: tag });

    if (result) {
      return hasThirtyDaysPassed(result.date);
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

function hasThirtyDaysPassed(timestamp) {
  let currentTime = Date.now();
  const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;
  return (currentTime - timestamp) <= thirtyDaysInMillis;
}