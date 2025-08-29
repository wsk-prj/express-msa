import { db } from "@/libs/db";
import { CreateStoreDto, UpdateStoreDto } from "@/routes/store/store.dto";
import { NotFoundError } from "@msa/http-error";

export const storeService = {
  // 가게 CRUD
  async createStore(data: CreateStoreDto) {
    return db.store.create({
      data,
    });
  },

  async getStores() {
    return db.store.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async getStoreById(id: number) {
    const store = await db.store.findUnique({
      where: { id },
    });
    if (!store) throw new NotFoundError();

    return store;
  },

  async updateStore(id: number, data: UpdateStoreDto) {
    return db.store.update({
      where: { id },
      data,
    });
  },

  async deleteStore(id: number) {
    return db.store.delete({
      where: { id },
    });
  },
};
