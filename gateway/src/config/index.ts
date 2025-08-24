import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: 4000,
  SERVICES: {
    AUTH: "http://127.0.0.1:4001",
  },
};
