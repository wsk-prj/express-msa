import { z } from "zod";

export const CreateProfileSchema = z.object({
  phone: z.string(),
  address: z.string(),
  userId: z.number(),
});