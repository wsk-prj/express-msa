import { z } from "zod";

// 주소 생성 DTO
export const CreateAddressSchema = z.object({
  name: z.string().min(1, "배송지명은 필수입니다").max(20, "배송지명은 20자를 초과할 수 없습니다"),
  phone: z.string().regex(/^01[0-9]-\d{3,4}-\d{4}$/, "올바른 전화번호 형식이 아닙니다"),
  address: z.string().min(1, "주소는 필수입니다").max(100, "주소는 100자를 초과할 수 없습니다"),
  detailAddress: z.string().max(100, "상세주소는 100자를 초과할 수 없습니다").optional(),
  zipCode: z.string().regex(/^\d{5}$/, "우편번호는 5자리 숫자여야 합니다"),
  isDefault: z.boolean().default(false),
});

// 주소 수정 DTO
export const UpdateAddressSchema = z.object({
  name: z.string().min(1, "배송지명은 필수입니다").max(20, "배송지명은 20자를 초과할 수 없습니다").optional(),
  phone: z.string().regex(/^01[0-9]-\d{3,4}-\d{4}$/, "올바른 전화번호 형식이 아닙니다").optional(),
  address: z.string().min(1, "주소는 필수입니다").max(100, "주소는 100자를 초과할 수 없습니다").optional(),
  detailAddress: z.string().max(100, "상세주소는 100자를 초과할 수 없습니다").optional(),
  zipCode: z.string().regex(/^\d{5}$/, "우편번호는 5자리 숫자여야 합니다").optional(),
  isDefault: z.boolean().optional(),
});

export type CreateAddressDto = z.infer<typeof CreateAddressSchema>;
export type UpdateAddressDto = z.infer<typeof UpdateAddressSchema>;

// 응답 타입들
export interface AddressResponse {
  id: number;
  name: string;
  phone: string;
  address: string;
  detailAddress: string | null;
  zipCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
