import { Router } from "express";
import { validateRequest, validateQuery } from "@msa/request";
import { PagedParamsSchema } from "@msa/request";
import { authMiddleware } from "@msa/authentication";
import { Page } from "@msa/response-data";

import { userAddressService } from "@/services/user-address.service";
import { CreateAddressSchema, UpdateAddressSchema, AddressResponse } from "./address.dto";

const router = Router();

/**
 * 배송지 생성
 * POST /api/users/:userId/addresses
 */
router.post("/:userId/addresses", authMiddleware(), validateRequest(CreateAddressSchema), async (req, res, _next) => {
  const userId = req.user!.id;
  const address = await userAddressService.createAddress(req.body, userId);
  res.created<AddressResponse>(address);
});

/**
 * 배송지 목록 조회
 * GET /api/users/:userId/addresses
 */
router.get("/:userId/addresses", authMiddleware(), validateQuery(PagedParamsSchema), async (req, res, _next) => {
  const userId = req.user!.id;
  const { pageNumber, pageSize } = req.query;
  const result = await userAddressService.getAddresses(userId, Number(pageNumber), Number(pageSize));
  res.success<Page<AddressResponse>>(result);
});

/**
 * 기본 배송지 조회
 * GET /api/users/:userId/addresses/default
 */
router.get("/:userId/addresses/default", authMiddleware(), async (req, res, _next) => {
  const userId = req.user!.id;
  const address = await userAddressService.getDefaultAddress(userId);
  res.success<AddressResponse>(address);
});

/**
 * 특정 배송지 조회
 * GET /api/users/:userId/addresses/:addressId
 */
router.get("/:userId/addresses/:addressId", authMiddleware(), async (req, res, _next) => {
  const addressId = Number(req.params.addressId);
  const userId = req.user!.id;
  const address = await userAddressService.getAddressById(addressId, userId);
  res.success<AddressResponse>(address);
});

/**
 * 배송지 수정
 * PUT /api/users/:userId/addresses/:addressId
 */
router.put("/:userId/addresses/:addressId", authMiddleware(), validateRequest(UpdateAddressSchema), async (req, res, _next) => {
  const addressId = Number(req.params.addressId);
  const userId = req.user!.id;
  const address = await userAddressService.updateAddress(req.body, addressId, userId);
  res.success<AddressResponse>(address);
});

/**
 * 배송지 삭제
 * DELETE /api/users/:userId/addresses/:addressId
 */
router.delete("/:userId/addresses/:addressId", authMiddleware(), async (req, res, _next) => {
  const addressId = Number(req.params.addressId);
  const userId = req.user!.id;
  await userAddressService.deleteAddress(addressId, userId);
  res.noContent();
});

export { router as addressRouter };
