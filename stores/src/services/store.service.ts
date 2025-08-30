import { db } from "@/libs/db";

import { createPage } from "@msa/response-data";
import { NotFoundError } from "@msa/http-error";

import { CreateStoreDto, UpdateStoreDto } from "@/routes/store/store.dto";
import { PagedRequest } from "@msa/shared";
import { Store } from "@/generated/prisma";

export const storeService = {
  createStore: async (data: CreateStoreDto) => {
    return db.store.create({
      data,
    });
  },

  getStores: async (pagedRequest: PagedRequest) => {
    const { pageNumber = 0, pageSize = 10, sortBy = "createdAt", direction = "desc" } = pagedRequest;

    const [stores, total] = await Promise.all([
      db.store.findMany({
        skip: pageNumber * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: direction },
      }),
      db.store.count(),
    ]);

    return createPage<Store>({ items: stores, total, pageNumber, pageSize });
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
