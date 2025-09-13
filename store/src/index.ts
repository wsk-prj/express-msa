import "reflect-metadata";
import "express-async-errors";

import express from "express";
import cors from "cors";
import { setup as setupJwtUtil } from "@msa/authentication";
import { responseDataHandler, errorHandler } from "@msa/response-data";

import { config } from "@/config";
import { router } from "@/routes";

const app = express();

// Express Configurations
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Service Routes
app.use(responseDataHandler);
app.use(config.ROUTER_PREFIX, router);
app.use(errorHandler);
app.get("/health", (_req, res) => {
  res.success({
    success: true,
    message: "Store Service is running",
    timestamp: new Date().toISOString(),
  });
});

// Startup
app.listen(config.PORT, async () => {
  console.log(`   Store Service is running on port ${config.PORT}`);

  setupJwtUtil({
    JWT_SECRET: config.JWT_SECRET,
    JWT_EXPIRES_IN: config.JWT_EXPIRES_IN,
    JWT_REFRESH_SECRET: config.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: config.JWT_REFRESH_EXPIRES_IN,
    JWT_REFRESH_REGENERATE_THRESHOLD: config.JWT_REFRESH_REGENERATE_THRESHOLD,
  });
});
