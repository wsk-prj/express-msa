import "reflect-metadata";
import cors from "cors";
import express from "express";

import { config } from "@/config";
import { responseDataHandler, errorHandler } from "@msa/response-data";
import { router } from "@/routes";
import { setupEventSubscriptions } from "@/services/user.event-sub";

const app = express();

// Express Configurations
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Response Handler
app.use(responseDataHandler);

// Health Check
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "User Service is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", router);

// Error Handler
app.use(errorHandler);

// Startup
app.listen(config.PORT, async () => {
  console.log(`🚀 User Service is running on port ${config.PORT}`);
  console.log(`📊 Health check: http://localhost:${config.PORT}/health`);
  console.log(`👤 User API: http://localhost:${config.PORT}/api/user/*`);

  await setupEventSubscriptions();
});
