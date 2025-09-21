import { NotFoundError } from "@msa/http-error";

import { db } from "@/libs/db";
import { CreateProfileDto, UpdateProfileDto } from "@/routes/user/user.dto";

export const userService = {
  createProfile: async (data: CreateProfileDto, userId: number) => {
    const { phone } = data;

    const dbProfile = await db.profile.create({
      data: { phone, userId },
    });

    return dbProfile;
  },

  getProfileById: async (userId: number) => {
    const dbProfile = await db.profile.findUnique({
      where: { userId: Number(userId) },
    });
    if (!dbProfile) throw new NotFoundError();

    return dbProfile;
  },

  updateProfile: async (data: UpdateProfileDto, userId: number) => {
    const dbProfile = await db.profile.findUnique({
      where: { userId: Number(userId) },
    });
    if (!dbProfile) throw new NotFoundError();

    const updatedProfile = await db.profile.update({
      where: { userId: Number(userId) },
      data,
    });

    return updatedProfile;
  },
};
