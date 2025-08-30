import { db } from "@/libs/db";
import { CreateMenuDto, UpdateMenuDto } from "@/routes/store/menu.dto";
import { NotFoundError } from "@msa/http-error";

export const menuService = {
  createMenu: async (data: CreateMenuDto) => {
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

  updateMenu: async (id: number, data: UpdateMenuDto) => {
    return db.menu.update({
      where: { id },
      data,
    });
  },

  deleteMenu: async (id: number) => {
    return db.menu.delete({
      where: { id },
    });
  },
};
