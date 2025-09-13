import { createPage } from "@msa/response-data";
import { NotFoundError, ForbiddenError } from "@msa/http-error";
import { createSearchCondition, QueryParams } from "@msa/request";

import { db } from "../libs/db";
import { CreateOrderDto } from "../routes/order/order.dto";

export const orderService = {
  createOrder: async (data: CreateOrderDto, userId: number) => {
    const { items } = data;

    const orderedItemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await db.order.create({
      data: {
        userId,
        totalPrice: orderedItemsPrice,
        items: { create: items },
      },
    });

    return order;
  },

  getOrders: async (queryParams: QueryParams, userId: number) => {
    const { pageNumber = 0, pageSize = 10, sortBy = "createdAt", direction = "desc", q } = queryParams;

    const whereConditions = {
      userId,
      ...createSearchCondition("status", q ?? ""),
    };

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where: whereConditions,
        skip: pageNumber * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: direction },
      }),
      db.order.count({ where: whereConditions }),
    ]);

    return createPage({ items: orders, total, pageNumber, pageSize });
  },

  getOrderById: async (id: number, userId: number) => {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) throw new NotFoundError();
    if (order.userId !== userId) throw new ForbiddenError();

    return order;
  },
};
