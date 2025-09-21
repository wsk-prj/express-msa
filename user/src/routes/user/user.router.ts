import { Router } from "express";
import { validateRequest } from "@msa/request";
import { authMiddleware } from "@msa/authentication";

import { CreateProfileSchema, UpdateProfileSchema, ProfileResponse } from "@/routes/user/user.dto";
import { userService } from "@/services/user.service";
import { ForbiddenError } from "@msa/http-error";

const router = Router();

// 프로필 조회
router.get("/:userId/profile", authMiddleware(), async (req, res, _next) => {
  const userId = Number(req.params.userId);
  if (userId !== req.user!.id) throw new ForbiddenError();

  const dbProfile = await userService.getProfileById(userId);
  res.success<ProfileResponse>(dbProfile);
});

// 프로필 수정
router.put("/:userId/profile", authMiddleware(), validateRequest(UpdateProfileSchema), async (req, res, _next) => {
  const userId = Number(req.params.userId);
  if (userId !== req.user!.id) throw new ForbiddenError();

  const dbProfile = await userService.updateProfile(req.body, userId);
  res.success<ProfileResponse>(dbProfile);
});

export { router as userRouter };
