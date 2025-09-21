import { Router } from "express";
import { validateRequest } from "@msa/request";
import { requireAuth } from "@msa/authentication";

import { menuService } from "@/services/menu.service";

import { createMenuSchema, updateMenuSchema } from "./menu.dto";

const router = Router();

// 메뉴 CRUD
router.post("/", requireAuth(), validateRequest(createMenuSchema), async (req, res) => {
  const userId = req.user!.id;
  const menu = await menuService.createMenu(req.body, userId);
  res.created(menu);
});

router.get("/", async (req, res) => {
  const storeId = Number(req.query.storeId);
  const menus = await menuService.getMenusByStoreId(storeId);
  res.success(menus);
});

router.get("/:menuId", async (req, res) => {
  const menuId = Number(req.params.menuId);
  const menu = await menuService.getMenuById(menuId);
  res.success(menu);
});

router.put("/:menuId", requireAuth(), validateRequest(updateMenuSchema), async (req, res) => {
  const userId = req.user!.id;
  const menuId = Number(req.params.menuId);
  const menu = await menuService.updateMenu(menuId, req.body, userId);
  res.success(menu);
});

router.delete("/:menuId", requireAuth(), async (req, res) => {
  const userId = req.user!.id;
  const menuId = Number(req.params.menuId);
  await menuService.deleteMenu(menuId, userId);
  res.noContent();
});

export { router as menuRouter };
