import { OrderStatus } from "@/generated/prisma";
import { db } from "../libs/db";
import { eventBus } from "@msa/shared";

interface OrderStatusChangedEvent {
  orderId: number;
  newStatus: OrderStatus;
  previousStatus: OrderStatus;
  reason?: string;
}

export const setupOrderStatusListener = () => {
  eventBus.subscribe("order.status.changed", async (data: OrderStatusChangedEvent) => {
    const { orderId, newStatus, previousStatus, reason } = data;

    try {
      console.log(`[OrderStatusListener] Processing status change for order ${orderId}: ${previousStatus} -> ${newStatus}`);

      await db.orderStatusChange.create({
        data: {
          orderId,
          status: newStatus,
          previousStatus,
          reason,
        },
      });

      console.log(`[OrderStatusListener] Status change history created for order ${data.orderId}`);
    } catch (error) {
      console.error(`[OrderStatusListener] Failed to create status change history for order ${data.orderId}:`, error);
    }
  });

  console.log("[OrderStatusListener] Order status change listener setup completed");
};
