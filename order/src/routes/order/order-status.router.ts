import { Router } from "express";
import { validateRequest } from "@msa/shared";

import { orderStatusService } from "../../services/order-status.service";
import { orderCancelSchema, orderRejectSchema } from "./order.dto";

const router = Router();

router.post("/:orderId/confirm", async (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = await orderStatusService.confirmOrder(orderId);
  res.success(order);
});

router.post("/:orderId/delivering", async (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = await orderStatusService.deliveringOrder(orderId);
  res.success(order);
});

router.post("/:orderId/delivered", async (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = await orderStatusService.deliveredOrder(orderId);
  res.success(order);
});

router.post("/:orderId/complete", async (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = await orderStatusService.completeOrder(orderId);
  res.success(order);
});

router.post("/:orderId/cancel", validateRequest(orderCancelSchema), async (req, res) => {
  const orderId = Number(req.params.orderId);
  const { reason } = req.body;
  const order = await orderStatusService.cancelOrder(orderId, reason);
  res.success(order);
});

router.post("/:orderId/reject", validateRequest(orderRejectSchema), async (req, res) => {
  const orderId = Number(req.params.orderId);
  const { reason } = req.body;
  const order = await orderStatusService.rejectOrder(orderId, reason);
  res.success(order);
});

export { router as orderStatusRouter };
