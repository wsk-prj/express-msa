import { NotFoundError, ForbiddenError } from "@msa/http-error";

import { db } from "@/libs/db";
import { CreateMenuDto, UpdateMenuDto } from "@/routes/store/menu.dto";

export const menuService = {
  createMenu: async (data: CreateMenuDto, userId: number) => {
    const store = await db.store.findUnique({
      where: { id: data.storeId },
    });
    
    if (!store) throw new NotFoundError();
    if (store.userId !== userId) throw new ForbiddenError();

    return db.menu.create({
      data,
    });
  },

  getMenusByStoreId: async (storeId: number) => {
    return db.menu.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  },

  getMenuById: async (id: number) => {
    const menu = await db.menu.findUnique({
      where: { id },
    });
    if (!menu) throw new NotFoundError();

    return menu;
  },

  updateMenu: async (id: number, data: UpdateMenuDto, userId: number) => {
    // 메뉴가 존재하는지 확인하고, 해당 메뉴의 가게 소유자인지 확인
    const menu = await db.menu.findUnique({
      where: { id },
      include: { store: true },
    });
    
    if (!menu) throw new NotFoundError();
    if (menu.store.userId !== userId) throw new ForbiddenError();

    return db.menu.update({
      where: { id },
      data,
    });
  },

  deleteMenu: async (id: number, userId: number) => {
    // 메뉴가 존재하는지 확인하고, 해당 메뉴의 가게 소유자인지 확인
    const menu = await db.menu.findUnique({
      where: { id },
      include: { store: true },
    });
    
    if (!menu) throw new NotFoundError();
    if (menu.store.userId !== userId) throw new ForbiddenError();

    return db.menu.delete({
      where: { id },
    });
  },
};
