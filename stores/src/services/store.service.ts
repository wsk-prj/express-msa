import { db } from "@/libs/db";

import { createPage } from "@msa/response-data";
import { NotFoundError } from "@msa/http-error";

import { CreateStoreDto, UpdateStoreDto } from "@/routes/store/store.dto";
import { QueryParams, createSearchCondition } from "@msa/request";
import { Store } from "@/generated/prisma";

export const storeService = {
  createStore: async (data: CreateStoreDto) => {
    return db.store.create({
      data,
    });
  },

  getStores: async (queryParams: QueryParams) => {
    const { pageNumber = 0, pageSize = 10, sortBy = "createdAt", direction = "desc", q } = queryParams;

    // 검색 조건 구성
    const whereConditions = {
      ...(q ? createSearchCondition("name", q) : {})
    };

    const [stores, total] = await Promise.all([
      db.store.findMany({
        where: whereConditions,
        skip: pageNumber * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: direction },
      }),
      db.store.count({ where: whereConditions }),
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
