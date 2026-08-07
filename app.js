import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDB } from "./database/db.js";
import paymentRoutes from "./routes/payments.routes.js";
// import { connectProducer } from './service/kafka/kafka.producer.js'
dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const port = process.env.PORT;
// Middleware to parse JSON requests
app.use(express.json());

app.use("/payment", paymentRoutes);

const startServer = async () => {
  try {
    await connectToDB();
    console.log("Database connected successfully");

    // Try to connect to Kafka, but don't crash the server if it fails
    // try {
    //   await connectProducer();
    //   console.log("Kafka producer started");
    // } catch (kafkaError) {
    //   console.error("Kafka producer connection failed, server will continue without Kafka:", kafkaError.message);
    // }

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

startServer();
