import { db } from "@/libs/db";
import { CreateStoreDto, UpdateStoreDto } from "@/routes/store/store.dto";
import { NotFoundError } from "@msa/http-error";

export const storeService = {
  createStore: async (data: CreateStoreDto) => {
    return db.store.create({
      data,
    });
  },

  getStores: async () => {
    return db.store.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  getStoreById: async (id: number) => {
    const store = await db.store.findUnique({
      where: { id },
    });
    if (!store) throw new NotFoundError();

    return store;
  },

  updateStore: async (id: number, data: UpdateStoreDto) => {
    return db.store.update({
      where: { id },
      data,
    });
  },

  deleteStore: async (id: number) => {
    return db.store.delete({
      where: { id },
    });
  },
};
