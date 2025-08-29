import { db } from "@/libs/db";

export const userService = {
  createProfile(userId: number) {
    return db.profile.create({ data: { userId, phone: null, address: null } });
  },
};
