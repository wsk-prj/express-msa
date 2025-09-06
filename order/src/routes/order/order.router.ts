import { Router } from "express";
import { validateRequest, validateQuery } from "@msa/shared";
import { QueryParamsSchema } from "@msa/request";

import { orderService } from "../../services/order.service";

import { createOrderSchema } from "./order.dto";

const router = Router();

router.post("/", validateRequest(createOrderSchema), async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.created(order);
});

router.get("/", validateQuery(QueryParamsSchema), async (req, res) => {
  const queryParams = req.query as any;
  const page = await orderService.getOrders(queryParams);
  res.success(page);
});

router.get("/:orderId", async (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = await orderService.getOrderById(orderId);
  res.success(order);
});

export { router as orderRouter };
