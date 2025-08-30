import cors from "cors";
import express from "express";

import { config } from "@/config";
import { generalRateLimit, loginRateLimit, signupRateLimit } from "@/middlewares/rate-limit";
import { authProxy, userProxy, storeProxy } from "@/proxy/service-proxy";

const app = express();

// Express Configurations
app.use(cors());

// Rate Limit
app.use(generalRateLimit);
app.use("/api/auth/login", loginRateLimit);
app.use("/api/auth/signup", signupRateLimit);

// Service Routes
app.use("/api/auth", authProxy);
app.use("/api/users", userProxy);
app.use("/api/stores", storeProxy);
app.use("/api/menus", storeProxy);

// Health Check
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API Gateway is running",
    timestamp: new Date().toISOString(),
  });
});

// Startup
app.listen(config.PORT, () => {
  console.log(`🚀 API Gateway is running on port ${config.PORT}`);
});
