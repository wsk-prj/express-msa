import "reflect-metadata";
import "express-async-errors";

import cors from "cors";
import express from "express";

import { config } from "@/config";
import { responseDataHandler, errorHandler } from "@msa/response-data";
import { router } from "@/routes";
import { setupEventSubscriptions } from "@/services/user.event-sub";

const app = express();

// Express Configurations
app.use(cors(
  {
    origin: true,
    credentials: true,
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Service Routes
app.use(responseDataHandler);
app.use(config.ROUTER_PREFIX, router);
app.use(errorHandler);
app.get("/health", (_req, res) => {
  res.success({
    success: true,
    message: "User Service is running",
    timestamp: new Date().toISOString(),
  });
});

// Startup
app.listen(config.PORT, async () => {
  console.log(`   User Service is running on port ${config.PORT}`);

  await setupEventSubscriptions();
});
