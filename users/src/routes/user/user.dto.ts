import { Profile } from "@prisma/client";

import { z } from "zod";

export const CreateProfileSchema = z.object({
  phone: z.string(),
  address: z.string(),
  userId: z.number(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;

export type ProfileResponse = Pick<Profile, "id" | "userId" | "phone" | "address" | "createdAt" | "updatedAt">;
