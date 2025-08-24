import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: 4000,
  ROUTER_PREFIX: "/api",

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH as string,
  JWT_ACCESS_EXPIRES_IN: "10m",
  JWT_REFRESH_EXPIRES_IN: "1h",

  // Cookie Configuration
  REFRESH_TOKEN_COOKIE_NAME: "refreshToken",
  COOKIE_OPTIONS: {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict" as const,
  },
};
