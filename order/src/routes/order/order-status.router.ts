import { Router } from "express";
import { validateRequest } from "@msa/shared";
import { authMiddleware } from "@msa/authentication";

import { orderStatusService } from "../../services/order-status.service";
import { orderCancelSchema, orderRejectSchema, OrderResponse } from "./order.dto";

const router = Router();

router.post("/:orderId/confirm", async (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = await orderStatusService.confirmOrder(orderId);
  res.success<OrderResponse>(order);
});

router.post("/:orderId/delivering", async (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = await orderStatusService.deliveringOrder(orderId);
  res.success<OrderResponse>(order);
});

router.post("/:orderId/delivered", async (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = await orderStatusService.deliveredOrder(orderId);
  res.success<OrderResponse>(order);
});

router.post("/:orderId/complete", async (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = await orderStatusService.completeOrder(orderId);
  res.success<OrderResponse>(order);
});

router.post("/:orderId/cancel", authMiddleware(), validateRequest(orderCancelSchema), async (req, res) => {
  const orderId = Number(req.params.orderId);
  const userId = req.user!.id;
  const { reason } = req.body;
  const order = await orderStatusService.cancelOrder(orderId, reason, userId);
  res.success<OrderResponse>(order);
});

router.post("/:orderId/reject", validateRequest(orderRejectSchema), async (req, res) => {
  const orderId = Number(req.params.orderId);
  const { reason } = req.body;
  const order = await orderStatusService.rejectOrder(orderId, reason);
  res.success<OrderResponse>(order);
});

export { router as orderStatusRouter };
