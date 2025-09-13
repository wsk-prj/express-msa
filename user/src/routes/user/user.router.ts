import { Router } from "express";
import { validateRequest } from "@msa/request";
import { authMiddleware } from "@msa/authentication";

import { CreateProfileSchema, ProfileResponse } from "@/routes/user/user.dto";
import { userService } from "@/services/user.service";

const router = Router();

// 프로필 생성
router.post("/profile", authMiddleware(), validateRequest(CreateProfileSchema), async (req, res, _next) => {
  const dbProfile = await userService.createProfile(req.body, req.user!.id);

  res.created<ProfileResponse>(dbProfile);
});

// 프로필 조회
router.get("/profile/me", authMiddleware(), async (req, res, _next) => {
  const dbProfile = await userService.getProfileById(req.user!.id);

  res.success<ProfileResponse>(dbProfile);
});

export { router as userRouter };
