import { z } from "zod";

export const PagedRequestSchema = z.object({
  pageNumber: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(10).max(100).default(10),
  sortBy: z.enum(["id", "createdAt", "updatedAt"]).default("id"),
  direction: z.enum(["asc", "desc"]).default("desc"),
});

export type PagedRequest = z.infer<typeof PagedRequestSchema>;
