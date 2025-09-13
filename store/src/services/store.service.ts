import { createPage } from "@msa/response-data";
import { NotFoundError, ForbiddenError } from "@msa/http-error";
import { QueryParams, createSearchCondition, createDateRangeCondition } from "@msa/request";

import { CreateStoreDto, UpdateStoreDto } from "@/routes/store/store.dto";
import { db } from "@/libs/db";
import { Store } from "@/generated/prisma";

export const storeService = {
  createStore: async (data: CreateStoreDto, userId: number) => {
    return db.store.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  getStores: async (queryParams: QueryParams) => {
    const { pageNumber = 0, pageSize = 10, sortBy = "createdAt", direction = "desc", q, dateFrom, dateTo } = queryParams;

    // 검색 조건 구성
    const whereConditions = {
      ...createSearchCondition("name", q ?? ""),
      ...createDateRangeCondition(dateFrom, dateTo),
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

  updateStore: async (id: number, data: UpdateStoreDto, userId: number) => {
    const store = await db.store.findFirst({
      where: {
        id,
      },
    });

    if (!store) throw new NotFoundError();
    if (store.userId !== userId) throw new ForbiddenError();

    return db.store.update({
      where: { id },
      data,
    });
  },

  deleteStore: async (id: number, userId: number) => {
    // 먼저 가게가 존재하고 해당 사용자가 소유자인지 확인
    const store = await db.store.findFirst({
      where: {
        id,
      },
    });

    if (!store) throw new NotFoundError();
    if (store.userId !== userId) throw new ForbiddenError();

    return db.store.delete({
      where: { id },
    });
  },
};
