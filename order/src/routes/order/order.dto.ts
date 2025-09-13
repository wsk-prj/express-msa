import { z } from "zod";
import { Order } from "@/generated/prisma";

export const createOrderItemSchema = z.object({
  menuId: z.number().int().positive(),
  menuName: z.string().min(1),
  price: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1),
});

export const orderCancelSchema = z.object({
  reason: z.string().min(1),
});

export const orderRejectSchema = z.object({
  reason: z.string().min(1),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type OrderCancelDto = z.infer<typeof orderCancelSchema>;
export type OrderRejectDto = z.infer<typeof orderRejectSchema>;

export type OrderResponse = Pick<Order, "id" | "status" | "totalPrice" | "createdAt">;