import { Router } from "express";
import { validateRequest, validateQuery } from "@msa/shared";
import { createStoreSchema, updateStoreSchema } from "./store.dto";
import { PagedRequestSchema } from "@msa/shared";
import { storeService } from "@/services/store.service";

const router = Router();

// 가게 CRUD
router.post("/", validateRequest(createStoreSchema), async (req, res) => {
  const store = await storeService.createStore(req.body);
  res.created(store);
});

router.get("/", validateQuery(PagedRequestSchema), async (req, res) => {
  const pagedRequest = req.query;
  const page = await storeService.getStores(pagedRequest);
  res.success(page);
});

router.get("/:storeId", async (req, res) => {
  const storeId = Number(req.params.storeId);
  const store = await storeService.getStoreById(storeId);
  res.success(store);
});

router.put("/:storeId", validateRequest(updateStoreSchema), async (req, res) => {
  const storeId = Number(req.params.storeId);
  const store = await storeService.updateStore(storeId, req.body);
  res.success(store);
});

router.delete("/:storeId", async (req, res) => {
  const storeId = Number(req.params.storeId);
  await storeService.deleteStore(storeId);
  res.noContent();
});

export { router as storeRouter };
