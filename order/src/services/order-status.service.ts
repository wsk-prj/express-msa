import { OrderStatus } from "@/generated/prisma";
import { NotFoundError, ForbiddenError } from "@msa/http-error";
import { db } from "../libs/db";
import { eventBus } from "@msa/shared";

export const orderStatusService = {
  confirmOrder: async (orderId: number) => {
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CONFIRMED },
    });

    await eventBus.publish("order.status.changed", {
      orderId,
      newStatus: OrderStatus.CONFIRMED,
      previousStatus: OrderStatus.PENDING,
      reason: "주문 수락 요청",
    });

    return updatedOrder;
  },
  deliveringOrder: async (orderId: number) => {
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.DELIVERING },
    });

    await eventBus.publish("order.status.changed", {
      orderId,
      newStatus: OrderStatus.DELIVERING,
      previousStatus: OrderStatus.CONFIRMED,
      reason: "배송 시작 요청",
    });

    return updatedOrder;
  },

  deliveredOrder: async (orderId: number) => {
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.DELIVERED },
    });

    await eventBus.publish("order.status.changed", {
      orderId,
      newStatus: OrderStatus.DELIVERED,
      previousStatus: OrderStatus.DELIVERING,
      reason: "배송 완료 요청",
    });

    return updatedOrder;
  },

  completeOrder: async (orderId: number) => {
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.COMPLETED },
    });

    await eventBus.publish("order.status.changed", {
      orderId,
      newStatus: OrderStatus.COMPLETED,
      previousStatus: OrderStatus.DELIVERED,
      reason: "주문 완료 요청",
    });

    return updatedOrder;
  },

  cancelOrder: async (orderId: number, reason: string, userId: number) => {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });
    
    if (!order) throw new NotFoundError();
    if (order.userId !== userId) throw new ForbiddenError();

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });

    await eventBus.publish("order.status.changed", {
      orderId,
      newStatus: OrderStatus.CANCELLED,
      previousStatus: OrderStatus.PENDING,
      reason: `주문 취소 요청: ${reason}`,
    });

    return updatedOrder;
  },

  rejectOrder: async (orderId: number, reason: string) => {
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.REJECTED },
    });

    await eventBus.publish("order.status.changed", {
      orderId,
      newStatus: OrderStatus.REJECTED,
      previousStatus: OrderStatus.PENDING,
      reason: `주문 거부 요청: ${reason}`,
    });

    return updatedOrder;
  },
};
