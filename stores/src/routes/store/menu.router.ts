import { Router } from "express";
import { validateRequest } from "@msa/shared";
import { createMenuSchema, updateMenuSchema } from "./menu.dto";
import { menuService } from "@/services/menu.service";

const router = Router();

// 메뉴 CRUD
router.post("/:storeId/menus", validateRequest(createMenuSchema), async (req, res) => {
  const menu = await menuService.createMenu(req.body);
  res.created(menu);
});

router.get("/:storeId/menus", async (req, res) => {
  const menus = await menuService.getMenusByStoreId(Number(req.params.storeId));
  res.success(menus);
});

router.get("/:storeId/menus/:menuId", async (req, res) => {
  const menuId = Number(req.params.menuId);
  const menu = await menuService.getMenuById(menuId);
  res.success(menu);
});

router.put("/:storeId/menus/:menuId", validateRequest(updateMenuSchema), async (req, res) => {
  const menuId = Number(req.params.menuId);
  const menu = await menuService.updateMenu(menuId, req.body);
  res.success(menu);
});

router.delete("/:storeId/menus/:menuId", async (req, res) => {
  const menuId = Number(req.params.menuId);
  await menuService.deleteMenu(menuId);
  res.noContent();
});

export { router as menuRouter };
