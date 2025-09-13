import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || "4003",
  ROUTER_PREFIX: "/api",

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: 900,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_REFRESH_EXPIRES_IN: 7200,
  JWT_REFRESH_REGENERATE_THRESHOLD: 1800,
};
