import cors from "cors";
import express from "express";

import { config } from "@/config";
import { generalRateLimit, loginRateLimit, signupRateLimit } from "@/middlewares/rate-limit";
import { authProxy } from "@/proxy/service-proxy";

const app = express();

// Express Configurations
app.use(cors());

// Health Check
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API Gateway is running",
    timestamp: new Date().toISOString(),
  });
});

// Service Routes with Rate Limiting
app.use(generalRateLimit);
app.use("/api/auth/login", loginRateLimit);
app.use("/api/auth/signup", signupRateLimit);
app.use("/api/auth", authProxy);

// Startup
app.listen(config.PORT, () => {
  console.log(`🚀 API Gateway is running on port ${config.PORT}`);
  console.log(`📊 Health check: http://localhost:${config.PORT}/health`);
  console.log(`🔐 Auth Service: http://localhost:${config.PORT}/api/auth/*`);
});
