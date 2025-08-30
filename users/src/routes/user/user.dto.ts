import { Profile } from "@/generated/prisma";

import { z } from "zod";

export const CreateProfileSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  userId: z.number(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;

export type ProfileResponse = Pick<Profile, "id" | "userId" | "phone" | "address" | "createdAt" | "updatedAt">;
