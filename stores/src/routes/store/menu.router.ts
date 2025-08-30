import { Router } from "express";
import asyncHandler from "express-async-handler";
import { validateRequest } from "@msa/shared";
import { createMenuSchema, updateMenuSchema } from "./menu.dto";
import { menuService } from "@/services/menu.service";

const router = Router();

// 메뉴 CRUD
router.post(
  "/",
  validateRequest(createMenuSchema),
  asyncHandler(async (req, res) => {
    const menu = await menuService.createMenu(req.body);
    res.created(menu);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const storeId = Number(req.query.storeId);
    const menus = await menuService.getMenusByStoreId(storeId);
    res.success(menus);
  })
);

router.get(
  "/:menuId",
  asyncHandler(async (req, res) => {
    const menuId = Number(req.params.menuId);
    const menu = await menuService.getMenuById(menuId);
    res.success(menu);
  })
);

router.put(
  "/:menuId",
  validateRequest(updateMenuSchema),
  asyncHandler(async (req, res) => {
    const menuId = Number(req.params.menuId);
    const menu = await menuService.updateMenu(menuId, req.body);
    res.success(menu);
  })
);

router.delete(
  "/:menuId",
  asyncHandler(async (req, res) => {
    const menuId = Number(req.params.menuId);
    await menuService.deleteMenu(menuId);
    res.noContent();
  })
);

export { router as menuRouter };
