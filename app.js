import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDB } from "./database/db.js";
import paymentRoutes from "./routes/payments.routes.js";
import { connectProducer } from './service/kafka/kafka.producer.js'
import client from "prom-client";
dotenv.config();

const app = express();
const register = new client.Registry();
client.collectDefaultMetrics({ 
    register 
});

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const port = process.env.PORT;
// Middleware to parse JSON requests
app.use(express.json());
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register]
});

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const duration = process.hrtime(start);
    const durationInSeconds =
      duration[0] + duration[1] / 1e9;

    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status_code: res.statusCode,
      },
      durationInSeconds
    );
  });

  next();
});


// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use("/payment", paymentRoutes);

const startServer = async () => {
  try {
    await connectToDB();
    console.log("Database connected successfully");

    // Try to connect to Kafka, but don't crash the server if it fails
    try {
      await connectProducer();
      console.log("Kafka producer started");
    } catch (kafkaError) {
      console.error("Kafka producer connection failed, server will continue without Kafka:", kafkaError.message);
    }

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

startServer();
