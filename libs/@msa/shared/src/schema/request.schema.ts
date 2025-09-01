import { z } from "zod";

export const PagedParamsSchema = z.object({
  pageNumber: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(10).max(100).default(10),
  sortBy: z.enum(["id", "createdAt", "updatedAt"]).default("id"),
  direction: z.enum(["asc", "desc"]).default("desc"),
});

export const SearchParamsSchema = z.object({
  q: z.string().optional(),
  fields: z.array(z.string()).optional(),
  filters: z.record(z.any()).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const QueryParamsSchema = PagedParamsSchema.merge(SearchParamsSchema);

export type PagedParams = z.infer<typeof PagedParamsSchema>;
export type SearchParams = z.infer<typeof SearchParamsSchema>;
export type QueryParams = z.infer<typeof QueryParamsSchema>;
