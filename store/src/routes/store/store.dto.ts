import { z } from "zod";

// 가게 생성 DTO
export const createStoreSchema = z.object({
  name: z.string().min(1, "가게명은 필수입니다"),
  description: z.string().optional(),
  address: z.string().min(1, "주소는 필수입니다"),
  phone: z.string().optional(),
});

// 가게 수정 DTO
export const updateStoreSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  address: z.string().min(1).optional(),
  phone: z.string().optional(),
});

export type CreateStoreDto = z.infer<typeof createStoreSchema>;
export type UpdateStoreDto = z.infer<typeof updateStoreSchema>;
