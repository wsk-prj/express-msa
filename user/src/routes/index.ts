import { Router } from "express";

import { userRouter } from "./user/user.router";
import { addressRouter } from "./user-address/address.router";

const router = Router();

router.use("/users", userRouter);
router.use("/users", addressRouter);

export { router };
