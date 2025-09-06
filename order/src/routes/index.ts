import { Router } from "express";

import { orderRouter } from "@/routes/order/order.router";
import { orderStatusRouter } from "@/routes/order/order-status.router";

const router = Router();

router.use("/orders", orderRouter);
router.use("/orders", orderStatusRouter);

export { router };
