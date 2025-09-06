import { OrderStatus } from "@/generated/prisma";
import { db } from "../libs/db";

export const orderStatusService = {
  confirmOrder: async (orderId: number) => {
    db.$transaction(async (tx) => {
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
  },
  deliveringOrder: async (orderId: number) => {
    db.$transaction(async (tx) => {
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
  },
  deliveredOrder: async (orderId: number) => {
    db.$transaction(async (tx) => {
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
  },
  completeOrder: async (orderId: number) => {
    db.$transaction(async (tx) => {
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
  },
  cancelOrder: async (orderId: number, reason: string) => {
    db.$transaction(async (tx) => {
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
  },
  rejectOrder: async (orderId: number, reason: string) => {
    db.$transaction(async (tx) => {
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
  },
};
