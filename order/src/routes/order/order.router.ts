import { Router } from "express";
import { validateRequest, validateQuery } from "@msa/request";
import { QueryParamsSchema } from "@msa/request";
import { requireAuth } from "@msa/authentication";

import { orderService } from "../../services/order.service";

import { createOrderSchema, OrderResponse } from "./order.dto";
import { Page } from "@msa/response-data";

const router = Router();

router.post("/", requireAuth(), validateRequest(createOrderSchema), async (req, res) => {
  const userId = req.user!.id;
  const order = await orderService.createOrder(req.body, userId);
  res.created<OrderResponse>(order);
});

router.get("/", requireAuth(), validateQuery(QueryParamsSchema), async (req, res) => {
  const userId = req.user!.id;
  const queryParams = req.query as any;
  const page = await orderService.getOrders(queryParams, userId);
  res.success<Page<OrderResponse>>(page);
});

router.get("/:orderId", requireAuth(), async (req, res) => {
  const userId = req.user!.id;
  const orderId = Number(req.params.orderId);
  const order = await orderService.getOrderById(orderId, userId);
  res.success<OrderResponse>(order);
});

export { router as orderRouter };
