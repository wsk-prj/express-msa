import { Router } from "express";
import { validateRequest } from "@msa/request";
import { authMiddleware } from "@msa/authentication";

import { userAddressService } from "@/services/user-address.service";
import { CreateAddressSchema, UpdateAddressSchema, AddressResponse, AddressListResponse } from "./address.dto";

const router = Router();

/**
 * 주소 생성
 * POST /api/users/:userId/addresses
 */
router.post("/:userId/addresses", authMiddleware(), validateRequest(CreateAddressSchema), async (req, res, _next) => {
  const userId = Number(req.params.userId);
  const address = await userAddressService.createAddress(req.body, userId);
  res.created<AddressResponse>(address);
});

/**
 * 주소 목록 조회
 * GET /api/users/:userId/addresses (전체 주소 조회)
 * GET /api/users/:userId/addresses?isDefault=true (기본 배송지만 조회)
 */
router.get("/:userId/addresses", authMiddleware(), async (req, res, _next) => {
  const userId = Number(req.params.userId);
  const isDefaultOnly = req.query.isDefault === "true";

  if (isDefaultOnly) {
    const address = await userAddressService.getDefaultAddress(userId);
    if (!address) {
      return res.success(null);
    }
    return res.success<AddressResponse>(address);
  }

  const result = await userAddressService.getAddresses(userId);
  res.success<AddressListResponse>(result);
});

/**
 * 특정 주소 조회
 * GET /api/users/:userId/addresses/:addressId
 */
router.get("/:userId/addresses/:addressId", authMiddleware(), async (req, res, _next) => {
  const addressId = Number(req.params.addressId);
  const userId = Number(req.params.userId);
  const address = await userAddressService.getAddressById(addressId, userId);
  res.success<AddressResponse>(address);
});

/**
 * 주소 수정
 * PUT /api/users/:userId/addresses/:addressId
 */
router.put("/:userId/addresses/:addressId", authMiddleware(), validateRequest(UpdateAddressSchema), async (req, res, _next) => {
  const addressId = Number(req.params.addressId);
  const userId = Number(req.params.userId);
  const address = await userAddressService.updateAddress(req.body, addressId, userId);
  res.success<AddressResponse>(address);
});

/**
 * 주소 삭제
 * DELETE /api/users/:userId/addresses/:addressId
 */
router.delete("/:userId/addresses/:addressId", authMiddleware(), async (req, res, _next) => {
  const addressId = Number(req.params.addressId);
  const userId = Number(req.params.userId);
  await userAddressService.deleteAddress(addressId, userId);
  res.noContent();
});

export { router as addressRouter };
