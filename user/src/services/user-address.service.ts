import { NotFoundError, ForbiddenError, ConflictError } from "@msa/http-error";
import { createPage, Page } from "@msa/response-data";

import { db } from "@/libs/db";
import { CreateAddressDto, UpdateAddressDto, AddressResponse, AddressListResponse } from "@/routes/user-address/address.dto";

export const userAddressService = {
  /**
   * 주소 생성
   */
  createAddress: async (data: CreateAddressDto, userId: number): Promise<AddressResponse> => {
    // 기본 배송지로 설정하는 경우 트랜잭션 사용
    if (data.isDefault) {
      return await db.$transaction(async (tx) => {
        // 기존 기본 배송지 해제
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });

        // 새로운 주소 생성
        const address = await tx.address.create({
          data: {
            ...data,
            userId,
          },
        });

        return address;
      });
    }

    // 기본 배송지가 아닌 경우 일반 생성
    const address = await db.address.create({
      data: {
        ...data,
        userId,
      },
    });

    return address;
  },

  /**
   * 사용자의 모든 주소 조회
   */
  getAddresses: async (userId: number, pageNumber: number = 0, pageSize: number = 10): Promise<AddressListResponse> => {
    const [addresses, total] = await Promise.all([
      db.address.findMany({
        where: { userId },
        orderBy: [
          { isDefault: "desc" }, // 최상단에 기본 배송지
          { createdAt: "desc" },
        ],
        skip: pageNumber * pageSize,
        take: pageSize,
      }),
      db.address.count({
        where: { userId },
      }),
    ]);

    return createPage({
      items: addresses,
      total,
      pageNumber,
      pageSize,
    });
  },

  /**
   * 특정 주소 조회
   */
  getAddressById: async (addressId: number, userId: number): Promise<AddressResponse> => {
    const address = await db.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundError("주소를 찾을 수 없습니다");
    }

    return address;
  },

  /**
   * 주소 수정
   */
  updateAddress: async (data: UpdateAddressDto, addressId: number, userId: number): Promise<AddressResponse> => {
    // 주소 존재 여부 및 소유자 확인
    const existingAddress = await db.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new NotFoundError("주소를 찾을 수 없습니다");
    }

    // 기본 배송지로 설정하는 경우 트랜잭션 사용
    if (data.isDefault) {
      return await db.$transaction(async (tx) => {
        // 기존 기본 배송지 해제 (현재 주소 제외)
        await tx.address.updateMany({
          where: { userId, isDefault: true, id: { not: addressId } },
          data: { isDefault: false },
        });

        // 주소 수정
        const updatedAddress = await tx.address.update({
          where: { id: addressId },
          data,
        });

        return updatedAddress;
      });
    }

    // 기본 배송지 설정이 아닌 경우 일반 수정
    const updatedAddress = await db.address.update({
      where: { id: addressId },
      data,
    });

    return updatedAddress;
  },

  /**
   * 주소 삭제
   */
  deleteAddress: async (addressId: number, userId: number): Promise<void> => {
    const address = await db.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundError("주소를 찾을 수 없습니다");
    }

    // 기본 배송지인 경우 삭제 불가
    if (address.isDefault) {
      throw new ConflictError("기본 배송지는 삭제할 수 없습니다");
    }

    await db.address.delete({
      where: { id: addressId },
    });
  },

  /**
   * 기본 배송지 조회
   */
  getDefaultAddress: async (userId: number): Promise<AddressResponse | null> => {
    const address = await db.address.findFirst({
      where: { userId, isDefault: true },
    });

    return address;
  },
};
