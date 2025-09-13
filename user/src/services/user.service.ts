import { NotFoundError } from "@msa/http-error";

import { db } from "@/libs/db";
import { CreateProfileDto } from "@/routes/user/user.dto";

export const userService = {
  createProfile: async (data: CreateProfileDto, userId: number) => {
    const { phone, address } = data;

    const dbProfile = await db.profile.create({
      data: { phone, address, userId },
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
};
