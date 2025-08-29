import { Router } from "express";
import asyncHandler from "express-async-handler";

import { validateRequest } from "@msa/shared";
import { CreateProfileSchema } from "@/routes/user/user.dto";
import { ProfileResponse } from "@/routes/user/user.dto";
import { userService } from "@/services/user.service";

const router = Router();

// 프로필 생성
router.post(
  "/profile",
  validateRequest(CreateProfileSchema),
  asyncHandler(async (req, res, _next) => {
    const dbProfile = await userService.createProfile(req.body);

    res.created<ProfileResponse>(dbProfile);
  })
);

// 프로필 조회
router.get(
  "/profile/:userId",
  asyncHandler(async (req, res, _next) => {
    const dbProfile = await userService.getProfileById(Number(req.params.userId));

    res.success<ProfileResponse>(dbProfile);
  })
);

export { router as userRouter };
