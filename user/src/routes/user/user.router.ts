import { Router } from "express";
import asyncHandler from "express-async-handler";
import { db } from "@/libs/db";
import { NotFoundError } from "@/api/error/bad-request";
import { validateRequest } from "@/middlewares/dto.validator";
import { CreateProfileSchema } from "@/routes/user/user.schema";
import { ProfileResponse } from "@/routes/user/user.dto";

const router = Router();

// 프로필 생성
router.post(
  "/profile",
  validateRequest(CreateProfileSchema),
  asyncHandler(async (req, res, _next) => {
    const { phone, address, userId } = req.body;

    const dbProfile = await db.profile.create({
      data: { phone, address, userId: Number(userId) },
    });

    res.created<ProfileResponse>(dbProfile);
  })
);

// 프로필 조회
router.get(
  "/profile/:userId",
  asyncHandler(async (req, res, _next) => {
    const userId = req.params.userId;

    const dbProfile = await db.profile.findUnique({
      where: { userId: Number(userId) },
    });
    if (!dbProfile) throw new NotFoundError();

    res.success<ProfileResponse>(dbProfile);
  })
);

export { router as userRouter };
