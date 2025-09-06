import { OrderStatus } from "@/generated/prisma";
import { db } from "../libs/db";

export const orderStatusService = {
  confirmOrder: async (orderId: number) => {
    const order = await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CONFIRMED },
      });
      await tx.orderStatusChange.create({
        data: {
          orderId,
          status: OrderStatus.CONFIRMED,
          previousStatus: OrderStatus.PENDING,
        },
      });
    });
    return order;
  },
  deliveringOrder: async (orderId: number) => {
    const order = await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.DELIVERING },
      });
      await tx.orderStatusChange.create({
        data: {
          orderId,
          status: OrderStatus.DELIVERING,
          previousStatus: OrderStatus.CONFIRMED,
        },
      });
    });
    return order;
  },
  deliveredOrder: async (orderId: number) => {
    const order = await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.DELIVERED },
      });
      await tx.orderStatusChange.create({
        data: {
          orderId,
          status: OrderStatus.DELIVERED,
          previousStatus: OrderStatus.DELIVERING,
        },
      });
    });
    return order;
  },
  completeOrder: async (orderId: number) => {
    const order = await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.COMPLETED },
      });
      await tx.orderStatusChange.create({
        data: {
          orderId,
          status: OrderStatus.COMPLETED,
          previousStatus: OrderStatus.DELIVERED,
        },
      });
    });
    return order;
  },
  cancelOrder: async (orderId: number, reason: string) => {
    const order = await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
      await tx.orderStatusChange.create({
        data: {
          orderId,
          status: OrderStatus.CANCELLED,
          previousStatus: OrderStatus.DELIVERED,
          reason,
        },
      });
    });
    return order;
  },
  rejectOrder: async (orderId: number, reason: string) => {
    const order = await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.REJECTED },
      });
      await tx.orderStatusChange.create({
        data: {
          orderId,
          status: OrderStatus.REJECTED,
          previousStatus: OrderStatus.DELIVERED,
          reason,
        },
      });
    });
    return order;
  },
};
