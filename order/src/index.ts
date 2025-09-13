import "reflect-metadata";
import "express-async-errors";

import cors from "cors";
import express from "express";
import { setup as setupJwtUtil } from "@msa/authentication";
import { responseDataHandler, errorHandler } from "@msa/response-data";

import { config } from "@/config";
import { router } from "@/routes";
import { setupOrderStatusListener } from "@/services/order-status.listener";

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
    message: "Order Service is running",
    timestamp: new Date().toISOString(),
  });
});

// Startup
app.listen(config.PORT, async () => {
  console.log(`   Order Service is running on port ${config.PORT}`);
  
  setupJwtUtil({
    JWT_SECRET: config.JWT_SECRET,
    JWT_EXPIRES_IN: config.JWT_EXPIRES_IN,
    JWT_REFRESH_SECRET: config.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: config.JWT_REFRESH_EXPIRES_IN,
    JWT_REFRESH_REGENERATE_THRESHOLD: config.JWT_REFRESH_REGENERATE_THRESHOLD,
  }); 

  // 이벤트 리스너 초기화
  setupOrderStatusListener();
});
