import { Router } from "express";

import { router as authRouter } from "@/routes/auth/auth.router";

export const router = Router();

router.get("/", (_req, res) => {
  res.send("Hello World");
});

// Add routers here
router.use("/auth", authRouter);
