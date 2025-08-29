import { db } from "@/libs/db";
import { CreateProfileDto } from "@/routes/user/user.dto";
import { NotFoundError } from "@msa/http-error";

export const userService = {
  createProfile: async (data: CreateProfileDto) => {
    const { phone, address, userId } = data;

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
