import { Router } from "express";
import { validateRequest } from "@msa/request";
import { authMiddleware, requireOwnership } from "@msa/authentication";

import { CreateProfileSchema, UpdateProfileSchema, ProfileResponse } from "@/routes/user/user.dto";
import { userService } from "@/services/user.service";

const router = Router();

// 프로필 생성
router.post("/:userId/profile", authMiddleware(), requireOwnership(), validateRequest(CreateProfileSchema), async (req, res, _next) => {
  const userId = Number(req.params.userId);
  const dbProfile = await userService.createProfile(req.body, userId);
  res.created<ProfileResponse>(dbProfile);
});

// 프로필 조회
router.get("/:userId/profile", authMiddleware(), requireOwnership(), async (req, res, _next) => {
  const userId = Number(req.params.userId);
  const dbProfile = await userService.getProfileById(userId);
  res.success<ProfileResponse>(dbProfile);
});

// 프로필 수정
router.put("/:userId/profile", authMiddleware(), requireOwnership(), validateRequest(UpdateProfileSchema), async (req, res, _next) => {
  const userId = Number(req.params.userId);
  const dbProfile = await userService.updateProfile(req.body, userId);
  res.success<ProfileResponse>(dbProfile);
});

export { router as userRouter };
