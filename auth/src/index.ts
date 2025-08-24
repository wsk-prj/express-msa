import "reflect-metadata";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { config } from "@/config";
import { errorHandler } from "@/middlewares/error.handler";
import { responseHandler } from "@/middlewares/response.handler";
import { router } from "@/routes/index";

const app = express();

// Express Configurations
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middlewares
app.use(responseHandler); // Response Handler
app.use(config.ROUTER_PREFIX, router); // Routes
app.use(errorHandler); // Error Handler

// Startup action
app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${config.PORT}`);
});
