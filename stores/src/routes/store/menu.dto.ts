import { z } from "zod";

// 메뉴 생성 DTO
export const createMenuSchema = z.object({
  storeId: z.number().int().positive(),
  name: z.string().min(1, "메뉴명은 필수입니다"),
  description: z.string().optional(),
  price: z.number().int().positive("가격은 양수여야 합니다"),
});

// 메뉴 수정 DTO
export const updateMenuSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().int().positive().optional(),
  isAvailable: z.boolean().optional(),
});

export type CreateMenuDto = z.infer<typeof createMenuSchema>;
export type UpdateMenuDto = z.infer<typeof updateMenuSchema>;
