import { z } from "zod";

import { Profile } from "@/generated/prisma";

export const CreateProfileSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;

export type ProfileResponse = Pick<Profile, "id" | "userId" | "phone" | "address" | "createdAt" | "updatedAt">;
