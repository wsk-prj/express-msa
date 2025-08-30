import { Router } from "express";
import asyncHandler from "express-async-handler";
import { validateRequest } from "@msa/shared";
import { createStoreSchema, updateStoreSchema } from "./store.dto";
import { storeService } from "@/services/store.service";

const router = Router();

// 가게 CRUD
router.post(
  "/",
  validateRequest(createStoreSchema),
  asyncHandler(async (req, res) => {
    const store = await storeService.createStore(req.body);
    res.created(store);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const stores = await storeService.getStores();
    res.success(stores);
  })
);

router.get(
  "/:storeId",
  asyncHandler(async (req, res) => {
    const storeId = Number(req.params.storeId);
    const store = await storeService.getStoreById(storeId);
    res.success(store);
  })
);

router.put(
  "/:storeId",
  validateRequest(updateStoreSchema),
  asyncHandler(async (req, res) => {
    const storeId = Number(req.params.storeId);
    const store = await storeService.updateStore(storeId, req.body);
    res.success(store);
  })
);

router.delete(
  "/:storeId",
  asyncHandler(async (req, res) => {
    const storeId = Number(req.params.storeId);
    await storeService.deleteStore(storeId);
    res.noContent();
  })
);

export { router as storeRouter };
