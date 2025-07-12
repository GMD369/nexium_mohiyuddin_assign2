import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(MONGO_URI, {
    dbName: "nexium",
  });
}
