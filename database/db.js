import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ensure we always load the correct env file regardless of current working directory
dotenv.config();
const MONGODB_URI = process.env.MONGO_URI;
export const connectToDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to DB");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // exit if DB connection fails
  }
};