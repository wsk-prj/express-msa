import { Profile } from "@prisma/client";

export type ProfileResponse = Pick<Profile, "id" | "userId" | "phone" | "address" | "createdAt" | "updatedAt">;
