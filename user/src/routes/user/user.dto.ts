import { z } from "zod";

import { Profile } from "@/generated/prisma";

export const CreateProfileSchema = z.object({
  phone: z.string().optional(),
});

export const UpdateProfileSchema = z.object({
  phone: z.string().optional(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;

export type ProfileResponse = Pick<Profile, "id" | "userId" | "phone" | "createdAt" | "updatedAt">;
