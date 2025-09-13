import { Router } from "express";
import { validateRequest, validateQuery } from "@msa/request";
import { QueryParamsSchema } from "@msa/request";
import { authMiddleware } from "@msa/authentication";

import { storeService } from "@/services/store.service";

import { createStoreSchema, updateStoreSchema } from "./store.dto";

const router = Router();

// 가게 CRUD
router.post("/", authMiddleware(), validateRequest(createStoreSchema), async (req, res) => {
  const userId = req.user!.id;
  const store = await storeService.createStore(req.body, userId);
  res.created(store);
});

router.get("/", validateQuery(QueryParamsSchema), async (req, res) => {
  const queryParams = req.query as any;
  const page = await storeService.getStores(queryParams);
  res.success(page);
});

router.get("/:storeId", async (req, res) => {
  const storeId = Number(req.params.storeId);
  const store = await storeService.getStoreById(storeId);
  res.success(store);
});

router.put("/:storeId", authMiddleware(), validateRequest(updateStoreSchema), async (req, res) => {
  const userId = req.user!.id;
  const storeId = Number(req.params.storeId);
  const store = await storeService.updateStore(storeId, req.body, userId);
  res.success(store);
});

router.delete("/:storeId", authMiddleware(), async (req, res) => {
  const userId = req.user!.id;
  const storeId = Number(req.params.storeId);
  await storeService.deleteStore(storeId, userId);
  res.noContent();
});

export { router as storeRouter };
